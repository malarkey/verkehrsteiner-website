const { execSync } = require("child_process");
const rssPlugin = require("@11ty/eleventy-plugin-rss");
const Image = require("@11ty/eleventy-img");

// Filters
const dateFilter = require("./src/filters/date-filter.js");
const w3DateFilter = require("./src/filters/w3-date-filter.js");
const sortByDisplayOrder = require("./src/utils/sort-by-display-order.js");

// Async image shortcode
async function imageShortcode(src, alt, sizes = "(min-width: 1024px) 50vw, 100vw") {
let metadata = await Image(src, {
widths: [300, 600, 1200],
formats: ["webp", "jpeg"],
outputDir: "./dist/images/",
urlPath: "/images/"
});

let imageAttributes = {
alt,
sizes,
loading: "lazy",
decoding: "async"
};

return Image.generateHTML(metadata, imageAttributes);
}

// CSS inlining filter for Netlify CMS
function inlineFilter(path) {
const fs = require("fs");
const filepath = `dist${path}`;

if (fs.existsSync(filepath)) {
const buffer = fs.readFileSync(filepath);
return buffer.toString('utf8').replace(/^\uFEFF/, '');
}
return `/* CSS file ${path} not found */`;
}

function normalizeList(value) {
if (Array.isArray(value)) {
return value.map(item => `${item}`.trim()).filter(Boolean);
}

if (typeof value === "string") {
return value.split(",").map(item => item.trim()).filter(Boolean);
}

return [];
}

