# viz-perf-compare

## Some very high-level points
- SVG vs HTML matters less for perf than you'd think if they're structured roughly the same way
- A common trick of SVG viz libraries is they'll put their chart "segments" within a single element, mimicked by a path or fill mode that makes it look like multiple
- But you could do this (don't do this) with css background linear-gradient if you wanted to, too. https://codepen.io/chriscoyier/pen/yLNmyYz
- One of the biggest benefits to using plain HTML, well-structured SVG, etc. over Canvas, in spite of its likely perf gains, is that you can take advantage of their better handling of layout, pointer interaction, a11y, etc. for free.
- There ARE big perf gains for data viz by doing strategic data fetching. We should spend more time on this macro-level stuff than element-level stuff when building our chartsengrafs.
- Gold exports to Switzerland are a true stereotype and I can't believe it
