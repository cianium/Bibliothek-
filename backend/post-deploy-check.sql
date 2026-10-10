-- German Library v7.1 — post-deploy integrity checks (read-only)
-- Expected: all issue counts below are 0. Catalog counts depend on whether seed.sql was applied.

select 'levels' as metric, count(*)::bigint as value from public.levels
union all select 'courses', count(*) from public.courses
union all select 'resources', count(*) from public.resources
union all select 'published_resources', count(*) from public.resources where status='published';

select 'published_resource_without_access' as issue, count(*)::bigint as count
from public.resources
where status='published' and nullif(btrim(source_url),'') is null and nullif(btrim(source_storage_path),'') is null
union all
select 'invalid_external_url', count(*) from public.resources
where btrim(source_url)<>'' and btrim(source_url) !~* '^https?://'
union all
select 'special_resource_without_book', count(*) from public.resources
where collection='special' and course_id is null
union all
select 'resource_course_context_mismatch', count(*)
from public.resources r join public.courses c on c.id=r.course_id
where r.collection<>c.collection
   or (c.collection='level' and r.level_code is distinct from c.level_code)
   or (c.collection='special' and r.level_code is not null)
union all
select 'published_resource_with_unpublished_book', count(*)
from public.resources r join public.courses c on c.id=r.course_id
where r.status='published' and c.status<>'published'
union all
select 'invalid_core_book', count(*) from public.courses
where is_core and (collection<>'level' or status<>'published')
union all
select 'multiple_core_books_per_level', count(*)
from (select level_code from public.courses where is_core and status<>'archived' group by level_code having count(*)>1) x;

select schemaname,tablename,policyname,roles,cmd
from pg_policies
where schemaname in ('public','storage')
  and tablename in ('profiles','levels','courses','resources','objects')
order by schemaname,tablename,policyname;
