// (c) chlove and tetrtop contributors, under the GPL 3.0 licence.
const { session } = require('electron');

// If your curious why I added so many, it's just in case osk decides to expand to more providers, so i just added every single ad provider I know to this list.
const blockedDomains = [
  "google-analytics.com",
  "googletagmanager.com",
  "doubleclick.net",
  "adservice.google.com",
  "adservice.google.fr",
  "ads.yahoo.com",
  "ads-twitter.com",
  "ads.facebook.com",
  "pagead2.googlesyndication.com",
  "amazon-adsystem.com",
  "appnexus.com",
  "advertising.com",
  "taboola.com",
  "outbrain.com",
  "criteo.com",
  "scorecardresearch.com"
];

function blockAds() {
  session.defaultSession.webRequest.onBeforeRequest({ urls: ["<all_urls>"] }, (details, callback) => {
    const url = new URL(details.url);
    if (blockedDomains.some(domain => url.hostname.includes(domain))) {
      console.log(`Blocked request to: ${details.url}`);
      callback({ cancel: true });
    } else {
      callback({ cancel: false });
    }
  });
}

module.exports = {
  blockAds
};
