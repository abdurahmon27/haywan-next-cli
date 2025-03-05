# Haywan Frontend CLI 🚀

## Umumiy Ma'lumot

Haywan Frontend CLI - bu zamonaviy Next.js loyihalarini xalqarolashtirish, interfeys komponetlari va eng yaxshi amaliyotlar bilan tezda yaratishga mo'ljallangan kuchli va maxsus CLI vositasidir. Haywan.uz tomonidan ishlab chiqilgan, ushbu o'rnatuvchi murakkab veb-ilovalarni boshlang'ich sozlamasini soddalashtiradi.

## Imkoniyatlar 🌟

- **Next.js Loyiha Yaratish**: To'liq moslashuvchan Next.js loyiha ishga tushirish
- **Xalqarolashtirish**: `next-intl` bilan oson integratsiya
- **Interfeys Komponetlari**: ShadCN UI komponetlarini osongina o'rnatish
- **TypeScript Qo'llab-quvvatlashi**: Birinchi darajali TypeScript konfiguratsiyasi
- **Tailwind CSS**: Integratsiyalangan Tailwind CSS sozlamalari
- **Moslashuvchan Konfiguratsiya**: Loyiha yaratishning yuqori darajada moslanishi

## Oldindan tayyorlash

- Node.js (v20+ tavsiya etiladi)
- npm (v9+)

## O'rnatish

Haywan Frontend CLI global ravishda o'rnatishingiz mumkin:

```bash
npm install -g haywan-next-cli
```

## Foydalanish

### Yangi Loyiha Yaratish

```bash
npx haywan-next-cli
```

### Interaktiv Konfiguratsiya

O'rnatuvchi sizga loyihangizni moslashtirishga imkon beruvchi interaktiv CLI taqdim etadi:

1. **Loyiha Nomi**: Loyihangiz uchun nom tanlang
2. **Texnologiyalar To'plami**:
   - TypeScript
   - ESLint
   - Tailwind CSS
   - App Router
3. **Xalqarolashtirish**: Qo'llab quvvatlanadigan tillarni sozlang
4. **Interfeys Komponetlari**: ShadCN UI komponetlarini tanlang

## Loyiha Tuzilishi

O'rnatishdan so'ng, loyihangiz quyidagi tuzilishga ega bo'ladi:

```
sizning-loyihangiz/
├── src/
│   ├── app/
│   ├── components/
│   ├── i18n/
│   └── locales/
├── next.config.js
├── tsconfig.json
└── package.json
```

## Kiritilgan Konfiguratsiyalar

- Avtomatik Next.js konfiguratsiyasi
- Xalqarolashtirish marshrutizatsiyasi
- ShadCN UI komponetlari
- Standart til sozlamalari (O'zbekcha, Inglizcha, Ruscha)

## Moslash

### Lokalizatsiya

`locales/` katalogidagi til fayllarini o'zgartiring:

- `uz.json`
- `en.json`
- `ru.json`

### Marshrutizatsiya

Til boshqaruvini moslash uchun `src/i18n/routing.ts`ni tahrirlang.

## Hissa Qo'shish

Hissa qo'shishingiz mumkin! Quyidagi bosqichlarni bajairing:

1. Repozitoriyani kloning qilinish
2. Xususiyat tarmogini yarating
3. O'zgarishlarni commit qiling
4. O'zgarishlarni yuklang
5. So'rovni yaratish uchun torting

## Qo'llab-quvvatlash

Donat uchun? [https://haywan.uz/blog/support](https://haywan.uz/blog/support) saytiga tashrif buyuring

## Litsenziya

MIT Litsenziyasi

## Kimlar tomonidan yaratilgan

[Haywan.uz](https://haywan.uz)
