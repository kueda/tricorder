function buildTreemap(tree, options) {
  options = options || {}
  var container = $(options.div || '#treemap')
  container.html('')
  var w = container.width(),
      h = $(window).height() - container.offset().top,
      color = options.colorScale || d3.scale.category20(),
      rank = options.grouprank || 'class';
  window.treemap = d3.layout.treemap()
    .size([w, h])
    .value(function(n) { return n.count; } )
    .children(function(n) {
      return n ? n.children : null
    })
    .sticky(true)
    
  var wrapper = d3.select('#treemap').append('div')
    .attr('class', 'wrapper')
    .style('position', 'relative')
    .style('width', w + 'px')
    .style('height', h + 'px');
  
  window.nodes = treemap(tree)
  var cells = wrapper.selectAll('div.cell')
      .data(nodes)
    .enter()
      .append('div')
        .attr('class', function(n) {
          var klass = 'cell'
          if (!n.children) { klass += ' leaf'};
          if (n.data.rank == rank) { klass += ' grouprank'};
          if (!n.data.lineage[rank]) { klass += ' ungrouped'};
          return klass
        })
        .attr('title', function(n) { return rank + ': ' + n.data.lineage[rank]})
        .call(cell);
  var values = wrapper.selectAll('.leaf').append('div')
    .attr('class', 'value')
    .style("background", function(n) { 
      return n.data.lineage[rank] ? color(n.data.lineage[rank]) : null; 
    });
  var groupValues = wrapper.selectAll('.grouprank').append('div')
    .attr('class', 'value');
  wrapper.selectAll('.value').append('label')
    .style("color", function(n) { 
      return n.data.rank == rank && n.data.lineage[rank] ? color(n.data.lineage[rank]) : null; 
    })
    .text(function(n) { return n.data.name + ' ('+n.value+')'; });
}

function scaleTreemap(tree, dataUrl, options) {
  options = options || {}
  var cells = d3.select(options.div || '#treemap').select('.wrapper').selectAll('div')
  if (!dataUrl) {
    cells.data(treemap.value(function(d) { return d.count; })(tree))
      .transition()
        .duration(1500)
        .call(cell);
    return
  }
  
  d3.text(dataUrl, function(txt) {
    var abundances = {}
    var rows = txt.split("\n"), pieces;
    for (var i = rows.length - 1; i >= 0; i--){
      pieces = rows[i].split("\t")
      abundances[pieces[0]] = parseFloat(pieces[1])
    }
    
    cells
        .data(treemap.value(function(d) {
          return d3.sum(d.samples, function(s) { 
            var key = s.split('|')[0]
            return abundances[key] || 1
          })
        })(tree))
      .transition()
        .duration(1500)
        .call(cell);
  })
}

function cell() {
  this
      .style("left", function(d) { return d.x + "px"; })
      .style("top", function(d) { return d.y + "px"; })
      .style("width", function(d) { return d.dx  + "px"; })
      .style("height", function(d) { return d.dy + "px"; })
}
