$(document).ready(function() {
  $('.button').button()
  $('.dialog').hide()
  $('.dialog .pagination a').click(ajaxifyPaginationLink)
  $('.tabs').each(function() {
    var tabs = $(this).find('ul li'), selected = 0
    for (var i=0; i < tabs.length; i++) {
      if ($(tabs[i]).hasClass('selected')) { selected = i; break; } // select tabs with "selected" clas
      if ($(tabs[i]).find('a[href='+window.location.hash+']').length > 0) {selected = i; break;}; // select tab specified in URL anchor
    }
    $(this).tabs({selected: selected});
  })
});

function ajaxifyPaginationLink() {
  var parent = $(this).parents('.pagination').parent(),
      url = $(this).attr('href');
  if (!url.match(/partial=\w+/)) { url += '&partial=true' };
  $(parent).load(url, function() {
    $(this).find('.pagination a').click(ajaxifyPaginationLink)
  })
  return false
}

$('.dialog').live('dialogopen', function() {
  $('#main').dim()
  $('#main .dimmer').click(function() {
    $('.dialog').dialog('close')
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
      backgroundColor: '#111111',
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

var DEFAULT_RANK = 'class'

function rebuildTreemap(options) {
  options = options || {}
  var container = $(options.div || '#treemap')
  var tree = options.tree || container.data('tree')
  buildTreemap(tree, container.data('treemapOptions'))
}

function cellPosition(selection, options) {
  var options = options || {},
      rank = options.grouprank || DEFAULT_RANK;
  this
    .attr("width", function(d) { return d.dx; })
    .attr("height", function(d) { return d.dy; })
    .attr('transform', function(d) { return 'translate('+d.x+', '+d.y+')' })
    .select('rect')
      .attr('x', function(d) {
        return d.data.rank == rank ? 1.5 : 0;
      })
      .attr('y', function(d) {
        return d.data.rank == rank ? 1.5 : 0;
      })
      .attr("width", function(d) { 
        return d.data.rank == rank ? d.dx - 3 : d.dx;
      })
      .attr("height", function(d) { 
        return d.data.rank == rank ? d.dy - 3 : d.dy;
      });
}

// This does the same thing as the individual node type methods.  At one 
// point I thought it might be useful to have it all in one function...
function cellStyle(selection, options) {
  var options = options || {},
      color = options.colorScale || d3.scale.category20(),
      rank = options.grouprank || DEFAULT_RANK;
  this
    .style('visibility', 'visible')
    .select('rect')
      .style("fill", function(n) { 
        if (!n.children) {
          return n.data.lineage[rank] ? color(n.data.lineage[rank]) : null; 
        }
        else if (n.data.rank == rank) {
          return 'none'
        }
        else if (!n.data.lineage[rank]) {
          return '#111111'
        }
      })
      .style('stroke', function(n) {
        if (!n.children) {
          return 'white'; 
        }
        else if (n.data.rank == rank) {
          return '#111111'
        }
        else if (!n.data.lineage[rank]) {
          return 'white'
        }
      })
      .style('stroke-width', function(n) {
        if (!n.children) {
          return 0.5; 
        }
        else if (n.data.rank == rank) {
          return 3
        }
        else if (!n.data.lineage[rank]) {
          return 0.5;
        }
      })
}

function leafStyle(selection, options) {
  var options = options || {},
      color = options.colorScale || d3.scale.category20(),
      rank = options.grouprank || DEFAULT_RANK;
  this
    .style('visibility', 'visible')
    .select('rect')
      .style("fill", function(n) {
        return n.data.lineage[rank] ? color(n.data.lineage[rank]) : null; 
      })
      .style('stroke', 'white')
      .style('stroke-width', 0.5)
}

function ungroupedStyle() {
  this
    .style('visibility', 'visible')
    .select('rect')
      .style("fill", '#111111')
}

function groupStyle() {
  this
    .style('visibility', 'visible')
    .select('rect')
      .style("fill", 'none')
      .attr("stroke", '#111111')
      .attr("stroke-width", 3);
  this
    .select('foreignObject')
      .attr('width', function(d) { return d.dx - 6 })
      .attr('height', function(d) { return d.dy - 6 })
}

function leafLabel() {
  this
    .append('svg:foreignObject')
      .attr('class', 'label')
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
}

function groupLabel() {
  this.select('foreignObject').remove()
  this
    .append('svg:foreignObject')
      .attr('class', 'label')
      .attr('x', 3)
      .attr('y', 3)
      .attr('width', function(d) { return d.dx - 6 })
      .attr('height', function(d) { return d.dy - 6 })
      .append('body')
        .attr('xmlns', "http://www.w3.org/1999/xhtml")
        .style('background-color', 'transparent')
        .append('span')
          .style('display', 'inline-block')
          .style('background-color', '#111111')
          .style('padding', '0 5px 5px 0')
          .style('color', 'white')
          .text(function(n) { return n.data.name + ' ('+n.value+')'; });
}

function buildTreemap(tree, options) {
  options = options || {}
  var container = $(options.div || '#treemap')
  container.addClass('treemapvis')
  container.html('')
  container.data('treemapOptions', options)
  container.data('tree', tree)
  var w = container.width(),
      h = $(window).height() - container.offset().top,
      rank = options.grouprank || DEFAULT_RANK;
  var treemap = container.data('treemap') || d3.layout.treemap()
    .value(function(n) { return n.count; } )
    .children(function(n) {
      return n ? n.children : null
    })
    .sticky(true);
  treemap = treemap.size([w, h])
  container.data('treemap', treemap)
    
  var wrapper = d3.select(container.get(0))
    .append('svg:svg')
      .attr('class', 'wrapper')
      .attr('width', w )
      .attr('height', h);
  
  // create a hash pattern for hashed backgrounds
  wrapper.append('svg:defs').append('svg:pattern')
    .attr('id', 'hashpattern')
    .attr('x', 0)
    .attr('y', 0)
    .attr('width', 10)
    .attr('height', 10)
    .attr('patternUnits', 'userSpaceOnUse')
    .append('svg:path')
      .attr('d', 'M 10 0 L 0 10')
      .attr('fill', 'none')
      .attr('stroke', 'black')
      .attr('stroke-width', 1)
      .style('opacity', 0.2)
  
  var nodes = treemap(tree)
  var leafNodes = nodes.filter(function(n) { return !n.children })
  var groupNodes = nodes.filter(function(n) { return n.data.rank == rank })
  var ungroupedNodes = nodes.filter(function(n) { return !n.data.lineage[rank] })
  
  // ensure group nodes get added last.  Sadly, this is important
  nodes = leafNodes.concat(ungroupedNodes).concat(groupNodes);
  
  wrapper.selectAll('g.cell')
      .data(nodes)
    .enter()
      .append('svg:g')
        .attr('class', function(n) {
          var c = 'cell'
          if (!n.children) { c += ' leaf' }
          else if (n.data.rank == rank) { c += ' group' }
          else if (!n.data.lineage[rank]) { c += ' ungrouped' }
          return c;
        })
        .attr('data-samples', function(n) { return n.data.samples; })
        .attr('data-name', function(n) { return n.data.name; })
        .attr('data-rank', function(n) { return n.data.rank; })
        .append('svg:rect');
  
  wrapper.selectAll('.cell').call(cellPosition, options)
  wrapper.selectAll('.group.cell').call(groupLabel).call(groupStyle, options)
  wrapper.selectAll('.leaf.cell').call(leafLabel).call(leafStyle, options)
  
  $(container).find('.cell.leaf').each(function() {
    var enterEventType = 'tooltip' + $(this).attr('data-name')+'Enter'
    var exitEventType = 'tooltip' + $(this).attr('data-name')+'Exit'
    $(this).qtip({
      style: {
        widget: true,
        classes: 'ui-tooltip-shadow'
      },
      position: {
        viewport: $(window),
        my: 'top left',
        at: 'center',
        adjust: {
          x: 20,
          y: 20,
          method: 'flip'
        }
      },
      show: 'mouseenter ' + enterEventType,
      hide: 'unfocus ' + exitEventType,
      content: {
        title: function() {
          return $.string($(this).attr('data-rank')).capitalize().str + ': ' + $(this).attr('data-name') + ' Samples'
        },
        text: function() {
          var ul = $('<ul></ul>'),
              samples = $(this).attr('data-samples') || ''
          $.each(samples.split(','), function() {
            ul.append($('<li>'+this+'</li>'))
          })
          return ul;
        }
      }
    })
    
    // trigger custom events on mouse actions for triggering multiple 
    // tooltips when comparing
    $(this).mouseenter(function() {
      $('.cell.leaf').trigger(enterEventType)
    })
    $(this).mouseleave(function() {
      $('.cell.leaf').trigger(exitEventType)
    })
  })
}

function scaleTreemap(container, dataUrl, options) {
  options = options || {}
  var rank = options.grouprank || DEFAULT_RANK,
      duration = options.duration == 0 ? 0 : (options.duration || 1000),
      // container = $(options.div || '#treemap'),
      container = $(container),
      container = container.hasClass('treemapvis') ? container : container.find('.treemapvis'),
      tree = container.data('tree'),
      wrapper = d3.select(container.get(0)).select('.wrapper');
  var cells = wrapper.selectAll('.cell')
  if (!dataUrl) {
    var treemap = container.data('treemap').value(function(d) { return d.count; })
    container.data('treemap', treemap)
    var nodes = treemap(tree)
    var leafNodes       = nodes.filter(function(n) { return !n.children })
    var groupNodes      = nodes.filter(function(n) { return n.data.rank == rank })
    var ungroupedNodes  = nodes.filter(function(n) { return !n.data.lineage[rank] })
    nodes = leafNodes.concat(ungroupedNodes).concat(groupNodes);
    cells.data(nodes)
      .transition()
        .call(scaleTreemapTransition, options)
    return
  }
  
  d3.text(dataUrl, function(txt) {
    var abundances = {}
    var rows = txt.split("\n"), pieces;
    for (var i = rows.length - 1; i >= 0; i--){
      pieces = rows[i].split("\t")
      abundances[pieces[0]] = parseFloat(pieces[1])
    }
    
    var treemap = container.data('treemap').value(function(d) {
      return d3.sum(d.samples, function(s) { 
        // s = s.split('|')[0]
        return abundances[s] || 1
      })
    })
    container.data('treemap', treemap)
    var nodes = treemap(tree)
    var leafNodes       = nodes.filter(function(n) { return !n.children })
    var groupNodes      = nodes.filter(function(n) { return n.data.rank == rank })
    var ungroupedNodes  = nodes.filter(function(n) { return !n.data.lineage[rank] })
    nodes = leafNodes.concat(ungroupedNodes).concat(groupNodes);
    
    cells
        .data(nodes)
      .transition()
        .call(scaleTreemapTransition, options)
  })
}

function scaleTreemapTransition(selection, options) {
  options = options || {}
  var rank = options.grouprank || DEFAULT_RANK,
      duration = options.duration == 0 ? 0 : (options.duration || 1000)
  this
    .duration(duration)
    .call(cellPosition, options)
    .each('start', function() {
      d3.select(this).selectAll('.label').remove()
    })
    .each('end', function() {
      if (this.getAttribute('class').match('leaf')) {
        d3.select(this).call(leafLabel)
      } else if (this.getAttribute('class').match('group')) {
        d3.select(this).call(groupLabel)
      }
    });
}

function cell() {
  this
      .attr("x", function(d) { return d.x; })
      .attr("y", function(d) { return d.y; })
      .attr("width", function(d) { return d.dx; })
      .attr("height", function(d) { return d.dy; })
}

function tricorderDialog(selector, options) {
  options = $.extend({}, options, {width: 'auto'})
  $('.dialog').dialog('close')
  $(selector).dialog(options)
}

function buildScaleToggles(options) {
  $('.scaletoggle').each(function() {
    if ($(this).hasClass('built')) { return };
    $(this).addClass('built')
    var url = $(this).attr('data-url')
    if (!url) { return }
    var options = options || {},
        container = $($(this).attr('rel') || $(this).parents('.treemap').get(0) || '#treemap')
        container = container.hasClass('treemapvis') ? container : container.find('.treemapvis'),
        tree = container.data('tree'),
        grouprankSelect = $(this).parents('.tools').find('.grouprankcontrol select');
    
    $(this).buttonset()
    
    scaleTreemap(container, url, $.extend({}, options, {
      grouprank: grouprankSelect.val(), 
      duration: 1000
    }))
    
    $(this).find('.scaletoggle_on').click(function() {
      var grouprankSelect = $(this).parents('.tools').find('.grouprankcontrol select');
      scaleTreemap(container, url, $.extend({}, options, {
        grouprank: grouprankSelect.val(), 
        duration: 1000
      }))
    })
    $(this).find('.scaletoggle_off').click(function() {
      var grouprankSelect = $(this).parents('.tools').find('.grouprankcontrol select');
      scaleTreemap(container, null, $.extend({}, options, {
        grouprank: grouprankSelect.val(), 
        duration: 1000
      }))
    })
  })
}

$('[data-loading-click]').live('click', function() {
  var button = this
  var label = $.trim($(this).attr('data-loading-click'))
  if ($.trim($(this).attr('data-loading-click')) == 'true') { var label = 'Loading...' }
  var loading = $('<span></span>').html(label).addClass('loading').addClass($(this).attr('class'))
  $(this).hide().before(loading)
  
  // bind ajax success to restore the button
  if (!$(this).attr('data-loading-click-bound')) {
    $(this).parents('form').bind('ajax:success', function() {
      $(this).find('.loading').remove()
      $(button).show()
    })
    $(this).attr('data-loading-click-bound', true)
  }
})
