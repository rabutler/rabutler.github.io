---
layout: page
subheadline: "A place to showcase my small projects"
title: "Projects"
permalink: "/projects/"
---
This is a list of all my small projects:
<ul>
    {% for post in site.tags.projects %}
    <li><a href="{{ site.baseurl }}{{ post.url }}">{{ post.title }}</a></li>
    {% endfor %}
</ul>