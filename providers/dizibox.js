// CUSTOM PROVIDER
// DiziBox Provider for Nuvio
// Site: https://www.dizibox.live
// URL yapısı: /{dizi-adi}-{S}-sezon-{B}-bolum-izle/
// TMDB API ile önce isim alınır, sonra slug oluşturulur

var BASE_URL = "https://www.dizibox.live";
var TMDB_API = "https://api.themoviedb.org/3";
// Nuvio eklenti yükleyicisi kendi TMDB anahtarını verebilir
var TMDB_KEY = "55ed751364b84330b7d3646180d95056";

// Türkçe karakterleri ve boşlukları slug'a çevir
function toSlug(str) {
  return str
    .toLowerCase()
    .replace(/ğ/g, "g")
    .replace(/ü/g, "u")
    .replace(/ş/g, "s")
    .replace(/ı/g, "i")
    .replace(/ö/g, "o")
    .replace(/ç/g, "c")
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

// TMDB'den dizi/film adını al
function getTitleFromTmdb(tmdbId, mediaType) {
  var endpoint = mediaType === "tv"
    ? TMDB_API + "/tv/" + tmdbId + "?api_key=" + TMDB_KEY + "&language=tr-TR"
    : TMDB_API + "/movie/" + tmdbId + "?api_key=" + TMDB_KEY + "&language=en-US";

  return fetch(endpoint)
    .then(function (r) { return r.json(); })
    .then(function (data) {
      var title = data.name || data.title || data.original_name || data.original_title || "";
      var year = "";
      if (data.first_air_date) year = data.first_air_date.substring(0, 4);
      if (data.release_date) year = data.release_date.substring(0, 4);
      return { title: title, year: year, originalTitle: data.original_name || data.original_title || "" };
    });
}

// DiziBox'ta arama yap — slug'dan bölüm URL'sini bul
function searchDiziBox(titleInfo, mediaType, season, episode) {
  var slug = toSlug(titleInfo.title);
  var origSlug = toSlug(titleInfo.originalTitle);

  // Bölüm URL'sini tahmin et
  var episodeUrl = BASE_URL + "/" + slug + "-" + season + "-sezon-" + episode + "-bolum-izle/";
  var episodeUrlOrig = BASE_URL + "/" + origSlug + "-" + season + "-sezon-" + episode + "-bolum-izle/";

  return fetch(episodeUrl, {
    headers: {
      "User-Agent": "Mozilla/5.0 (Linux; Android 13; Pixel 7) AppleWebKit/537.36",
      "Referer": BASE_URL
    }
  })
    .then(function (r) {
      if (r.ok) return r.text().then(function (html) { return { html: html, url: episodeUrl }; });
      return fetch(episodeUrlOrig, {
        headers: {
          "User-Agent": "Mozilla/5.0 (Linux; Android 13)",
          "Referer": BASE_URL
        }
      }).then(function (r2) {
        if (r2.ok) return r2.text().then(function (html) { return { html: html, url: episodeUrlOrig }; });
        return searchFallback(slug, origSlug, season, episode);
      });
    });
}

// Fallback: site aramasıyla bul
function searchFallback(slug, origSlug, season, episode) {
  var searchUrl = BASE_URL + "/?s=" + encodeURIComponent(slug.replace(/-/g, " "));
  return fetch(searchUrl, {
    headers: { "User-Agent": "Mozilla/5.0", "Referer": BASE_URL }
  })
    .then(function (r) { return r.text(); })
    .then(function (html) {
      var linkRe = /href="(https?:\/\/[^"]*dizibox[^"]*-izle[^"]*?)"/gi;
      var match = linkRe.exec(html);
      if (!match) return { html: html, url: searchUrl };

      var diziUrl = match[1];
      return fetch(diziUrl, {
        headers: { "User-Agent": "Mozilla/5.0", "Referer": BASE_URL }
      })
        .then(function (r2) { return r2.text(); })
        .then(function (html2) {
          var bolumRe = new RegExp(season + "\\.Sezon " + episode + "\\.Bölüm[^<]*<\\/a>|href=\"([^\"]*-" + season + "-sezon-" + episode + "-bolum[^\"]*?)\"", "i");
          var bMatch = bolumRe.exec(html2);
          if (bMatch && bMatch[1]) {
            return fetch(bMatch[1], {
              headers: { "User-Agent": "Mozilla/5.0", "Referer": BASE_URL }
            })
              .then(function (r3) { return r3.text(); })
              .then(function (html3) { return { html: html3, url: bMatch[1] }; });
          }
          return { html: html2, url: diziUrl };
        });
    });
}

