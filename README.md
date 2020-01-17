![Logo](https://cdn.rawgit.com/paulbrzeski/manifold/master/assets/manifold-01.png)

# Introduction

A hybrid 2D/3D design tool, this is an experimental program to address the need for fast and efficient modelling for Three.JS scenes, which is the main 3D drawing framework used by [Open Studios](https://openstudios.xyz). The 2D vector component can also be used for general illustration and design needs.

The main conceit of Manifold is to provide a high performance environment for artists of all experience levels to intuitively sketch and give form to their ideas. For indie game development - that means going from hand sketched concept art to a 3D game ready asset with a few clicks. A 3D Printing Hobbyist may find Manifold to be easier to experiment than a traditional modelling tool such as 3DS Max.

Current build and proof of concept: [Manifold demo](http://manifold.paulbrzeski.com)

# What's working?
- Preview of UI, some elements are working in a rudimentary way 
- Currently convert raster images into vectors using Potrace
- Check out [this video](https://openstudios.xyz/assets/manifold.mp4) to see Manifold in action

![Screenshot](https://cdn.rawgit.com/paulbrzeski/manifold/master/assets/screenshot.png)

# What's next?
There's a lot to come, but more info can be found in my blog posts about this project: 
- [When I grow up, I want to be George Lucas](https://medium.com/@mail_59849/when-i-grow-up-i-want-to-be-george-lucas-fba6d5ae93b8)
  - An explanation of where Manifod sits in the production pipeline and my resource availability at present
- [Open Source: The peaceful revolution](https://medium.com/@mail_59849/open-source-the-peaceful-revolution-f9aeacd4171d)
  - Why is the Free and Open Source Software movement yet to make a significant impact on multimedia production and video games? 
- [My angel is the manifold](https://medium.com/@mail_59849/my-angel-is-the-manifold-d0b718d03071)
  - My initial attempt to define what Manifold is meant to be.
- [Creating good tools for a brave new world](https://medium.com/@mail_59849/creating-good-tools-for-a-brave-new-world-a85fa2da43cf)
  - A broad discussion of graphics design software and how Manifold can create shortcuts in the design process using pre-modelled "macros"

This project needs [your support](https://openstudios.xyz/donate.html)!

## Credits
- Fabric JS https://github.com/kangax/fabric.js/
- Image Tracer https://github.com/jankovicsandras/imagetracerjs
- Potrace JS port https://github.com/kilobtye/potrace
- Three.JS https://github.com/mrdoob/three.js
- This example of a polyfill to extract sub paths from an SVG path https://github.com/Delapouite/svg-break-apart
- Using new SVGLoader https://github.com/mrdoob/three.js/issues/13478
