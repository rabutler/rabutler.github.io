---
layout: page
subheadline: "A place to showcase my small projects"
title: "Projects"
permalink: "/projects/"
---
All of my small projects will appear here. There will almost always be a blog post associated with the project. However, sometimes, there may also be a demonstration page. The blog posts and demonstration pages are listed below.

## Blog Posts

<ul>
    {% for post in site.categories.projects %}
    <li><a href="{{ site.baseurl }}{{ post.url }}">{{ post.title }}</a></li>
    {% endfor %}
</ul>

## Demonstration Projects

* [Animated Driving Route to Nicaragua][2]
* [Historical Mortgage Interest Rates Analysis][1]

[1]: /projects/historical-mortgage-interest/
[2]: /projects/animated-drive-route-figure-only.html
