#!/usr/bin/env node
// generate-providers.js
// Bu scripti bir kez çalıştır → providers/ klasörüne tüm JS dosyaları üretilir
// Kullanım: node generate-providers.js

var fs = require("fs");
var path = require("path");

var config = JSON.parse(fs.readFileSync("config.json", "utf8"));
var Sezo88 = process.env.REPO_OWNER || "Sezo88";
var CONFIG_URL = "https://raw.githubusercontent.com/" + Sezo88 + "/kuki/main/config.json";

// Kategoriler (manifest.json için)
var CATEGORIES = {
  // Film siteleri
  sinemacx:          { types: ["movie","tv"], lang: ["tr","en"], desc: "Türkçe dublaj/altyazılı film & dizi" },
  jetfilmizle:       { types: ["movie"],      lang: ["tr","en"], desc: "Full HD Türkçe dublaj film" },
  fullhdfilmizlesene:{ types: ["movie"],      lang: ["tr","en"], desc: "4K/Full HD film arşivi" },
  sinewix:           { types: ["movie","tv"], lang: ["tr","en","ja"], desc: "Film, dizi ve anime" },
  dizifilm:          { types: ["movie","tv"], lang: ["tr","en"], desc: "Yerli & yabancı dizi/film" },
  diziyou:           { types: ["tv"],         lang: ["tr","en"], desc: "Yabancı dizi izleme platformu" },
  hdfilmcehennemi:   { types: ["movie"],      lang: ["tr","en"], desc: "Geniş HD film arşivi" },
  dizilla:           { types: ["tv"],         lang: ["tr","en"], desc: "Yabancı dizi platformu" },
  dizimom:           { types: ["tv"],         lang: ["tr","en"], desc: "Türkçe altyazılı dizi" },
  dizipal:           { types: ["tv"],         lang: ["tr","en"], desc: "Güncel diziler" },
  dizibox:           { types: ["tv"],         lang: ["tr","en"], desc: "Dizi arşivi" },
  dizikorea:         { types: ["tv"],         lang: ["tr","ko"], desc: "Kore dizileri Türkçe altyazılı" },
  dizimag:           { types: ["tv"],         lang: ["tr","en"], desc: "Dizi izleme sitesi" },
  dizigom:           { types: ["tv"],         lang: ["tr","en"], desc: "Dizi platformu" },
  diziyoo:           { types: ["tv"],         lang: ["tr","en"], desc: "Dizi arşivi" },
  diziwatch:         { types: ["tv"],         lang: ["tr","en"], desc: "Dizi izleme" },
  filmmakinesi:      { types: ["movie"],      lang: ["tr","en"], desc: "Film izleme platformu" },
  filmmodu:          { types: ["movie"],      lang: ["tr","en"], desc: "Türkçe dublaj film" },
  filmekseni:        { types: ["movie"],      lang: ["tr","en"], desc: "Film arşivi" },
  setfilmizle:       { types: ["movie"],      lang: ["tr","en"], desc: "HD film izleme" },
  sezonlukdizi:      { types: ["tv"],         lang: ["tr","en"], desc: "Sezonluk dizi takibi" },
  ugurfilm:          { types: ["movie"],      lang: ["tr","en"], desc: "Film platformu" },
  watch2movies:      { types: ["movie","tv"], lang: ["tr","en"], desc: "Film ve dizi" },
  turkanime:         { types: ["tv"],         lang: ["tr","ja"], desc: "Türkçe altyazılı anime" },
  tranimeizle:       { types: ["tv"],         lang: ["tr","ja"], desc: "Türkçe anime platformu" },
  animecix:          { types: ["tv"],         lang: ["tr","ja"], desc: "Anime izleme sitesi" },
  koreanturk:        { types: ["tv"],         lang: ["tr","ko"], desc: "Kore dizi ve filmleri" },
  webdramaturkey:    { types: ["tv"],         lang: ["tr","en","ko"], desc: "Web dizi platformu" },
  belgeselx:         { types: ["movie"],      lang: ["tr","en"], desc: "Belgesel arşivi" },
  inatbox:           { types: ["movie","tv"], lang: ["tr","en"], desc: "Geniş içerik arşivi" },
  rarefilmm:         { types: ["movie"],      lang: ["en"],      desc: "Nadir filmler arşivi" },
  rectv:             { types: ["movie","tv"], lang: ["tr","en"], desc: "Film ve dizi platformu" },
  kultfilmler:       { types: ["movie"],      lang: ["tr"],      desc: "Kült filmler arşivi" },
  yesilcamtv:        { types: ["movie"],      lang: ["tr"],      desc: "Yeşilçam filmleri" },
  yenwatch:          { types: ["movie","tv"], lang: ["tr","en"], desc: "Güncel içerik platformu" },
  sinezy:            { types: ["movie"],      lang: ["tr","en"], desc: "Film izleme" },
  sinefy:            { types: ["movie"],      lang: ["tr","en"], desc: "Film platformu" },
  cizgimax:          { types: ["tv"],         lang: ["tr"],      desc: "Çizgi dizi arşivi" },
  cizgivedizi:       { types: ["tv"],         lang: ["tr"],      desc: "Çizgi dizi ve animasyon" },
  openanime:         { types: ["tv"],         lang: ["tr","ja"], desc: "Açık anime platformu" },
  kanald:            { types: ["tv"],         lang: ["tr"],      desc: "Kanal D yayınları" },
  selcukflix:        { types: ["movie","tv"], lang: ["tr","en"], desc: "Film ve dizi platformu" },
  mirrorverse:       { types: ["movie","tv"], lang: ["tr","en"], desc: "Mirror içerik platformu" },
  tvdiziler:         { types: ["tv"],         lang: ["tr"],      desc: "TV dizi arşivi" },
  yabancidizi:       { types: ["tv"],         lang: ["tr","en"], desc: "Yabancı dizi platformu" },
  roketdizi:         { types: ["tv"],         lang: ["tr","en"], desc: "Dizi izleme platformu" },
  superfilmgeldi:    { types: ["movie"],      lang: ["tr","en"], desc: "Film arşivi" },
  netflixmirror:     { types: ["movie","tv"], lang: ["tr","en"], desc: "Netflix içerik mirror" },
  izleai:            { types: ["movie","tv"], lang: ["tr","en"], desc: "AI destekli içerik platformu" },
  fullhdfilm:        { types: ["movie"],      lang: ["tr","en"], desc: "Full HD film izleme" },
  hdfilmizle:        { types: ["movie"],      lang: ["tr","en"], desc: "HD film platformu" },
  webteleizle:       { types: ["movie","tv"], lang: ["tr","en"], desc: "Web içerik platformu" },
  diziasia:          { types: ["tv"],         lang: ["tr","ko","ja"], desc: "Asya dizi platformu" },
  diziasya:          { types: ["tv"],         lang: ["tr","ko","ja"], desc: "Asya dizileri" },
  asyadizi:          { types: ["tv"],         lang: ["tr","ko"],  desc: "Bir Asya dizisi" },
  asya_film:         { types: ["movie"],      lang: ["tr","ko"],  desc: "Asya film arşivi" },
  dizilife:          { types: ["tv"],         lang: ["tr","en"],  desc: "Dizi yaşam platformu" },
  filmkovasi:        { types: ["movie"],      lang: ["tr","en"],  desc: "Film kovası arşivi" },
  filmhane:          { types: ["movie"],      lang: ["tr","en"],  desc: "Film evi platformu" },
  wfilmizle:         { types: ["movie"],      lang: ["tr","en"],  desc: "Film izleme platformu" },
  dizican:           { types: ["tv"],         lang: ["tr","en"],  desc: "Dizi platformu" },
  dizist:            { types: ["tv"],         lang: ["tr","en"],  desc: "Dizi arşivi" },
  golgetv:           { types: ["tv"],         lang: ["tr"],       desc: "Gölge TV yayınları" },
  trt1:              { types: ["tv"],         lang: ["tr"],       desc: "TRT 1 yayınları" },
  trt_cocuk:         { types: ["tv"],         lang: ["tr"],       desc: "TRT Çocuk yayınları" },
  showtv:            { types: ["tv"],         lang: ["tr"],       desc: "Show TV yayınları" },
  atv:               { types: ["tv"],         lang: ["tr"],       desc: "ATV yayınları" },
  startv:            { types: ["tv"],         lang: ["tr"],       desc: "Star TV yayınları" },
  tv8:               { types: ["tv"],         lang: ["tr"],       desc: "TV8 yayınları" },
  teve2:             { types: ["tv"],         lang: ["tr"],       desc: "Teve2 yayınları" },
  dmax:              { types: ["tv"],         lang: ["tr"],       desc: "DMAX yayınları & belgesel" },
  nowtv:             { types: ["tv"],         lang: ["tr"],       desc: "NOW TV platformu" },
  trdizi_izle:       { types: ["tv"],         lang: ["tr"],       desc: "Türk dizi platformu" },
  yts:               { types: ["movie"],      lang: ["en"],       desc: "YTS film torrent indexer" },
  flixhq:            { types: ["movie","tv"], lang: ["en"],       desc: "FlixHQ uluslararası içerik" },
};

