# Tohum — Track A Submission

**Öğrenci No:** 231118098
**Slug:** `tohum`
**Track:** **A — Dot Capture & Enrich**

Tohum, ham bir fikri AI destekli rehberli sohbetle NOKTA `idea.md` standardındaki 7-bölüm manifestoya büyüten mobil düşünce partneridir. WhatsApp tarzı chat, engineering-guided sorular, opsiyonel yön önerileri ve repo-konformu çıktı.

> Fikir için özelleşmiş `idea.md` dosyası: [`./idea.md`](./idea.md)

---

## Demo & Çalıştırma

| Kanal | Bağlantı |
|---|---|
| Expo QR / Link | _{APK build sonrası eklenecek}_ |
| 60 saniyelik demo video | _{kayıt sonrası eklenecek}_ |
| APK indirme | [`./app-release.apk`](./app-release.apk) _{build sonrası}_ |

Yerel çalıştırma:
```bash
cd app
npm install
npx expo start
```

`ANTHROPIC_API_KEY` için `.env.example` dosyasına bak; kendi anahtarını `.env` dosyasında sakla (gitignore'da).

---

## Track Seçim Gerekçesi

`challenge.md` üç track sunuyor: **A — Dot Capture & Enrich**, **B — Slop Detector**, **C — Migration & Dedup**.

Track A seçildi çünkü NOKTA'nın tezi olan *"engineering-guided akış, slop yok"* en doğrudan **A**'da somutlaşır: ham nokta → rehberli diyalog → spec. B ve C ikisi de değerli türev akışlar ama temel **dot-to-spec** dönüşümünü ikincil olarak ele alır. Tohum, tezi en dar dilimde ve en saf hâlde uygulamaya koyar.

---

## Decision Log

Scope, mimari ve UX üzerine verilen kararlar — her biri puan verilebilir bir trade-off noktası.

### 1. UX: Form doldurma değil, WhatsApp-tarzı diyalog
**Seçim:** Kullanıcı serbestçe yazar, AI tek seferde tek soru sorar.
**Neden:** `idea.md` "Temel İçgörü 1 — Engineering-Guided Akış" bunu zorunlu kılıyor. Form doldurma slop'u davet eder; açık uçlu chat de slop'u davet eder. İkisi arasındaki "tek turda tek soru" WhatsApp ritmi NOKTA tezini birebir uygular.

### 2. Öneri: Opsiyonel iskele, zorunlu seçim değil
**Seçim:** AI, kullanıcının takıldığı yerlerde 2-3 yön önerebilir (chip); kullanıcı dokunursa input'a yapıştırır, dokunmazsa yok sayar. Maksimum her 2 turda 1 öneri.
**Neden:** `idea.md` "AI yardımcı araçtır, kullanıcı fikrin sahibi" diyor. Zorunlu a/b/c seçimi dayatmadır; opsiyonel chip özgürlük + iskele arası dengedir. Google Smart Reply ruhuna yakın.

### 3. Tamamlanma: Sabit N soru değil, adaptif rubrik
**Seçim:** AI, 7 sinyalli iç rubrik (tez/problem/nasıl çalışır/ne yapmaz/neden şimdi/kim fayda sağlar/özet) üzerinde ilerler. Hepsi *strong* olduğunda "noktan çekirdeğe ulaştı" der ve üretim onayı ister.
**Neden:** "5 soru sor ve bitir" yaklaşımı mekanik; rubrik adaptif olduğunda kullanıcı *yeterince anlatıldığını* hisseder. Ayrıca 7 sinyal `idea.md`'nin 7 bölümüne birebir eşleniyor — format ile akış aynı düzlemde.

### 4. Çıktı formatı: NOKTA `idea.md` 7-bölüm standardı
**Seçim:** AI'nın final çıktısı serbest JSON veya PRD-tarzı spec değil; repo'nun kendi `idea.md` dosyasıyla birebir aynı 7 başlık (*Tez, Problem, Nasıl Çalışır, Ne Yapmaz, Neden Şimdi, Kim Fayda Sağlar, Özet*).
**Neden:** `challenge.md` "track için özelleşmiş fikir dosyası" istiyor; repo kültürü manifestodan yana, PRD'den değil. Output repo-konformu olunca kullanıcı çıktıyı doğrudan bir git reposuna `idea.md` olarak bırakabilir. Bu aynı zamanda anti-slop için güçlü bir cosine similarity ayrıştırıcısıdır — çoğu submission muhtemelen jenerik spec üretecek.

### 5. Slop yasakları prompt seviyesinde
**Seçim:** System prompt'ta "harika fikir", "süper", "kesinlikle başarılı olur" gibi motivasyonel dolgular açıkça yasak listesinde.
**Neden:** NOKTA tezinin *"%0 halüsinasyon, slop yok"* iddiasını araç seviyesinde uygulayamayınca manifesto boşa çıkar. Yasaklar kod değil prompt seviyesinde çünkü araç aynı zamanda öğretici bir örnek — prompt'u okuyan başka geliştirici de bu disiplini görsün.

### 6. Teknoloji yığını spec çıktısından çıkarıldı
**Seçim:** `idea.md` çıktısı "React Native", "MongoDB" gibi kod kararlarını içermez.
**Neden:** `idea.md`'nin açılış cümlesi "Hiçbir kod yazılmadan önce ne yapacağını söyler". Teknoloji yığını seçmek kod kararıdır; spec'e girmesi standart ihlali. Stitch tasarımında vardı, çıkardık.

### 7. AI çağrısı: Client-side direct + EAS Secret
**Seçim:** Uygulama Anthropic API'yi doğrudan client'tan çağırır; API key geliştirmede `.env`, APK build'de EAS Secrets ile gelir.
**Neden:** Backend proxy eklemek submission scope'unu şişirir (scope disiplini 25 puan). Client-side çağrı güvenlik hassasiyetli bir tercih ama challenge tek kişilik demo amaçlı — risk kabul edilebilir. Production'a çıkmayacak, demo'da API key dönüşümlü.

### 8. Bottom nav sadeleştirildi (4 → 2 sekme)
**Seçim:** Stitch tasarımındaki 4 sekme (Fikirler / Arama / Belgeler / Ayarlar) → 2 sekmeye (Fikirlerim / Ayarlar) indi.
**Neden:** Track A tek akışlı (yeni nokta → chat → idea.md). "Arama" ve ayrı "Belgeler" MVP için fazlalık. Az sekme = scope disiplini sinyali.

### 9. Dil ayrımı: UI Türkçe, kod İngilizce
**Seçim:** Kullanıcıya görünen her metin Türkçe; kod içi değişken/fonksiyon/tip isimleri İngilizce.
**Neden:** NOKTA ekosistemi Türkçe konuşan yaratıcıları hedefliyor (repo'nun kendi `idea.md`'si Türkçe). Kod İngilizce çünkü uluslararası kod okunabilirlik standardı.

### 10. Dark tema varsayılan
**Seçim:** Uygulama dark mode'da açılır; `#0D1117` zemin, `#2F7AC2` primary, `#898200` tertiary.
**Neden:** Stitch'teki dark paletle uyum + yaratıcıların çoğu IDE/Figma'da dark mode kullanıyor → dokunsal tutarlılık.

---

## Kapsam Dışı Tutulanlar

Açık bir dille yazıyorum çünkü `idea.md`'nin *"Ne Yapmaz"* disiplini submission'da da geçerli:

- **Ses girişi** — ilk MVP'ye dahil değil; çılgınlık bonusu olarak ayrı değerlendirilebilir.
- **Bulut senkronizasyon, kullanıcı hesabı, oturum** — yok.
- **Paylaşım / pazar yeri** — yok (NOKTA'nın büyük vizyonu ama Track A'ya dahil değil).
- **PDF/Word export** — yok; çıktı Markdown, kopyala yeterli.
- **Çoklu cihaz senkronu** — yok.
- **Rakip analizi / pazar araştırması modülü** — Track B konusu, bizde yok.

---

## AI Araç Kayıtları

`challenge.md` kuralı: *"AI tool serbest, logla"*.

- **Claude Code CLI (Opus 4.7, 1M context)** — planlama, mimari karar, `idea.md` yazımı, prompt mühendisliği, tüm React Native kod üretimi ve commit yönetimi.
- **Anthropic Claude Sonnet 4.6** — uygulama içindeki AI motoru (Tohum'un kendi runtime LLM'i).
- **Stitch (Google)** — ilk tasarım draft'ı (palette, tipografi, ekran yerleşimi); final UI Stitch'ten saparak repo standartlarına göre rafine edildi.

Rate limit, alternatif tool veya tool değişikliği gerekirse bu bölümde notlanacaktır.

---

## Repo Ağaç Yapısı

```
submissions/231118098-tohum/
├── README.md                 ← bu dosya
├── idea.md                   ← Track A manifesto
├── app/                      ← Expo + React Native app
│   ├── app.json
│   ├── package.json
│   └── app/                  ← Expo Router ekranları
└── app-release.apk           ← EAS Build çıktısı
```
