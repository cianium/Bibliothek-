import fs from 'node:fs';
import vm from 'node:vm';

const sleep=ms=>new Promise(r=>setTimeout(r,ms));
const clone=o=>JSON.parse(JSON.stringify(o));
const store=new Map();
global.localStorage={getItem:k=>store.has(k)?store.get(k):null,setItem:(k,v)=>store.set(k,String(v)),removeItem:k=>store.delete(k)};
global.location={protocol:'https:',hostname:'example.test'};
Object.defineProperty(globalThis,'navigator',{value:{onLine:true},configurable:true});
global.CustomEvent=class{constructor(type,{detail}={}){this.type=type;this.detail=detail}};
const docListeners=new Map();
global.document={addEventListener:(n,fn)=>{if(!docListeners.has(n))docListeners.set(n,[]);docListeners.get(n).push(fn)},dispatchEvent:e=>{for(const fn of docListeners.get(e.type)||[])fn(e)}};
const winListeners=new Map();
global.window=global;
window.addEventListener=(n,fn)=>{if(!winListeners.has(n))winListeners.set(n,[]);winListeners.get(n).push(fn)};
const fireWindow=n=>{for(const fn of winListeners.get(n)||[])fn({type:n})};
window.GL_CONFIG={supabaseUrl:'https://abcdefghijklmnopqrst.supabase.co',supabasePublishableKey:'sb_publishable_test',syncDebounceMs:1,maxUploadBytes:1000000};

const db={
  profiles:[{id:'u1',role:'admin'}],
  levels:[{code:'A1',title_fa:'A1',title_en:'A1',description:'',sort_order:1}],
  courses:[{id:'c1',collection:'level',level_code:'A1',title:'Course',description:'',is_core:true,order_index:1,status:'published'}],
  resources:[{id:'r1',collection:'level',level_code:'A1',course_id:'c1',title:'Resource',description:'',type:'Website',skill:'Course',priority:'essential',provider:'P',source_url:'https://example.com',source_storage_path:'',pricing:'free',featured:false,duration_minutes:0,link_status:'ok',verified_at:'2026-10-07',order_index:1,status:'published'}]
};
let failNetwork=false,queryGate=null,currentUserId='u1';const ops=[];
class Query{
  constructor(table){this.table=table;this.kind='select';this.filters=[];this.payload=null}
  select(){this.kind='select';return this} order(){return this}
  update(payload){this.kind='update';this.payload=payload;return this}
  upsert(payload){this.kind='upsert';this.payload=Array.isArray(payload)?payload:[payload];return this}
  eq(k,v){this.filters.push([k,v]);return this}
  maybeSingle(){
    if(failNetwork)return Promise.resolve({data:null,error:{message:'offline'}});
    const rows=(db[this.table]||[]).filter(r=>this.filters.every(([k,v])=>r[k]===v));return Promise.resolve({data:rows[0]||null,error:null});
  }
  execute(){
    if(failNetwork)return {data:null,error:{message:'offline'}};
    if(this.kind==='select')return {data:clone(db[this.table]||[]),error:null};
    if(this.kind==='update'){
      ops.push(`update:${this.table}`);
      for(const row of db[this.table]||[])if(this.filters.every(([k,v])=>row[k]===v))Object.assign(row,clone(this.payload));
      return {data:null,error:null};
    }
    if(this.kind==='upsert'){
      ops.push(`upsert:${this.table}:${this.payload.map(x=>x.id||x.code).join(',')}`);
      const key=this.table==='levels'?'code':'id';
      for(const incoming of this.payload){const i=db[this.table].findIndex(x=>x[key]===incoming[key]);if(i>=0)db[this.table][i]={...db[this.table][i],...clone(incoming)};else db[this.table].push(clone(incoming))}
      return {data:null,error:null};
    }
    return {data:null,error:null};
  }
  then(resolve,reject){const gate=queryGate?.(this);return Promise.resolve(gate).then(()=>this.execute()).then(resolve,reject)}
}
const client={
  auth:{
    getSession:async()=>({data:{session:{user:{id:currentUserId,email:'admin@example.test'}}},error:null}),
    onAuthStateChange:()=>({data:{subscription:{unsubscribe(){}}}}),
    signOut:async()=>({error:null}),
    signInWithPassword:async()=>({data:{user:{id:'u1'}},error:null})
  },
  from:t=>new Query(t),
  storage:{from:()=>({})}
};
window.supabase={createClient:()=>client};
let localContent=null;
window.GL={
  clone,
  normalizeContent:clone,
  validateContent:()=>({ok:true,errors:[],warnings:[]}),
  saveContent:(c)=>{localContent=clone(c);return localContent},
  getContent:()=>clone(localContent),
  safeExternalUrl:s=>s
};

