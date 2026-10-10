> Historical V7.1 report. Current status and limitations: [7.1.1 audit](AUDIT_AND_RELEASE_FA.md).

# گزارش نهایی بازبینی German Library v7

## انتخاب نسخه پایه

از بین سه نسخه تحویلی، **نسخه سوم (v6)** به‌عنوان پایه انتخاب شد. نسخه اول فقط یک صفحه استاتیک و فهرست‌محور بود. نسخه دوم hierarchy بصری بهتری داشت، اما به سمت LMS و قابلیت‌هایی مثل progress / continue learning رفته بود. نسخه سوم تنها نسخه‌ای بود که معماری چندصفحه‌ای، data model جدا از UI، Admin، Supabase، RLS، Storage، وضعیت Draft/Published/Archived و Content Health داشت.

## تغییر جهت محصول

v7 محصول را روی هدف اصلی نگه می‌دارد: **دسترسی سریع و هدایت‌شده به منابع**. قابلیت‌هایی که سایت را به LMS تبدیل می‌کنند در هسته محصول قرار نگرفته‌اند.

Hierarchy نهایی:

```text
Level
→ کتاب اصلی
→ کتاب‌های دیگر همان سطح
→ بسته هر کتاب
→ منابع همان کتاب
→ تمرین بر اساس مهارت
→ منابع پیشنهادی / اختیاری
```

برای کتاب‌های چندسطحی یا بدون CEFR نیز یک مسیر مستقل ایجاد شده است:

```text
کتاب‌های ویژه
→ بسته کتاب
→ منابع همان کتاب
```

## مشکلات مهمی که اصلاح شدند

- نمایش ناقص چند کتاب در یک Level: اکنون Core Book و Other Books هر دو پشتیبانی و نمایش داده می‌شوند.
- نبود مدل برای کتاب‌های چندسطحی: Collection مستقل `special` اضافه شد و `special.html` ساخته شد.
- Resource منتشرشده بدون URL/File: انتشار در Admin مسدود و در Content Health گزارش می‌شود.
- Resource منتشرشده زیر Book Draft: در Admin، validator و Supabase کنترل می‌شود.
- ناسازگاری Level/Collection بین Book و Resource: client validation و database trigger اضافه شد.
- دسترسی کند موبایل: bottom navigation ثابت و safe-area-aware برای صفحات عمومی اضافه شد.
- Admin موبایل: لیست card-based، editor به‌صورت bottom sheet، actionهای sticky و فرم‌های context-aware حفظ/تقویت شدند.
- دکمه‌های تکراری Resource Card: مسیر دسترسی مستقیم برای URLهای خارجی اضافه شد و فایل‌های Storage همچنان از مسیر امن resolve می‌شوند.
- Neomorphism پرکنتراست/سنگین: shadowها سبک‌تر و رنگ‌ها برای خوانایی بهتر اصلاح شدند.
- کنتراست متن‌ها و دکمه اصلی: نسبت‌های اصلی به حداقل 4.5:1 رسانده شدند.
- محتوای placeholder/بن‌بست: seed عمومی فقط منابعی را Published می‌کند که مسیر دسترسی دارند.
- منابع تجاری: به صفحات رسمی ناشر لینک داده می‌شوند؛ فایل تجاری بدون مجوز در seed قرار نگرفته است.

## Mobile-first UX

کاربر موبایل همیشه به چهار مقصد اصلی دسترسی سریع دارد: خانه، سطح‌ها، جست‌وجو و کتاب‌های ویژه. در صفحه Level ابتدا مسیر پیشنهادی و کتاب اصلی دیده می‌شود؛ سپس کتاب‌های دیگر و بعد Skill Practice. در Book Package منابع همان کتاب از بقیه محتوا جدا می‌مانند.

Admin نیز روی mobile به table وابسته نیست. مدیریت Resource و Book به‌صورت card و bottom-sheet انجام می‌شود، و تغییر Collection به‌طور خودکار requirementهای Level و Book Package را تغییر می‌دهد.

## وضعیت QA

Static QA نهایی بدون خطا عبور کرده است: syntax فایل‌های JS و inline scriptها، local targetها، duplicate IDها، `noopener`، balance CSS، Content Validation، access targetهای Published، context mismatch و contrastهای اصلی بررسی شده‌اند.

تست تعاملی واقعی روی Safari iOS و Chrome Android هنوز باید پس از deploy واقعی انجام شود؛ مخصوصاً keyboard behavior در bottom sheet، upload فایل، auth/session، safe-area و signed Storage URL.
