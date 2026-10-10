> Historical V7.1 report. Current status and limitations: [7.1.1 audit](AUDIT_AND_RELEASE_FA.md).

# وضعیت انتشار German Library v7.1

تاریخ بازبینی: 2026-10-07

## وضعیت فعلی

German Library v7.1 از نظر کد منبع، معماری محتوا، Mobile-first UI/Admin، اعتبارسنجی داده، امنیت پایه، build production و QA خودکار در وضعیت **Production-ready source / Ready for staging** است.

این عبارت به معنی «سایت هم‌اکنون Live است» نیست. انتشار نهایی عمداً تا زمان اتصال یک Supabase project اختصاصی و اجرای smoke test روی deployment واقعی متوقف می‌ماند.

## موارد تکمیل‌شده

- مدل نهایی محتوا: Level → Core Book / Other Books → Book Assets → Skill Resources.
- پشتیبانی از چند کتاب در هر سطح CEFR و مجموعه مستقل Special Books.
- رابط عمومی و Admin با رویکرد Mobile-first.
- Draft / Published / Archived، Content Health، Import/Export و private file storage workflow.
- جلوگیری از Published Resource بدون URL معتبر یا Storage path.
- جلوگیری از Core Book غیر Published و ناسازگاری Book/Resource در سه لایه Admin، validator و database.
- RLS، least-privilege grants و Storage policyهای private برای Supabase.
- استفاده از Supabase publishable key جدید و جلوگیری از قرارگرفتن secret/service-role key در frontend.
- Supabase JS SDK با نسخه دقیق pin شده است.
- Sync ادمین به changed-row upsert تبدیل شده و archive ضمنی snapshot حذف شده است.
- pending-sync در LocalStorage ماندگار است؛ editهای offline پس از reload/reconnect بازیابی و retry می‌شوند.
- تست regression برای archive parent/child، offline retry و حفظ remote editهای entityهای دست‌نخورده اضافه شده است.
- security headers، cache policy، web manifest، robots و sitemap build-time آماده‌اند.
- build production فقط فایل‌های public لازم را به `dist/` می‌فرستد و SQL/docs/dev tooling را deploy نمی‌کند.
- secret scan منبع: بدون service-role/secret/private key یا Supabase project URL واقعی hard-code شده.
- لینک‌های starter catalog در 2026-10-07 بازبینی شده‌اند و لینک‌های stale Hueber جایگزین شده‌اند.

## QA فعلی

`npm run qa` باید این سه مرحله را پاس کند:

1. Static QA برای HTML/CSS/JS، metadata، local links، inline scripts و secret/config rules.
2. Content QA برای CEFR/collection/book/resource consistency.
3. Backend Sync QA برای failure/reconnect/concurrency-sensitive paths.

Production artifact نیز با `npm run build` و سپس `npm run verify:dist` بررسی می‌شود.

Browser E2E داخل محیط فعلی قابل اعتماد نبود؛ Chromium محیط اجرا حتی روی صفحه بسیار ساده hang می‌کرد. بنابراین browser E2E **پاس‌شده اعلام نمی‌شود** و باید روی Preview deployment واقعی انجام شود.

## موارد باقی‌مانده برای Live Production

1. ساخت یک Supabase project اختصاصی برای German Library.
2. اعمال schema و در صورت نیاز seed، سپس ساخت Admin user و promotion امن role.
3. اجرای Supabase Security/Performance Advisors و `backend/post-deploy-check.sql`.
4. دریافت Project URL و publishable key و ساخت production `dist/` واقعی.
5. Preview deployment روی Vercel و HTTP/security smoke check.
6. تست دستی روی iPhone Safari، Android Chrome و یک مرورگر Desktop؛ شامل Auth، Admin bottom sheet، keyboard، upload، signed files، offline/reconnect و session expiry.
7. Promote همان build تست‌شده به Production و بررسی runtime logs.

## Blocker خارجی فعلی

اکانت متصل Supabase یک Organization قابل مشاهده دارد: `cianium's Org` روی Free plan. برای ساخت project جدید، انتخاب Organization و تأیید هزینه احتمالی باید صریحاً توسط مالک حساب انجام شود. به همین دلیل هیچ پروژه موجودی بدون اجازه به German Library اختصاص داده نشده و هیچ دیتابیس نامرتبطی دست‌کاری نشده است.

پس از این تأیید، مسیر backend → preview → smoke test → production قابل اجرا است.
