---
layout: page
subheadline:  "A place to showcase my small projects."
title:  "Projects"
header:
   title: Projects
   image_fullwidth: unsplash_brooklyn-bridge_header.jpg
   caption: This is a caption for the header image with link
   caption_url: http://www.unsplash.com	
permalink: "/projects/"
---

### Under Construction
<ul>
    {% for post in site.tags.projects %}
    <li><a href="{{ site.baseurl }}{{ post.url }}">{{ post.title }}</a></li>
    {% endfor %}
</ul>