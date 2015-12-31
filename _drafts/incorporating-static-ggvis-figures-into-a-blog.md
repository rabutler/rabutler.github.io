---
layout: page
title:  "Incorporating Static ggvis Figures Into Your Website"
teaser: "I wanted to get some practice using ggvis, while also sharing my example work on this site. So, I started working on an example page that would incorporate ggvis figures in it."
tags:
   - R
   - ggvis
   - projects
add_ggvis: true
comments: true
---

## Why?
While it's easy enough to push a rmarkdown document to something like [RPubs][a], I wanted to make sure I could share it on this website. As I started working on the example page, I did not find a lot of details out there for how to incorporate static ggvis figures into your website/blog. So, I thought it would be a nice first post on the blog.  

*Caveats:* I understand that ggvis is still in development mode and should "not be used in production environments". However, I anticipate using it more widely in the future, and so I'm gettting a jump start in using it. Also, while ggvis is "designed more for data exploration than data presentation", I think it would be nice to remove the interactive features of a plot and use it to display the final results on a website. 

## Site/Blog Setup
This site uses GitHub pages and Jekyll. There are several sources on using GitHub, Jekyll, and rmarkdown: [here][2], [here][3], and [here][4], so I won't cover that. 

Thanks to [this question on Stack Exchange][1], I knew all I needed to do was add the necessary libraries to my site. The necessary libraries are: jQuery, jQuery-ui, D3, Vega, lodash, ggvis, and ggvis-shiny. I chose to download all of the libraries, except for jQuery, from the [ggvis][5] repository so that I know I'm using the same version that ggvis is tested with. You also need the "gear.png" file that is in the same directory as the ggvis.css file, and it needs to remain in the same directory as ggvis.css. For jQuery, I downloaded version 2.1.1 from their [website][6]; more explanation of this below.

### Incorporating the jQuery Library
The theme I use for this website also uses jQuery, and by default reference the JavaScript librairies in the footer rather than the header. It also has jQuery and several other libraries all combined into one JavaScript file. First, I had to break out jQuery from all of the other libraries. The theme uses version 2.1.1, whereas ggvis is using 1.11.0. I opted to go with version 2.1.1 to begin with, since the entire site theme was designed using it. So far, it seems version 2.1.1 is working with the ggvis figures. The downside here is that my site won't work for some older versions of Internet Explorer; oh well.

After all the librairies were split out, the ggvis figures would not load. It took a little bit of digging, but it seemed to be an issue with having jQuery in the footer. **Make sure jQuery is included in the header and not the footer.**

Then, all that is left is to make sure that all of the libraries are referenced in the header of the html document and the ggvis html can be inserted in the body of the document. For pages that use ggvis figures, my headers now looks as follows:

~~~ html
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
~~~

Finally, my initial testing indicates that jQuery-ui.min.css and shiny-ggvis.js are not required to get the ggvis figures to show up. However, since I've only tested this on a few figures, I've left the references in for now.

### Jekyll Template Modifications

If you are using Jekyll, then you may be interested in the few modifications I made to the template files. While the file names are specific to the theme I use, the method will scale to other themes. 

First, I only include the above links if the post will include ggvis figures; no use linking to unused libraries if they aren't necessary. To do this, in my front matter of my post (md or html) I add `add_ggvis: true` if the post will have a ggvis figure. Next, I created a new file in the \_include folder called \_ggvis\_scripts.html. This file includes all of the above links, except for the link to jQuery. Because I need jQuery in every page, it is included in \_head.html. Finally, in \_head.html, I added the following:

{% highlight liquid %}
{% raw %}
{% if page.add_ggvis == true %} 
{% include _ggvis_scripts.html %} 
{% endif %} {% endraw %}
{% endhighlight %}

## Examples

### Quick Example
The following R code will produce html code which can be copied and pasted into an html document. Again, thanks to the [Stack Overflow][1] answer for the nice demonstration.

~~~ R
library(ggvis)
library(knitr)
ggvFig <- ggvis(mtcars, x = ~wt, y=~mpg, fill = ~factor(cyl)) %>% 
	layer_points()
writeLines(as.character(ggvis::knit_print.ggvis(ggvFig)), 
	"sample-ggvis-figure.html")
~~~ 

If the code in "sample-ggvis-figure.html" is pasted into the website, it will display this figure:

{% include_relative figs/sample-ggvis-figure.html %}

### Longer Example
I also tested out the approach to see if it would work if I was writing the entire blog post from RStudio using rmarkdown. The example post is available [here][7]. To create that page, I:

1. Wrote the entire post in RStudio.
2. Knit an html document in RStudio.
3. Copied everything inside of the `<div class = "container-fluid main-container">` tags into this website. Remember this site will include the required libraires shown above.

I'm sure the above process can be a bit more automated, and I'll probably start looking into doing so similar to [this description][3].

[a]: http://rpubs.com
[1]: http://stackoverflow.com/questions/24344317/how-do-i-export-and-host-a-ggvis-chart-on-my-own-webserver
[2]: http://www.r-bloggers.com/an-easy-start-with-jekyll-for-r-bloggers/
[3]: http://www.r-bloggers.com/blogging-with-rmarkdown-knitr-and-jekyll/
[4]: http://www.r-bloggers.com/blog-with-rstudio-r-rmarkdown-jekyll-and-github/
[5]: https://github.com/rstudio/ggvis/tree/master/inst/www
[6]: https://jquery.com/download/
[7]: /projects/historical-mortgage-interest/
