# NOKTA Spec-Agent v3.0 - Track 1

**Öğrenci:** Utku Uzun  
**Öğrenci No:** 231118062  
**Seçilen Track:** Track A (Spec-Agent)

## 🎥 Demo Videosu
https://youtube.com/shorts/-003udxYV78

## 📱 Expo & APK Durumu
- **Android APK:** Uygulamanın en güncel derlemesi olan `app-release.apk` dosyası proje klasöründe mevcuttur.
- **Expert Support (HITL):** Uygulama içerisine, AI raporlarını kıdemli mühendislere onaya gönderen "Uzman Onay Talebi" (Human-in-the-Loop) iş akışı butonu başarıyla entegre edilmiştir.

## 📋 Karar Günlüğü (Decision Log)
1. **Model Seçimi:** Ham fikirleri analiz edip mühendislik kısıtlarını (problem, user, scope, constraint) en doğru şekilde çıkarabilmek için akıl yürütme yeteneği yüksek olan **Gemini 3 Flash Preview** modeli tercih edildi.
2. **Mimari:** "Slop" (yığın/çöp) oluşumunu engellemek adına serbest chat yerine, kullanıcıyı adım adım engineering sorularına yönlendiren sınırlandırılmış bir **Agentic Workflow** kurgulandı.
3. **UI/UX & Paylaşım:** Hızlı prototipleme ve kolay dağıtım için **React Native (Expo)** kullanıldı. Üretilen profesyonel spec çıktılarının anında paylaşılabilmesi için Native Share API entegrasyonu sağlandı.
4. **Human-in-the-Loop (HITL) Entegrasyonu:** Saf AI jenerasyonuna güvenmemek ve hocanın belirttiği "Uzman Desteği" vizyonunu yakalamak adına, üretilen raporların uzmanlar tarafından onaylanmasını sağlayan "Expert Review" mimarisi koda entegre edildi.
5. **Güvenlik:** API anahtarlarının açıkta kalmaması için `env` yönetimi planlandı ve proje standartlarına uygun hale getirildi.

## 📂 Dosya Yapısı
- `app/`: React Native (Expo) kaynak kodları (Expert Review HITL buton entegreli).
- `idea.md`: Nokta Ekosistem Spektoskopisi ve HITL Mimarisi Vizyonu.
- `app-release.apk`: Test edilebilir, uzman onay butonunu içeren Android çıktısı.