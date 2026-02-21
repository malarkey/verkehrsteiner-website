---
featureImage:
featureImageCaption:
layout: 'layouts/feed.html'
metaDesc:
pagination:
  data: collections.news
  size: 10
paginationPrevText: 'Newer'
paginationNextText: 'Older'
paginationAnchor: '#post-list'
permalink: 'news{% if pagination.pageNumber > 0 %}/page/{{ pagination.pageNumber }}{% endif %}/index.html'
title: 'Our news'
---
