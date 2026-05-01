# 🇹🇷 Nuvio Türkçe Provider Reposu

Kraptor'un CloudStream reposundaki tüm Türkçe provider'lar Nuvio için JavaScript'e uyarlanmıştır.

## 📦 Repo URL

```
https://raw.githubusercontent.com/Sezo88/kuki/main/manifest.json
```

> Nuvio → Settings → Plugins → Add Repository

---

## 📊 Provider Listesi (79 provider)

### 🎬 Film
SinemaCX · JetFilmizle · FullHDFilmizlesene · HDFilmCehennemi · FilmMakinesi · FilmModu · FilmEkseni · SetFilmIzle · UgurFilm · KultFilmler · YesilCamTv · Sinezy · Sinefy · BelgeselX · RareFilmm · SuperFilmGeldi · NetflixMirror · FullHDFilm · HDFilmIzle · FilmKovası · FilmHane · WFilmIzle · AsyaFilm · YTS · FlixHQ

### 📺 Dizi
SineWix · DiziFilm · DiziYou · Dizilla · DiziMom · DiziPal · DiziBox · DiziMag · DiziGom · DiziYoo · DiziWatch · SezonlukDizi · Watch2Movies · InatBox · RecTV · YeniWatch · YabanciDizi · RoketDizi · IzleAI · DiziLife · DiziCan · Dizist · TVDiziler · TrDiziIzle · SezonlukFilm · DiziAsia · DiziAsya · BirAsyaDizi · GolgeTV · DiziKorea

### 🎌 Anime
TurkAnime · TrAnimeIzle · AnimeciX · OpenAnime · CizgiMax · CizgiveDizi

### 🌏 Asya & Kore
KoreanTurk · WebDramaTurkey · DiziKorea · DiziAsia · DiziAsya

### 📡 Canlı TV
KanalD · ShowTV · ATV · StarTV · TV8 · Teve2 · DMAX · TRT1 · TRTÇocuk · NowTV · GinikoCanli · KickTR

### 🌐 Uluslararası
SelcukFlix · MirrorVerse · OnePaceTr · FlixHQ · YTS · RareFilmm · WebteIzle

---

## 🤖 Otomatik URL Takip Sistemi

Her gün **07:00 TR saatinde** GitHub Actions:
1. 79 provider URL'ini kontrol eder
2. Erişilemeyen siteler için alternatif domainler dener
3. Yeni domain bulursa `config.json` + provider JS otomatik güncellenir
4. Değişiklik commit+push edilir

---

## 🛠️ Kurulum

```bash
# 1. Repoyu klonla
git clone https://github.com/Sezo88/kuki

# 2. Provider'ları yeniden üret (isteğe bağlı)
REPO_OWNER=Sezo88 node generate-providers.js

# 3. Local test sunucusu
node server.js
# → http://BILGISAYAR_IP:3000/manifest.json
```

---

## ⚠️ DMCA

Bu repo yalnızca bir tarayıcı gibi URL yönlendirmesi yapar. Hiçbir içerik barındırılmaz.
