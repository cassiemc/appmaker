var Sketch = new Tool('Sketch')
Sketch.set('color', 'rgba(26, 134, 214, 1)')
Sketch.set('description', 'Sketch pictures for your project.')
Sketch.set('beta', true)

// http://intridea.github.io/sketch.js/

Sketch.on('open', function () {
  $('#SketchCanvas')
    .attr('width', $(window).width())
    .attr('height', $(window).height())
    .sketch()
})
