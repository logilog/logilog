# MCP PolicyCompare SaaS (v1)

PolicyCompare, sigorta poliçelerini yapay zekâ ile çıkarıp kıyaslamaya odaklanan çoklu-tenant bir SaaS uygulamasıdır. Kullanıcılar PDF/IMG poliçelerini yükler, yapay zekâ teminat ve istisnaları standart bir şemaya normalize eder, ardından iki veya daha fazla poliçe arasında farkları ve önerileri raporlar.

## Özellikler

- Next.js 15 App Router + TypeScript ile SSR/ISR desteği
- NextAuth tabanlı çoklu sağlayıcı kimlik doğrulaması
- Prisma + PostgreSQL ile çoklu tenant şeması
- Stripe abonelikleri ve 1 günlük deneme desteği
- OpenAI ile poliçe çıkarımı ve karşılaştırması
- Cloudflare R2/S3 üzerinde dosya depolama
- AES-256-GCM ile kullanıcı OpenAI anahtarını şifreleme
- RBAC, organizasyon ve kullanım kontrolü

## Başlangıç

```bash
pnpm install
pnpm dlx prisma generate
pnpm dlx prisma migrate dev
pnpm dev
```

## Yapı

```
app/
  (marketing)/page.tsx
  (dashboard)/dashboard/page.tsx
  api/
    compare/route.ts
    ocr/route.ts
    openai/save-key/route.ts
    stripe/webhook/route.ts
    usage/route.ts
  auth/[...nextauth]/route.ts
  layout.tsx
  globals.css
components/
  CompareForm.tsx
  FileDropzone.tsx
  Navbar.tsx
  Pricing.tsx
lib/
  ai.ts
  auth.ts
  billing.ts
  crypto.ts
  prisma.ts
  r2.ts
  stripe.ts
prisma/
  schema.prisma
scripts/
  seed.ts
```

## Ortam Değişkenleri

`.env.example` dosyasında gerekli tüm değişkenler listelenmiştir. `ENCRYPTION_KEY_BASE64` değeri için `openssl rand -base64 32` komutu ile 32 baytlık anahtar üretin.

## Lisans

MIT