// Şablon JS - her provider için özelleştirilir
function makeProviderJS(id, info) {
  var fallback = info.baseUrl;
  var searchPath = info.searchUrl || "/?s=";
  var isTV = (CATEGORIES[id] || {}).types || ["movie"];
  var supportsTV = isTV.indexOf("tv") !== -1;

  return `// ${id} Provider for Nuvio
// Auto-generated by generate-providers.js — elle düzenleme yapabilirsiniz

var CONFIG_URL = "${CONFIG_URL}";
var FALLBACK_BASE = "${fallback}";

function _getBaseUrl() {
  return fetch(CONFIG_URL)
    .then(function(r) { return r.json(); })
    .then(function(cfg) {
      var p = cfg.providers && cfg.providers["${id}"];
      return (p && p.enabled && p.baseUrl) ? p.baseUrl : FALLBACK_BASE;
    })
    .catch(function() { return FALLBACK_BASE; });
}

function _parseStreams(html, sourceName) {
  var streams = [];
  // iframe linkleri çıkar
  var iframeRe = /iframe[^>]+src=["']([^"']+)["']/gi;
  var m;
  var count = 0;
  while ((m = iframeRe.exec(html)) !== null && count < 5) {
    if (m[1] && m[1].indexOf("http") === 0) {
      streams.push({
        name: sourceName,
        title: "Sunucu " + (count + 1),
        url: m[1],
        quality: count === 0 ? "1080p" : "720p"
      });
      count++;
    }
  }
  // m3u8 linkleri çıkar
  var m3u8Re = /https?:\\/\\/[^\\s"'<>]+\\.m3u8[^\\s"'<>]*/g;
  var m2;
  var count2 = 0;
  while ((m2 = m3u8Re.exec(html)) !== null && count2 < 3) {
    streams.push({
      name: sourceName,
      title: "HLS " + (count2 + 1),
      url: m2[0],
      quality: "HD"
    });
    count2++;
  }
  return streams;
}

function getStreams(tmdbId, mediaType, season, episode) {
  var label = mediaType === "tv"
    ? "[${id}] S" + season + "E" + episode + " tmdb:" + tmdbId
    : "[${id}] tmdb:" + tmdbId;
  console.log(label);

  return _getBaseUrl().then(function(base) {
    var searchUrl = base + "${searchPath}" + encodeURIComponent(String(tmdbId));

    return fetch(searchUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Linux; Android 13; Pixel 7) AppleWebKit/537.36",
        "Accept-Language": "tr-TR,tr;q=0.9",
        "Referer": base
      }
    })
    .then(function(r) { return r.text(); })
    .then(function(html) {
      var streams = _parseStreams(html, "${id}");

      // İçerik sayfasına gitmek için ilk post linkini bul
      var linkRe = /href=["'](https?:\\/\\/[^"']*${id.replace(/_/g, '[_-]?')}[^"']+)["']/i;
      var linkMatch = html.match(linkRe);
      if (!linkMatch && streams.length === 0) {
        // Genel link dene
        var genericLink = html.match(/class=["'][^"']*post[^"']*["'][^>]*>\\s*<a[^>]+href=["']([^"']+)["']/i);
        if (genericLink) linkMatch = genericLink;
      }

      if (!linkMatch || streams.length > 0) return streams;

      var contentUrl = linkMatch[1];
      ${supportsTV ? `// Dizi ise bölüm URL'si dene
      if (mediaType === "tv" && season && episode) {
        var epSuffix = "/sezon-" + season + "-bolum-" + episode;
        contentUrl = contentUrl.replace(/\\/?$/, epSuffix);
      }` : ""}

      return fetch(contentUrl, {
        headers: {
          "User-Agent": "Mozilla/5.0 (Linux; Android 13)",
          "Referer": base
        }
      })
      .then(function(r2) { return r2.text(); })
      .then(function(html2) {
        return _parseStreams(html2, "${id}");
      });
    });
  }).catch(function(err) {
    console.error("[${id}] Hata:", err.message);
    return [];
  });
}

module.exports = { getStreams: getStreams };
`;
}

