const defaultSiteData = {
  name: "Verkehrsteiner AG",
  url: "http://localhost:8080",
  authorName: "Andy Clarke, Stuff &#38; Nonsense",
  authorEmail: "andy.clarke@stuffandnonsense.co.uk",
  telephone: "+41 31 537 12 00",
  email: "info@verkehrsteiner.ch",
  linkedin: "https://www.linkedin.com/company/verkehrsteiner",
  siteID: "verkehrsteiner-ch",
  googleMapsApiKey: "",
  googleMapsMapId: ""
};

let siteData = {};

try {
  siteData = require("./site.json");
} catch (error) {
  siteData = {};
}

function getSiteUrl() {
  const fallbackUrl = siteData.url || defaultSiteData.url;
  const isProduction = process.env.CONTEXT === "production";
  const rawUrl = isProduction
    ? process.env.URL
    : process.env.DEPLOY_PRIME_URL || process.env.URL;

  return rawUrl ? rawUrl.replace(/\/$/, "") : fallbackUrl;
}

module.exports = {
  ...defaultSiteData,
  ...siteData,
  url: getSiteUrl(),
};
