$(document).ready(function() {
  $('.button').button()
  $('.dialog').hide()
});

$('.dialog').live('dialogopen', function() {
  $('#main').dim()
  $('#main .dimmer').click(function() {
    $('#upload').dialog('close')
  })
});
$('.dialog').live('dialogclose', function() {
  $('#main').undim()
});

// Dim a given element. Good for underlying modals
(function($) {
  $.fn.dim = function() {
    if ($(this).css('position') == 'static') { 
      $(this).css('position', 'relative')
    }
    var dimmer = $('<div class="dimmer"></div>').css({
      display: 'none',
      position: 'absolute',
      left: 0,
      top: 0,
      width: '100%',
      height: '100%',
      opacity: 0.5,
      backgroundColor: 'black',
      'z-index': 100
    })
    $(this).append(dimmer)
    dimmer.fadeIn()
  }
  $.fn.undim = function() {
    $(this).find('.dimmer').fadeOut(function() {
      $(this).remove()
    })
  }
})(jQuery);

function rebuildTreemap(options) {
  options = options || {}
  var container = $(options.div || '#treemap')
  var tree = options.tree || container.data('tree')
  buildTreemap(tree, container.data('treemapOptions'))
}

function buildTreemap(tree, options) {
  options = options || {}
  var container = $(options.div || '#treemap')
  container.html('')
  container.data('treemapOptions', options)
  container.data('tree', tree)
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
    
  var wrapper = d3.select('#treemap')
    .append('svg:svg')
      .attr('class', 'wrapper')
      .attr('width', w )
      .attr('height', h);
  
  window.nodes = treemap(tree)
  var leafNodes = nodes.filter(function(n) { return !n.children })
  var groupNodes = nodes.filter(function(n) { return n.data.rank == rank })
  var ungroupedNodes = nodes.filter(function(n) { return !n.data.lineage[rank] })
  var leafCells = wrapper.selectAll('g.leaf.cell')
      .data(leafNodes)
    .enter()
      .append('svg:g')
        .attr('class', 'leaf cell')
        .style('overflow', 'hidden')
        .attr("width", function(d) { return d.dx; })
        .attr("height", function(d) { return d.dy; })
        .attr('transform', function(d) {
          return 'translate('+d.x+', '+d.y+')'
        })
        .attr('data-samples', function(n) { return n.data.samples; })
        .attr('data-name', function(n) { return n.data.name; })
        .attr('data-rank', function(n) { return n.data.rank; })
      .append('svg:rect')
        .style("fill", function(n) { 
          return n.data.lineage[rank] ? color(n.data.lineage[rank]) : null; 
        })
        .style('stroke', 'white')
        .style('stroke-width', 0.5)
        .attr("width", function(d) { return d.dx; })
        .attr("height", function(d) { return d.dy; });
  var ungroupedCells = wrapper.selectAll('g.ungrouped.cell')
      .data(ungroupedNodes)
    .enter()
      .append('svg:g')
        .attr('class', 'ungrouped cell')
        .attr('transform', function(d) {
          return 'translate('+d.x+', '+d.y+')'
        })
      .append('svg:rect')
        .style("fill", 'black')
        .attr("width", function(d) { return d.dx; })
        .attr("height", function(d) { return d.dy; });

  var groupCells = wrapper.selectAll('g.group.cell')
      .data(groupNodes)
    .enter()
      .append('svg:g')
        .attr('class', 'group cell')
        .attr('transform', function(d) {
          return 'translate('+d.x+', '+d.y+')'
        })
      .append('svg:rect')
        .style("fill", 'none')
        .attr("stroke", 'black')
        .attr("stroke-width", 3)
        .attr('x', 1.5)
        .attr('y', 1.5)
        .attr("width", function(d) { return d.dx  - 3; })
        .attr("height", function(d) { return d.dy - 3; });
  
  wrapper.selectAll('.leaf.cell').append('svg:foreignObject')
    .attr('width', function(d) { return d.dx })
    .attr('height', function(d) { return d.dy })
    .append('body')
      .attr('xmlns', "http://www.w3.org/1999/xhtml")
      .style('background-color', 'transparent')
      .append('div')
        .style('width',  function(d) { return d.dx + 'px' })
        .style('height', function(d) { return d.dy + 'px' })
        .style('display', 'table-cell')
        .style('vertical-align', 'middle')
        .style('text-align', 'center')
        .style('text-shadow', '0 0 0.5em black')
        .style('font-size', 'smaller')
        .text(function(n) { return n.data.name + ' ('+n.value+')'; });
              
  wrapper.selectAll('.group.cell').append('svg:foreignObject')
    .attr('x', 3)
    .attr('y', 3)
    .attr('width', function(d) { return d.dx - 6 })
    .attr('height', function(d) { return d.dy - 6 })
    .append('body')
      .attr('xmlns', "http://www.w3.org/1999/xhtml")
      .style('background-color', 'transparent')
      .append('span')
        .style('display', 'inline-block')
        .style('background-color', 'black')
        .style('padding', '0 5px 5px 0')
        .style('color', 'white')
        .text(function(n) { return n.data.name + ' ('+n.value+')'; });
  
  $('.cell.leaf').qtip({
    style: {
      widget: true,
      classes: 'ui-tooltip-shadow'
    },
    position: {
      viewport: $(window),
      adjust: {
        x: -10,
        y: -10,
        method: 'shift'
      }
    },
    content: {
      title: function() {
        return $.string($(this).attr('data-rank')).capitalize().str + ': ' + $(this).attr('data-name') + ' Samples'
      },
      text: function() {
        var ul = $('<ul></ul>')
        $.each($(this).attr('data-samples').split(','), function() {
          ul.append($('<li>'+this+'</li>'))
        })
        return ul;
      }
    }
  })
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
      .attr("x", function(d) { return d.x; })
      .attr("y", function(d) { return d.y; })
      .attr("width", function(d) { return d.dx; })
      .attr("height", function(d) { return d.dy; })
}