vm.runInThisContext(fs.readFileSync(new URL('../assets/backend.js',import.meta.url),'utf8'),{filename:'assets/backend.js'});
const assert=(cond,msg)=>{if(!cond)throw new Error(msg)};

await GLBackend.hydrate();
assert(localContent.courses[0].status==='published','hydrate failed');

// Archiving a book with a published child must unpublish/archive the child first.
localContent.courses[0].status='archived';localContent.levels.A1.coreCourseId=null;localContent.resources[0].status='archived';
GLBackend.scheduleContentSync(localContent);await sleep(30);
const rIndex=ops.findIndex(x=>x.startsWith('upsert:resources:r1')),cIndex=ops.findIndex(x=>x.startsWith('upsert:courses:c1'));
assert(rIndex>=0&&cIndex>=0&&rIndex<cIndex,'resource downgrade must sync before course downgrade');
assert(db.resources[0].status==='archived'&&db.courses[0].status==='archived','archive delta did not reach remote');
assert(!GLBackend.getStatus().pending,'pending sync should clear after success');

// Offline edit must survive failure, then merge over a freshly fetched remote base on reconnect.
ops.length=0;failNetwork=true;localContent.resources[0].title='Offline local title';GLBackend.scheduleContentSync(localContent);await sleep(30);
assert(GLBackend.getStatus().pending,'offline failure must keep pending sync');
assert(GLBackend.getStatus().status==='error','offline failure should surface an error');
// Another admin changes an untouched course while this client is offline.
db.courses[0].title='Remote admin title';
failNetwork=false;navigator.onLine=true;fireWindow('online');await sleep(40);
assert(db.resources[0].title==='Offline local title','pending local resource edit was not retried');
assert(db.courses[0].title==='Remote admin title','untouched remote course was overwritten by retry');
assert(!GLBackend.getStatus().pending,'pending sync should clear after reconnect success');

// A second edit made DURING the first write must survive completion of the first write.
let release,started;
const writing=new Promise(r=>started=r);
queryGate=q=>{if(q.kind==='upsert'&&q.table==='resources'){queryGate=null;started();return new Promise(r=>release=r)}};
localContent.resources[0].title='First write';GLBackend.scheduleContentSync(localContent);
await writing;
localContent.resources[0].title='Newer edit';GLBackend.scheduleContentSync(localContent);
release();await GLBackend.retryPendingSync();
assert(db.resources[0].title==='Newer edit','in-flight completion lost the newer edit');
assert(!GLBackend.getStatus().pending,'newer revision did not finish');

// An edit made during remote refresh must be merged, not replaced by the old pending snapshot.
let releaseRead,readStarted;
const reading=new Promise(r=>readStarted=r);
queryGate=q=>{if(q.kind==='select'&&q.table==='resources'){queryGate=null;readStarted();return new Promise(r=>releaseRead=r)}};
localContent.resources[0].title='Before read';GLBackend.scheduleContentSync(localContent);
await reading;
localContent.resources[0].title='During read';GLBackend.scheduleContentSync(localContent);
releaseRead();await GLBackend.retryPendingSync();
assert(db.resources[0].title==='During read','refresh overwrote a newer edit');

// Account B must never replay account A's offline changes.
failNetwork=true;localContent.resources[0].title='User A private pending';GLBackend.scheduleContentSync(localContent);await sleep(20);
assert(GLBackend.getStatus().pending,'user A pending missing');
failNetwork=false;currentUserId='u2';db.profiles.push({id:'u2',role:'admin'});await GLBackend.refreshAuth();
assert(!GLBackend.getStatus().pending,'pending content leaked across accounts');
currentUserId='u1';await GLBackend.refreshAuth();await GLBackend.retryPendingSync();
assert(db.resources[0].title==='User A private pending','owner could not resume pending changes');
console.log('Backend sync QA: 0 error(s); archive, offline, concurrent read/write, account isolation passed');
