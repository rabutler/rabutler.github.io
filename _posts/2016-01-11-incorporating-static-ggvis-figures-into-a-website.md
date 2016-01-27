---
layout: page
title:  "Incorporating Static ggvis Figures Into Your Website"
teaser: "I wanted to get some practice using ggvis, while also sharing my example work on this site. This post details the steps I took to post a page to my site that includes static ggvis figures."
tags:
   - R
   - ggvis
   - html
   - JavaScript
   - Jekyll
category: 
   - projects
   - R
add_ggvis: true
comments: true
---

## Why?
While it's easy enough to push a rmarkdown document to something like [RPubs][a], I wanted to make sure I could share a page with static ggvis figures on this website. As I started working on a post with static ggvis figures, I found a helpful StackExchange question/answer, but no other blog posts about it. So, I thought it would be a nice first post on this blog.  

*Caveats:* I understand that ggvis is still in development mode and should "not be used in production environments". Also, while ggvis is ["designed more for data exploration than data presentation"][b], I think it would be nice to remove the interactive features of a plot and use it to display the final results on a website. I am also being careful to repeat "static ggvis" figures as this will not work for the interactive figures unless you have Shiny server running in the background.

## Site/Blog Setup
This site uses GitHub pages and Jekyll. There are several sources on using GitHub, Jekyll, and rmarkdown: [here][2], [here][3], and [here][4], so I won't cover that. 

Thanks to [this question on Stack Exchange][1], I knew all I needed to do was add the necessary JavaScript libraries and a few css files to my site. The necessary libraries are: jQuery, jQuery-ui, D3, Vega, lodash, ggvis, and ggvis-shiny. I chose to download all of the libraries and css files, except for jQuery, from the [ggvis][5] repository so that I know I'm using the same version that ggvis is tested with. You also need the "gear.png" file that is in the same directory as the ggvis.css file, and it needs to remain in the same directory as ggvis.css. For jQuery, I downloaded version 2.1.1 from their [website][6]; more explanation of this below.

### Incorporating the jQuery Library
The theme I use for this website also uses jQuery, and by default reference the JavaScript libraries in the footer rather than the header. It also has jQuery and several other libraries all combined into one JavaScript file. Even after adding in references to the additional JavaScript libraries, the static ggvis figures would not load.

To determine why the figures would not load, I started by splitting jQuery out from the other libraries this site uses. The theme uses version 2.1.1, whereas ggvis is using 1.11.0. In the end, I opted to go with version 2.1.1, since the entire site theme was designed using it. So far, it seems version 2.1.1 is working with the ggvis figures. The downside here is that my site won't work for some older versions of Internet Explorer; oh well.

After all the libraries were split out, the ggvis figures still would not load, regardless of which version of jQuery I tried. It took a little bit of digging, but it seemed to be an issue with having jQuery in the footer. **Make sure jQuery is included in the header.** Once jQuery was referenced in the header, with all of the other necessary JavaScript libraries, the static ggvis figures loaded. 

### New Header References
Once all of the libraries are referenced in the header of the html document the ggvis html can be inserted in the body of the document. For pages that use ggvis figures, my headers now include the following references:

{% highlight html %}
<head>
	<!-- other stuff -->
	<script src="/assets/lib/jquery/jquery-2.1.1.min.js"></script>
	<link href="/assets/lib/jquery-ui/jquery-ui.min.css" rel="stylesheet" />
	<script src="/assets/lib/jquery-ui/jquery-ui.min.js"></script>
	<script src="/assets/lib/d3/d3.min.js"></script>
	<script src="/assets/lib/vega/vega.min.js"></script>
	<script src="/assets/lib/lodash/lodash.min.js"></script>
	<script>var lodash = _.noConflict();</script>
	<link href="/assets/lib/ggvis/ggvis.css" rel="stylesheet" />
	<script src="/assets/lib/ggvis/ggvis.js"></script>
	<script src="/assets/lib/ggvis/shiny-ggvis.js"></script>
	<!-- more stuff -->
</head>
{% endhighlight %}

My initial testing indicates that jQuery-ui.min.css and shiny-ggvis.js are not required for the ggvis figures to load. However, since I've only tested this on a few figures, I've left the references in, for now.

### Jekyll Template Modifications

If you are using Jekyll, then you may be interested in the few modifications I made to the template files. While the file names might be specific to the theme I use, the method should apply to other themes. 

First, I only include the above references if the post will include ggvis figures. To do this, in my yaml front matter I add `add_ggvis: true` if the post will have a ggvis figure. Next, I created a new file in the \_include folder called \_ggvis\_scripts.html. This file includes all of the above references, except for the reference to jQuery. By default, all of my pages include "\_head.html" in the header. \_head.html includes the reference to jQuery among other information. To conditionally include the references to the other JavaScript libraries I then added the following to \_head.html:

{% highlight liquid %}
{% raw %}
{% if page.add_ggvis == true %} 
{% include _ggvis_scripts.html %} 
{% endif %} {% endraw %}
{% endhighlight %}

## Examples

### Quick Example
The following R code will produce html code which can be copied and pasted into an html document. Again, thanks to the [Stack Overflow][1] answer for the nice demonstration, which is reproduced here.

~~~ R
library(ggvis)
library(knitr)
ggvFig <- ggvis(mtcars, x = ~wt, y=~mpg, fill = ~factor(cyl)) %>% 
	layer_points()
writeLines(as.character(ggvis::knit_print.ggvis(ggvFig)), 
	"sample-ggvis-figure.html")
~~~ 

If the code in "sample-ggvis-figure.html" is pasted into the website, it will display this figure:

{% include figs/sample-ggvis-figure.html %}

### Longer Example
I also tested out the approach to see if it would work as though I am writing the entire blog post from RStudio using rmarkdown. The example post is available [here][7]. To create that page, I:

1. Wrote the entire post using rmarkdown in RStudio.
2. Knit an html document in RStudio.
3. Copied everything inside of the `<div class = "container-fluid main-container">` tags into a post in this sites directory structure, and set `add_ggvis:` to  `true` in the post's yaml front matter. 

I'm looking into ways to automate step 3.  For now, [see this description][3] for a way to automate blogging from rmarkdown.

## Final Thoughts

If you want to included static ggvis figures into your website or blog, it really only takes adding a few references to the appropriate JavaScript libraries. After that, it is a matter of choice for how to simplify the process for your individual site setup.

[a]: http://rpubs.com
[b]: https://cran.r-project.org/web/packages/ggvis/vignettes/vega.html
[1]: http://stackoverflow.com/questions/24344317/how-do-i-export-and-host-a-ggvis-chart-on-my-own-webserver
[2]: http://www.r-bloggers.com/an-easy-start-with-jekyll-for-r-bloggers/
[3]: http://www.r-bloggers.com/blogging-with-rmarkdown-knitr-and-jekyll/
[4]: http://www.r-bloggers.com/blog-with-rstudio-r-rmarkdown-jekyll-and-github/
[5]: https://github.com/rstudio/ggvis/tree/master/inst/www
[6]: https://jquery.com/download/
[7]: /projects/historical-mortgage-interest/
