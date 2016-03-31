---
layout: page
title:  "Animating an SVG Using R (Mostly)"
subheadline: "A Map of our Drive to Nicaragua - Part 2: Animating the Driving Route"
tags:
   - R
   - SVG
   - JavaScript
   - maps
   - R-XML
category: 
   - projects
   - R
add_RHighlight: true
comments: true
---

Explained more in [Part 1][1], the recent [Colorado River drought visualization project][2] inspired me to create an animation of the route we drove from Colorado to Nicaragua. [Part 1][1] focuses on how we created the map. Here, in Part 2, we explain how to use R and JavaScript to animate the SVG.

The overall goal is to make our route in blue (shown below) appear to draw itself.

<div id="driveRouteNAContainer">
	<object id="driverRouteNoAnim" data="{{ site.baseurl }}/images/driveRoute.svg" type="image/svg+xml" width="60%" height="60%"></object>	
</div>

## Why?

There are some interesting and compelling animated SVGs out there. For example: [this][2], [this][3], and [this][4]. If you are familiar with R, you can use R to create the initial image, whether it is from an analysis, map, or something else. Then, using the XML package, you can edit SVG files. Most importantly, I think, if all of these steps are completed using R, it provides documentation for what data the image uses and how the image was created and/or edited.

## How?

The following sections explain how we used R and JavaScript to animate the SVG. R is used to edit the original SVG file, while JavaScript creates the animation by changing the style object of the SVG element you want to animate. In this example, we wanted a line to appear to be drawn from start to finish, though the approach should also work for other types of animations.

In a nutshell, we:

1. Create the initial SVG. There are many ways to do so; see [Part 1][1] for how we created the initial map.
2. Add an ID attribute to the SVG `<path>` we want to animate.
3. Adapt [existing JavaScript][5] to make the driving route appear to draw itself.
4. Combine the SVG and JavaScript.

Regarding step 3, there are many guides for how to animate an SVG using JavaScript including [here][5] and [here][6]. We followed the approach of the former, as you specify the length of the animation in seconds rather than as a number of frames.

There are two questions to answer before completing these steps:

* Will the SVG be included directly in the html or referenced as an `<object>` or `<iframe>`? The answer to this will affect step 3.
* Will the JavaScript be included within the `<svg>` tags, or referenced as a separate script? The answer to this affects steps 3 and 4. 

The following sections detail these steps, and provide examples for all answers to these questions.

### Modifying the SVG

Starting with the [SVG][9] we created in [Part 1][1], the first step is to add an ID attribute to the SVG `<path>` element that we want to animate. Because the path that I want to animate was the last item added to the SVG, I know that it will be the last `<path>` in the SVG. Without this knowledge, you will have to determine which path element should be animated by inspecting the original SVG file. 

We start by getting the number of `<path>` elements that are in the SVG (`numPaths`), then name all but the last path "myPath[N]" (not necessary), and name the last path "drivePath" (`name_svg_elements()`). drivePath is the element that we will animate. While the [Colorado River drought visualization (CRDV) project][2] provided the inspiration for this animation, it also provided an [example to follow and some code used to edit the SVGs][8]. `name_svg_elements.R` was adapted from [their version][8] and is available on [GitHub][10].