// HTML'den stream linklerini çıkar (Asenkron)
function extractStreams(html, pageUrl) {
  var streams = [];
  var promises = [];

  var iframeRe = /<iframe[^>]+src=["']([^"']+)["']/gi;
  var m;
  while ((m = iframeRe.exec(html)) !== null) {
    var src = m[1];
    if (src && src.indexOf("http") === 0 &&
      src.indexOf("google") === -1 &&
      src.indexOf("facebook") === -1 &&
      src.indexOf("twitter") === -1 &&
      src.indexOf("disqus") === -1) {
      
      var p = Promise.resolve(src);
      if (src.indexOf("/player/") !== -1) {
        p = fetch(src, { headers: { "Referer": BASE_URL, "User-Agent": "Mozilla/5.0" } })
          .then(function(r) { return r.text(); })
          .then(function(innerHtml) {
            var innerRe = /<iframe[^>]+src=["']([^"']+)["']/i;
            var innerMatch = innerRe.exec(innerHtml);
            if (innerMatch && innerMatch[1]) {
              return innerMatch[1];
            }
            return src;
          })
          .catch(function() { return src; });
      }

      promises.push(
        p.then(function(finalSrc) {
          streams.push({
            name: "DiziBox",
            title: finalSrc.indexOf("molystream") !== -1 ? "Molystream" : ("Sunucu " + (streams.length + 1)),
            url: finalSrc,
            quality: "1080p",
            type: "web" // Nuvio iframe/webview tanıyabilsin diye web type
          });
        })
      );
    }
  }

  var m3u8Re = /["'](https?:\/\/[^"']+\.m3u8[^"']*?)["']/gi;
  while ((m = m3u8Re.exec(html)) !== null) {
    streams.push({
      name: "DiziBox",
      title: "HLS " + (streams.length + 1),
      url: m[1],
      quality: "HD"
    });
  }

  var videoRe = /(?:data-src|src)=["'](https?:\/\/[^"']+\.(?:mp4|m3u8)[^"']*?)["']/gi;
  while ((m = videoRe.exec(html)) !== null) {
    if (streams.findIndex(function (s) { return s.url === m[1]; }) === -1) {
      streams.push({
        name: "DiziBox",
        title: "Video " + (streams.length + 1),
        url: m[1],
        quality: "HD"
      });
    }
  }

  return Promise.all(promises).then(function() {
    return streams;
  });
}

function getStreams(tmdbId, mediaType, season, episode) {
  console.log("[DiziBox] " + mediaType + " tmdb:" + tmdbId +
    (season ? " S" + season + "E" + episode : ""));

  return getTitleFromTmdb(tmdbId, mediaType)
    .then(function (titleInfo) {
      console.log("[DiziBox] Başlık: " + titleInfo.title);

      if (mediaType === "tv" && season && episode) {
        return searchDiziBox(titleInfo, mediaType, season, episode)
          .then(function (result) {
            return extractStreams(result.html, result.url).then(function(streams) {
              console.log("[DiziBox] " + streams.length + " stream bulundu");
              return streams;
            });
          });
      } else {
        var slug = toSlug(titleInfo.title);
        var filmUrl = BASE_URL + "/diziler/" + slug + "-izle/";
        return fetch(filmUrl, {
          headers: { "User-Agent": "Mozilla/5.0", "Referer": BASE_URL }
        })
          .then(function (r) { return r.text(); })
          .then(function (html) {
            return extractStreams(html, filmUrl);
          });
      }
    })
    .catch(function (err) {
      console.error("[DiziBox] Hata:", err.message);
      return [];
    });
}

if (typeof module !== "undefined" && module.exports) {
  module.exports = { getStreams: getStreams };
} else {
  global.getStreams = getStreams;
}
