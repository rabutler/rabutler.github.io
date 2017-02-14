---
#
# Use the widgets beneath and the content will be
# inserted automagically in the webpage. To make
# this work, you have to use › layout: frontpage
#
layout: frontpage
header:
  image_fullwidth: header_volcan_acatenango.jpg
widget1:
  title: "My Trips"
  url: '/trips/'
  image: widget-trips-303x182.jpg
  text: 'Check out some of the cool trips I have taken.'
widget2:
  title: "My Small Projects"
  url: '/projects/'
  text: 'I enjoy coding, mostly in R. I also enjoy exploring data and playing with visualizations. Check out some of my small projects.'
  image: widget-projects-303x182.jpg
widget3:
  title: "More About Me"
  url: '/now/'
  image: widget-aboutMe-303x182.jpg
  text: 'Find out more about what I am up to now.'
#
# Use the call for action to show a button on the frontpage
#
# To make internal links, just use a permalink like this
# url: /getting-started/
#
# To style the button in different colors, use no value
# to use the main color or success, alert or secondary.
# To change colors see sass/_01_settings_colors.scss
#
#callforaction:
#  url: https://tinyletter.com/feeling-responsive
#  text: Inform me about new updates and features ›
#  style: alert
permalink: /index.html
#
# This is a nasty hack to make the navigation highlight
# this page as active in the topbar navigation
#
homepage: true
---

