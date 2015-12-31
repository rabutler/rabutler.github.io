---
layout: page
subheadline: "A place to showcase my small projects"
title: "Projects"
permalink: "/projects/"
---
All of my small projects will appear here. There will almost always be a blog post associated with the project. However, sometimes, there may also be a demonstration page. The blog posts and demonstration pages are listed below.

## Demonstration Projects
<!--* [Mortgage Rate Interest][1] -- [Related blog post][2]  -->

## Blog Posts

<ul>
    {% for post in site.tags.projects %}
    <li><a href="{{ site.baseurl }}{{ post.url }}">{{ post.title }}</a></li>
    {% endfor %}
</ul>

<!--[1]: /projects/historical-mortgage-interest/
[2]: {% post_url 2015-12-31-incorporating-static-figures-into-a-blog %} -->