At this point, we also decided that the figure should start with the path being invisible. SVGs can contain either a single `style` attribute with all of the style settings, or, separate SVG attributes for each style setting. This SVG is setup using the former (as created by R's SVG device). It would be nicer to have the later, but we will leave it in this form. We parse the `style` attribute, find the `stroke-opacity` setting, set it to '0', and then recreate the full `style` attribute. All of this is taken care of in `editPathStyle()`. It is not shown here, since it is really an optional step, but it is available on [GitHub][10].

{% highlight r %}
library(RCurl)
library(XML)

# read in the original SVG
# have to first use getURL, and then use xmlParse
svgIn <- 'https://raw.githubusercontent.com/rabutler/animateNicaDrive/master/driveRoute.svg'
svgOut <- 'driveRouteAnimated.R'
svg <-  XML::xmlParse(RCurl::getURL(svgIn), useInternalNode=TRUE)

# get the number of paths in the document and arbitrarily name them 'myPath[n]'
numPaths <- length(XML::xpathApply(svg, "//*[local-name()='path']"))
pathNames <- c(paste0('myPath',1:(numPaths-1)),'drivePath')

# and I want to keep all of the currently set styles and the path data (d)
keepAtts <- c('d','style')

# name each of the paths
svg <- svg %>% name_svg_elements(ele_names = pathNames, keep.attrs = keepAtts) %>%
  # and then change the stroke-opacity of the drivePath
  editPathStyle('drivePath','stroke-opacity','0') %>% 
  toString.XMLNode()

# and save the edited version of the SVG
cat(svg, file = paste0(svgOut), append = FALSE)
{% endhighlight %}

Now that the SVG has a `<path>` element with an ID set to "drivePath" we will use JavaScript to animate the drivePath.

### Animating the Path Using JavaScript

In the beginning, we noted there are two questions pertaining to how the SVG and JavaScript files will be structured. They are: 

* Will the SVG be included directly in the html or referenced as an `<object>` or `<iframe>`?
* Will the JavaScript be included within the `<svg>` tags, or referenced as a separate script?

We will setup the SVG and the JavaScript file to be referenced via `<object>` and `<script>` tags in the html, but will note how to edit the setup if the SVG is included in the html or the JavaScript is included within the `<svg>` tags.  

As explained [here][11], the basis for creating the animation is that you are modifying the `stroke-dashoffset` and `stroke-dasharray` style settings, such that the line progressively appears, i.e., looks like it is drawing itself. To do this, we use a modified version of [Jake Archibald's][5] approach.

The basic setup for referencing the SVG and JavaScript from an HTML document is:

{% highlight html %}
{% raw %}
<object id="objID" data="/path/to/Animated.svg" type="image/svg+xml"></object>
<script src="/path/to/AnimateCode.js"></script>
{% endraw %}
{% endhighlight %}

_Note that I use the `<object>` tag to reference the SVG, but the same JavaScript should work if it is referenced using `<iframe>`._

We follow [Archibald's][5] approach, with the following modifications. First, we get the containing document,in this case the SVG file, by its ID, and then get the contents of the document (SVG file). Next, we select the path based on path ID ("drivePath"), and perform some changes to the path's style attributes. We change the animation to be 10 seconds long and linear (`path.style.transition = path.style.WebkitTransition ="stroke-dashoffset 10s linear";`), and make the path show up (`path.style.strokeOpacity = "1";`) since it is initially hidden. Playing around with the `path.style.transition` will allow you to customize the look of the line drawing itself and how long it takes to complete.

Also, since the JavaScript file is referenced, it makes sense to make it generic so that it can be reused. As shown below, it accepts two arguments: `mySvgObj` which is the ID attribute of the containing `<object>` code, and `myPath`, which is the ID attribute of the `<path>` you wish to animate. 

{% highlight javascript %}
{% raw %}
var draw = function(mySvgObj, myPath){
  var svgObj, svgDoc;
  // get the SVG by ID
  svgObj = document.getElementById(mySvgObj);
  svgDoc = svgObj.contentDocument;
  // get the drivePath <path>
  var path = svgDoc.getElementById(myPath);
  var length = path.getTotalLength();
  // Clear any previous transition
  path.style.transition = path.style.WebkitTransition = 'none';
  // Set up the starting positions
  path.style.strokeDasharray = length + ' ' + length;
  path.style.strokeDashoffset = length;
  // Trigger a layout so styles are calculated & the browser
  // picks up the starting position before animating
  path.getBoundingClientRect();
  // Define our transition 
  path.style.transition = path.style.WebkitTransition =
    'stroke-dashoffset 10s linear';
  // make the path visible
  path.style.strokeOpacity = '1';
  // Go!
  path.style.strokeDashoffset = '0';
}
{% endraw %}
{% endhighlight %}

As shown in the next section, we will start the animation with a button click that calls `draw('objID', 'drivePath')`. However, adding `window.onload = function(){ draw(); }` to the end of the JavaScript file will have the animation start as soon as the page loads.   

#### Modifications for Embedded JavaScript

If the JavaScript is included in the SVG file, it should be placed just inside the opening `<svg>` tag. In this case, the `mySvgObj` argument, `svgObj` and `svgDoc` variables, and the two lines that set these variables can be eliminated. 

While the JavaScript code could be copied and pasted into the SVG, we used R to add the script. The `add_ecmascript` function could be added to the original R code, before the `toString.XMLNode` function. Or, as shown below, we read the SVG back in, add the JavaScript, and then save it again, in case you are copying and pasting the code from this page. `add_ecmascript` is from [the CRDV code][8].

{% highlight r %}

# R variable containing the above JavaScript, separated with returns
jsScript <- c('var draw = function(){
var path = document.getElementById("drivePath");
var length = path.getTotalLength();
path.style.transition = path.style.WebkitTransition = "none";
path.style.strokeDasharray = length + \' \' + length;
path.style.strokeDashoffset = length;
path.getBoundingClientRect();
path.style.transition = path.style.WebkitTransition ="stroke-dashoffset 10s linear";
path.style.strokeOpacity = "1";
path.style.strokeDashoffset= "0";
}'
)

svg <-  XML::xmlParse(svgOut, useInternalNode=TRUE)
# add javascript to the svg, if it will be a stand alone svg file
svg <- svg %>% add_ecmascript(jsScript) %>% toString.XMLNode()

# and save the edited version of the SVG, again
cat(svg, file = paste0(svgOut), append = FALSE)
{% endhighlight %}

This entire SVG can then be copied into an HTML document, as shown [here][12].

## Final Product

After all this, we are left with the following map. Click the button to start the animation.

<div id="driveRouteContainer">
	<a class="button left r15 small radius" onclick="draw('driveRouteObj','drivePath');">Draw Route</a>
	<object id="driveRouteObj" data="{{ site.baseurl }}/images/driveRouteAnimated.svg" type="image/svg+xml" width = "90%" height = "90%"></object>
</div>

<script src="{{ site.baseurl }}/assets/js/drawDriveRoute.js"></script>

## Final Thoughts

The XML package can be leveraged to edit SVG files, including the ability to add animations to the SVG. By identifying the `<path>` element you want to animate, naming it, and passing it to some JavaScript code, the path can be animated. While the demonstration here is a simplistic animation, the methodology will scale to more complex animations.

Instead of having the final map start with a button click, or on the page loading, it is preferable to have it run once the user has scrolled to the figure location. One of the scrolling animation JavaScript libraries, e.g., [ScrollMagic][13], is likely required to do this, and will be completed in the future since I am unfamiliar with them at this point.

Finally, there are two existing R packages that could likely handle this animation. First, there is the [SVGAnnotation][18] package, but it was last updated in 2012. Also, there is the [gridSVG][17] package that has an animate function, however, it uses SMIL animation on SVGs and according to [this post][16] SMIL is depreciated in Chrome. As such, we forged ahead using the XML package to handle the modifications to the SVG.

### Find the Code

Both the code for [Part 1][1], and this part are available on [GitHub][14]. The steps described here are isolated in [`modifySVGForAnimation.R`][15].

## Acknowledgements

The [Colorado River Drought Visualisation project][2] inspired this animation, and provided much of the [code][7] we relied on, either directly or as an example. The folks at the United States Geological Survey Center for Integrated Data Analytics deserve all of the credit.

__Full disclosure:__ _I was fortunate to be a part of the Colorado River Drought visualisation project during its beginning stages, and prior to my sabbatical._

<!-- links: -->
[1]: /blog/2016/01/25/nicaragua-making-map/
[2]: https://www.doi.gov/water/owdi.cr.drought/en/#Shortage
[3]: http://dmitrybaranovskiy.github.io/raphael/australia.html
[4]: http://www.svgopen.org/2007/papers/SLOGO_Abstract/SLogo_Fig9_Goldberg_Machine.svg 
[5]: https://jakearchibald.com/2013/animated-line-drawing-svg/
[6]: https://24ways.org/2013/animating-vectors-with-svg/
[7]: https://github.com/USGS-CIDA/OWDI-Lower-Colorado-Drought-Vis
[8]: https://github.com/USGS-CIDA/OWDI-Lower-Colorado-Drought-Vis/tree/master/scripts/R
[9]: https://github.com/rabutler/animateNicaDrive/blob/master/driveRoute.svg
[10]: https://github.com/rabutler/animateNicaDrive/blob/master/svgModFunctions.R
[11]: https://css-tricks.com/svg-line-animation-works/
[12]: /projects/animated-drive-route-figure-only.html
[13]: http://scrollmagic.io/
[14]: https://github.com/rabutler/animateNicaDrive/
[15]: https://github.com/rabutler/animateNicaDrive/blob/master/modifySVGForAnimation.R
[16]: https://groups.google.com/a/chromium.org/forum/#!topic/blink-dev/5o0yiO440LM%5B1-25%5D
[17]: https://sjp.co.nz/projects/gridsvg/
[18]: http://bioconductor.org/packages/devel/extra/html/SVGAnnotation.html