// manifest.json girişi üret
function makeManifestEntry(id, info, catInfo) {
  return {
    id: id,
    name: toTitleCase(id),
    description: catInfo ? catInfo.desc : id + " provider",
    version: "1.0.0",
    author: "Nuvio-TR",
    supportedTypes: catInfo ? catInfo.types : ["movie", "tv"],
    filename: "providers/" + id + ".js",
    enabled: info.enabled !== false,
    logo: info.baseUrl + "/favicon.ico",
    contentLanguage: catInfo ? catInfo.lang : ["tr", "en"],
    formats: ["mp4", "mkv", "m3u8"],
    limited: false,
    disabledPlatforms: [],
    supportsExternalPlayer: true
  };
}

function toTitleCase(str) {
  return str.replace(/(^|_)(\w)/g, function(_, sep, c) { return c.toUpperCase(); });
}

// --- ÜRET ---
var providers = config.providers;
var manifest = [];
var outDir = path.join(__dirname, "providers");

if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

var ids = Object.keys(providers);
console.log("Toplam provider:", ids.length);

ids.forEach(function(id) {
  var info = providers[id];
  var catInfo = CATEGORIES[id];
  // JS üret
  var js = makeProviderJS(id, info, catInfo);
  fs.writeFileSync(path.join(outDir, id + ".js"), js, "utf8");
  // manifest girişi
  manifest.push(makeManifestEntry(id, info, catInfo));
  process.stdout.write("  ✅ " + id + "\n");
});

fs.writeFileSync("manifest.json", JSON.stringify(manifest, null, 2), "utf8");
console.log("\n✅ manifest.json güncellendi (" + manifest.length + " provider)");
console.log("✅ providers/ klasörüne " + ids.length + " JS dosyası yazıldı");
console.log("\nNuvio repo URL'si:");
console.log("  https://raw.githubusercontent.com/" + Sezo88 + "/kuki/main/manifest.json");
