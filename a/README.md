# 🏢 Apartman Aidat Sistemi — Local Versiyon

## ✅ Kurulum Gerekmez!
Hiçbir şey yüklemenize gerek yok. Sadece:
1. ZIP'i açın
2. `index.html` dosyasını tarayıcıda açın
3. Kullanmaya başlayın

## 🔑 Giriş Bilgileri
| Kullanıcı | Daire No | Şifre |
|-----------|---------|-------|
| Yönetici | 0 | 5555 |
| Sakinler | Kendi daire no | 5555 |

## 🌐 Online Kullanım (GitHub Pages)
1. GitHub'da yeni bir repo açın
2. Tüm dosyaları yükleyin
3. Settings → Pages → Branch: main → Save
4. Siteniz: `https://KULLANICIADINIZ.github.io/REPOADI`

**ÖNEMLİ:** Her cihaz kendi localStorage'ını kullanır.  
Verileri taşımak için: **Ayarlar → Dışa Aktar** → JSON dosyasını diğer cihaza kopyala → **İçe Aktar**

## 📱 Telefonda Kullanım
GitHub Pages linkini telefonunuzda açın.  
Ana ekrana ekleyin (PWA gibi kullanabilirsiniz).

## 🗄️ Veri Yönetimi (Panel → alt kısım)
- **📤 Dışa Aktar** — Tüm verileri JSON dosyasına kaydet (yedek al)
- **📥 İçe Aktar** — Başka cihazdan aldığınız JSON'u yükle (taşı)
- **🗑️ Temizle** — Tüm verileri sil

## ⚙️ Ayarlar Menüsü
- Apartman adını değiştir
- **Sistem başlangıç yılı/ayı** — Borç ve kasa hesabı bu tarihten başlar
- Toplu aidat borcu oluştur (ayda bir çalıştırın)
- Yönetici şifresini değiştir

## 📅 Aylık Yapılacaklar
1. **Ayarlar** → "Toplu Aidat Borcu Oluştur" → Ay ve yılı seç → Oluştur
2. Sakinler ödeme yaptıkça: **Borç & Toplu Ödeme** → Sakin seç → Tutar gir → Kaydet → WA Gönder

## 📁 Dosya Yapısı
```
apartman/
├── index.html           ← Buradan açın
├── css/style.css
├── js/db.js             ← Tüm veri mantığı
└── pages/
    ├── panel.html       ← Yönetici ana menü
    ├── ayarlar.html     ← Ayarlar + veri yönetimi
    ├── borc-odeme.html  ← Borç & toplu ödeme
    ├── aidatlar.html    ← Aidat listesi
    ├── kisiler.html     ← Kişi yönetimi
    ├── tarifeler.html   ← Aidat tarifeleri
    ├── gelir-ekle.html
    ├── gelirler.html
    ├── gider-ekle.html
    ├── giderler.html
    ├── raporlar.html    ← Raporlar + yazdır
    └── sakin-panel.html ← Sakin görünümü
```
