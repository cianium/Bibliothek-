# چک‌لیست انتشار German Library v7.1

## وضعیت فعلی

کد frontend، مدل محتوا، Admin mobile-first، validation، build production، baseline security headers و QA خودکار آماده‌اند. این نسخه برای اتصال به backend واقعی و staging آماده است.

## قبل از Production — الزامی

- [ ] یک Supabase project اختصاصی برای German Library انتخاب/ایجاد شود.
- [ ] `backend/supabase-schema.sql` روی همان پروژه اعمال شود.
- [ ] در صورت نیاز `backend/seed.sql` اجرا شود.
- [ ] Admin user ساخته و role آن از trusted SQL/tool به `admin` تغییر کند.
- [ ] open sign-up برای Auth در صورت عدم نیاز غیرفعال شود.
- [ ] Security Advisor و Performance Advisor بدون issue بحرانی بررسی شوند.
- [ ] `backend/post-deploy-check.sql` بدون inconsistency اجرا شود.
- [ ] Publishable key و Project URL در Hosting تنظیم شوند؛ Secret/Service Role هرگز در frontend قرار نگیرد.
- [ ] Preview deployment ساخته شود.
- [ ] smoke test واقعی روی iPhone Safari + Android Chrome + Desktop انجام شود.
- [ ] Upload، private signed file، Draft/Published/Archived، logout/session expiry و network failure تست شوند.
- [ ] سپس همان build تست‌شده به Production promote شود.

## بعد از انتشار

- لینک‌های خارجی دوره‌ای بررسی شوند؛ سایت‌های ناشر ممکن است URL را تغییر دهند.
- قبل از تغییر schema، backup گرفته شود و Advisors دوباره اجرا شوند.
- Admin فقط برای افراد لازم ایجاد شود.
- قابلیت جدید فقط وقتی اضافه شود که رسیدن کاربر به منبع مناسب را سریع‌تر/واضح‌تر کند.

## Scope محافظت‌شده

German Library یک Resource Library + Roadmap است، نه LMS. Progress/Streak/Gamification/Quiz Engine/AI Tutor در v1 ضروری نیستند.