function normalizeServiceText(value) {
return `${value || ""}`
.trim()
.toLowerCase()
.normalize("NFKD")
.replace(/\p{M}/gu, "")
.replace(/&/g, " and ")
.replace(/\bund\b/g, " and ")
.replace(/[–—−]/g, "-")
.replace(/\s*-\s*/g, " - ")
.replace(/[’']/g, "")
.replace(/\s+/g, " ")
.trim();
}

function matchesService(itemService, targetService) {
const normalizedTarget = normalizeServiceText(targetService);
const normalizedService = normalizeServiceText(itemService);
return Boolean(normalizedTarget) && normalizedService === normalizedTarget;
}

module.exports = function(eleventyConfig) {
// Filters
eleventyConfig.addFilter("dateFilter", dateFilter);
eleventyConfig.addFilter("w3DateFilter", w3DateFilter);
eleventyConfig.addFilter("sortByDisplayOrder", sortByDisplayOrder);
eleventyConfig.addFilter("inline", inlineFilter);

// NEWS FILTERS
eleventyConfig.addFilter("filterNewsByCategory", (posts, category) => {
return posts.filter(post =>
post.data.postCategories && post.data.postCategories.includes(category)
);
});

// ADD NEWS TAG FILTER
eleventyConfig.addFilter("filterNewsByTag", (posts, tag) => {
return posts.filter(post =>
post.data.postTags && post.data.postTags.includes(tag)
);
});

// PROJECT FILTERS
eleventyConfig.addFilter("filterProjectsByCategory", (projects, category) => {
return projects.filter(project => project.data.category === category);
});

eleventyConfig.addFilter("filterProjectsByTag", (projects, tag) => {
return projects.filter(project =>
normalizeList(project.data.tags).includes(tag)
);
});

eleventyConfig.addFilter("filterProjectsByService", (projects, service) => {
return projects.filter(project => {
return matchesService(project.data.service, service);
});
});

eleventyConfig.addFilter("filterFaqsByService", (faqs, service) => {
return faqs.filter(faq => {
return matchesService(faq.data.service, service);
});
});

eleventyConfig.addFilter("asTagArray", (tags) => normalizeList(tags));

// Plugins
eleventyConfig.addPlugin(rssPlugin);

// Shortcodes
eleventyConfig.addNunjucksAsyncShortcode("image", imageShortcode);

// Passthrough copy
eleventyConfig.addPassthroughCopy("src/fonts");
eleventyConfig.addPassthroughCopy("src/admin");
eleventyConfig.addPassthroughCopy("src/css");
eleventyConfig.addPassthroughCopy("src/js");
eleventyConfig.addPassthroughCopy("src/images");
eleventyConfig.addPassthroughCopy("src/favicon.svg");
eleventyConfig.addPassthroughCopy("src/site.webmanifest");

// COLLECTIONS

eleventyConfig.addCollection("news", (collection) => {
return [...collection.getFilteredByGlob("./src/posts/*.md")].reverse();
});

eleventyConfig.addCollection("projects", (collection) => {
return [...collection.getFilteredByGlob("./src/projects/*.md")].sort((a, b) => {
const aDate = a.data.date || a.date;
const bDate = b.data.date || b.date;
return new Date(bDate) - new Date(aDate);
});
});

eleventyConfig.addCollection("services", (collection) => {
return collection.getFilteredByGlob("./src/services/*.md");
});

eleventyConfig.addCollection("faqs", (collection) => {
return collection.getFilteredByGlob("./src/faqs/*.md");
});

// NEWS TAXONOMY COLLECTIONS
eleventyConfig.addCollection("postCategories", (collection) => {
let categories = new Set();
collection.getFilteredByGlob("./src/posts/*.md").forEach(post => {
if (post.data.postCategories) {
post.data.postCategories.forEach(cat => categories.add(cat));
}
});
return Array.from(categories).sort();
});

eleventyConfig.addCollection("postTags", (collection) => {
let tags = new Set();
collection.getFilteredByGlob("./src/posts/*.md").forEach(post => {
if (post.data.postTags) {
post.data.postTags.forEach(tag => tags.add(tag));
}
});
return Array.from(tags).sort();
});

eleventyConfig.addCollection("projectCategories", (collection) => {
let categories = new Set();
collection.getFilteredByGlob("./src/projects/*.md").forEach(project => {
if (project.data.category) {
categories.add(project.data.category);
}
});
return Array.from(categories).sort();
});

eleventyConfig.addCollection("projectTags", (collection) => {
let tags = new Set();
collection.getFilteredByGlob("./src/projects/*.md").forEach(project => {
normalizeList(project.data.tags).forEach(tag => tags.add(tag));
});
return Array.from(tags).sort();
});

// GENERATE NEWS CATEGORY PAGES
eleventyConfig.addCollection("newsCategoryPages", function(collectionApi) {
const categories = new Set();
const posts = collectionApi.getFilteredByGlob("./src/posts/*.md");

posts.forEach(post => {
if (post.data.postCategories) {
post.data.postCategories.forEach(cat => categories.add(cat));
}
});

return Array.from(categories).map(category => {
	return {
	title: `${category}`,
	category: category,
	permalink: `/news/category/${category.toLowerCase().replace(/\s+/g, '-')}/`,
	layout: "layouts/base.html"
	};
	});
	});

// ADD NEWS TAG PAGES COLLECTION
eleventyConfig.addCollection("newsTagPages", function(collectionApi) {
const tags = new Set();
const posts = collectionApi.getFilteredByGlob("./src/posts/*.md");

posts.forEach(post => {
if (post.data.postTags) {
post.data.postTags.forEach(tag => tags.add(tag));
}
});

return Array.from(tags).map(tag => {
	return {
	title: `${tag}`,
	tag: tag,
	permalink: `/news/tag/${tag.toLowerCase().replace(/\s+/g, '-')}/`,
	layout: "layouts/base.html"
	};
	});
});

// GENERATE PROJECT CATEGORY PAGES
eleventyConfig.addCollection("projectCategoryPages", function(collectionApi) {
const categories = new Set();
const projects = collectionApi.getFilteredByGlob("./src/projects/*.md");

projects.forEach(project => {
if (project.data.category) {
categories.add(project.data.category);
}
});

return Array.from(categories).map(category => {
return {
title: `${category}`,
category: category,
permalink: `/projects/category/${category.toLowerCase().replace(/\s+/g, '-')}/`
};
});
});

// GENERATE PROJECT TAG PAGES
eleventyConfig.addCollection("projectTagPages", function(collectionApi) {
const tags = new Set();
const projects = collectionApi.getFilteredByGlob("./src/projects/*.md");

projects.forEach(project => {
normalizeList(project.data.tags).forEach(tag => tags.add(tag));
});

return Array.from(tags).map(tag => {
return {
title: `${tag}`,
tag: tag,
permalink: `/projects/tag/${tag.toLowerCase().replace(/\s+/g, '-')}/`
};
});
});

eleventyConfig.addCollection("team", (collection) => {
return collection.getFilteredByGlob("./src/team/*.md");
});

// Use .eleventyignore, not .gitignore
eleventyConfig.setUseGitIgnore(false);

// Directory structure
return {
markdownTemplateEngine: "njk",
dataTemplateEngine: "njk",
htmlTemplateEngine: "njk",
dir: {
input: "src",
output: "dist"
}
};
};
