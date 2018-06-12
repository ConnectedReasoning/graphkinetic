import {inject, DOM, noView, bindable} from 'aurelia-framework';
import * as _ from 'lodash';
import 'materialize-css';
import * as d3 from 'd3';
@inject(DOM.Element)
export class app {

  constructor(element) {
    this.lesmiserables = null;
    this.element = element;
    this.width = window.innerWidth * 0.55;
    this.height = window.innerHeight * 0.75;
    this.initIcons.bind(this);
    this.initSvg.bind(this);
    this.getIcon.bind(this);
  }
  attached() {
    this.svg = d3.select(this.graphDiagram).append('svg')
    .attr('width', this.width)
    .attr('height', this.height);
    this.initIcons();
    this.initSvg();
    const pngModalElement = document.querySelectorAll('#png-modal');
    this.pngModal = M.Modal.init(pngModalElement, null);
    const pdfModalElement = document.querySelectorAll('#pdf-modal');
    this.pdfModal = M.Modal.init(pdfModalElement, null);
    const styleModalElement = document.querySelectorAll('#style-modal');
    this.styleModal = M.Modal.init(styleModalElement, null);
    const classificationModalElement = document.querySelectorAll('#classification-modal');
    this.classificationModal = M.Modal.init(classificationModalElement, null);
  }

  initSvg() {
    const self = this;
    this.svg.append('rect')
        .attr('width', '100%')
        .attr('height', '100%')
        .attr('fill', 'white');

    this.lesmiserables = this.getData();
    const force = d3.layout.force()
        .gravity(0.053)
        .distance(350)
        .charge(-300)
        .size([this.width, this.height])
        .nodes(this.lesmiserables.nodes)
        .links(this.lesmiserables.links)
        .start();


    const edges = this.svg.selectAll('line')
      .data(this.lesmiserables.links)
      .enter().append('line')
      .attr('class', 'link');

    const nodes = this.svg.selectAll('.node')
      .data(this.lesmiserables.nodes)
      .enter().append('g')
      .attr('class', 'node')
      .attr('selected', 'false')
      .on('click', this.click)
      .call(force.drag);
    nodes.selected = false;

    nodes.each(function(d) {
      const iconImage = self.getIcon(this.__data__.CCLASSIFICATIONID);
      d3.select(this).append('image')
          .attr('xlink:href', iconImage)
          .attr('x', -32)
          .attr('y', -20)
          .attr('width', 42)
          .attr('height', 42);
    });
    nodes.append('text')
      .attr('dx', 12)
      .attr('dy', '.35em')
      .style('cursor', 'pointer')
      .style('font-size', '18px')
      .text(function(d) {
        return d.name;
      });
    /*
    const edgepaths = this.svg.selectAll('.edgepath')
      .data(this.lesmiserables.links)
      .enter()
      .append('path')
      .attr({'d': function(d) {return 'M ' + d.source.x + ' ' + d.source.y + ' L ' + d.target.x + ' ' + d.target.y; },
        'class': 'edgepath',
        'fill-opacity': 0,
        'stroke-opacity': 0,
        'fill': 'blue',
        'stroke': 'red',
        'id': function( d, i) {return 'edgepath' + i; }})
      .style('pointer-events', 'none');

    const edgelabels = this.svg.selectAll('.edgelabel')
      .data(this.lesmiserables.links)
      .enter()
      .append('text')
      .style('pointer-events', 'none')
      .attr({'class': 'edgelabel',
        'id': function( d, i) {return 'edgelabel' + i; },
        'dx': 55,
        'dy': 0});
    /*
    edgelabels.append('textPath')
      .attr('xlink: href', function( d, i) {return '#edgepath' + i;})
      .style('pointer-events', 'none')
      .text(function(d, i) {return '';});
    */
    force.on('tick',  function() {
      edges.attr({'x1': function(d) {return d.source.x;},
        'y1': function(d) {return d.source.y;},
        'x2': function(d) {return d.target.x;},
        'y2': function(d) {return d.target.y;}
      });

      nodes.attr('transform', function(d) {
        return 'translate(' + d.x + ', ' + d.y + ')';
      });
      /*
      edgepaths.attr('d', function(d) {
        const path = 'M ' + d.source.x + ' ' + d.source.y + ' L ' + d.target.x + ' ' + d.target.y;
        return path;
      });

      edgelabels.attr('transform', function(d, i) {
        if (d.target.x < d.source.x) {
          bbox = this.getBBox();
          rx = bbox.x + bbox.width / 2;
          ry = bbox.y + bbox.height / 2;
          return 'rotate(180 ' + rx + ' ' + ry + ')';
        } else {
          return 'rotate(0)';
        }
      });
      */
    });

    this.svg
      .on( 'mousedown', function() {
        const p = d3.mouse( this);
        this.svg.append( 'rect')
        .attr({
          rx: 6,
          ry: 6,
          class: 'selection',
          x: p[0],
          y: p[1],
          width: 0,
          height: 0
        });
      })
      .on('mousemove', function() {
        const s = self.svg.select('rect.selection');

        if ( !s.empty()) {
          const p = (d3.mouse( this),

            d = {
              x: parseInt( s.attr( 'x'), 10),
              y: parseInt( s.attr( 'y'), 10),
              width: parseInt( s.attr( 'width'), 10),
              height: parseInt( s.attr( 'height'), 10)
            },
            move = {
              x: p[0] - d.x,
              y: p[1] - d.y
            });

          if ( move.x < 1 || (move.x * 2 < d.width)) {
            d.x = p[0];
            d.width -= move.x;
          } else {
            d.width = move.x;
          }

          if ( move.y < 1 || (move.y * 2 < d.height)) {
            d.y = p[1];
            d.height -= move.y;
          } else {
            d.height = move.y;
          }
          s.attr( d);
        }
      })
      .on( 'mouseup', function() {
        const s = self.svg.select( 'rect.selection');
        let rect  = null;
        let selectBox = null;
        if ( !s.empty() ) {
          let p = (d3.mouse( this), rect = {
            x: parseInt( s.attr( 'x'), 10),
            y: parseInt( s.attr( 'y'), 10),
            width: parseInt( s.attr( 'width'), 10),
            heighT: parseInt( s.attr( 'height'), 10)
          });
          selectBox = {
            x1: rect.x,
            y1: rect.y,
            x2: rect.x + rect.width,
            y2: rect.y + rect.height
          };
        }
        d3.selectAll('g.node')  //here's how you get all the nodes
        .each(function(d, that) {
                // your update code here as it was in your example
          let position = this.attributes.transform.value.replace('translate(', '').replace(')', '');
          position = position.split(', ');
          const x = position[0];
          const y = position[1];
          if (selectBox !== null && typeof(selectBox) !== 'undefined' && x > selectBox.x1 && x < selectBox.x2 && y > selectBox.y1 && y < selectBox.y2) {
            d3.select(this).attr('selected', 'true');
            d3.select(this).select('text').transition()
                .duration(250)
                .style('fill', 'red')
                .style('stroke', 'red')
                .style('stroke-width', '.5px');
          } else {
            d3.select(this).attr('selected', 'false');
            d3.select(this).select('text').transition()
                .duration(250)
                .style('fill', '#333')
                .style('stroke', '#333')
                .style('stroke-width', '.5px');
            const name = d.name;
            const foundLines = _.filter( svg.selectAll('line')[0], function(o) {
              return (o.__data__.source.name === name || o.__data__.target.name === name);
            });
            if (foundLines !== null && typeof(foundLines) !== 'undefined' && foundLines.length > 0) {
              _.forEach(foundLines, function(foundLine) {
                foundLine.style.stroke = '#ccc';
                foundLine.style.strokeWidth = '.5epx';
              });
            }
            const foundTexts = _.filter( svg.selectAll('.edgelabel')[0], function(o) {
              return (o.__data__.source.name === name || o.__data__.target.name === name);
            });

            if (foundTexts !== null && typeof(foundTexts) !== 'undefined' && foundTexts.length > 0) {
              _.forEach(foundTexts, function(foundText) {
                foundText.style.font = '10px sans-serif';
                foundText.style.fill = '#ccc';
              });
            }
          }
        });
        this.svg.select('.selection').remove();
      }
    );
  }

  initIcons() {
    const json = this.getData();
    const icons = json.icons;
    localStorage.setItem('icons', JSON.stringify(icons));
  }

  click() {
    d3.select(this).attr('selected', 'true');
    d3.select(this).select('text').transition()
        .duration(250)
        .style('fill', 'red')
        .style('stroke', 'red')
        .style('stroke-width', '.35px')
        .style('font-size', '22px')
        .style('font-family', 'sans-serif')
        .style('font-weight', '700');
    sthis.vg.select('.selection').remove();
  }

  onOpenStyleModal() {
    this.styleModal[0].open();
  }
  onCloseStyleModal() {
    this.styleModal.close();
  }

  onOpenPdfModal() {
    this.pdfModal[0].open();
  }
  onClosePdfModal() {
    this.pdfModal.close();
  }

  onOpenPngModal() {
    this.pngModal[0].open();
  }
  onClosePngModal() {
    this.pngModal.close();
  }

  onOpenClassificationModal() {
    this.classificationModal[0].open();
  }
  onCloseClassificationModal() {
    this.classificationModal.close();
  }

  updateIcon(key, image) {
    const iconsJSON = localStorage.getItem('icons');
    const icons = JSON.parse(iconsJSON);
    //const classificationId = key;
    const index = _.findIndex(icons, function(icon) {
      return icon.classificationId === key;
    });
    icons[index].iconName = image;

    localStorage.setItem('icons', JSON.stringify(icons));
  }

  applyIcons() {
    const nodes = svg.selectAll('.node');
    this.svg.selectAll('g.node image').remove();
    nodes.each(function(d) {
      const icon =  this.getIcon(this.__data__.CCLASSIFICATIONID);
      d3.select(this).append('image')
          .attr('xlink: href', icon)
          .attr('x', -32)
          .attr('y', -20)
          .attr('width', 42)
          .attr('height', 42);
    });
    //$('#theModal').modal('hide')
  }

  getIcon(classificationId) {
    let foundData = null;
    try {
      const iconsJSON = localStorage.getItem('icons');
      const icons = JSON.parse(iconsJSON);
      foundData = _.find(icons, function(icon) {
        return icon.classificationId === classificationId;
      });
    } catch (e) {
      console.log('An error occured', e);
    }
    return foundData.iconName;
  }

  selectNodes(selectedNodes) {
    d3.selectAll('g.node')  //here's how you get all the nodes
    .each(function(d) {
    // your update code here as it was in your example
      const found = _.find(selectedNodes,
          function(o) {
            return o.textContent === d.name;
          }
      );
      if (found) {
        d3.select(this).attr('selected', 'true');
        d3.select(this).select('text').transition()
            .duration(250)
            .style('fill', 'red')
            .style('stroke', 'red')
            .style('stroke-width', '.35px')
            .style('font-size', '18px')
            .style('font-family', 'sans-serif');
      } else {
        d3.select(this).attr('selected', 'false');
        d3.select(this).select('text').transition()
            .duration(250)
            .attr('selected', 'true')
            .style('fill', '#333')
            .style('stroke', '#333')
            .style('stroke-width', '.35px')
            .style('font-size', '18px')
            .style('font-family', 'sans-serif');
      }
    });
  }

  setSelectedStyle(selectedNodes, bold, size, name, fontColor) {
    const fontWeight = (bold.trim() === 'bold') ? '800' : '400';
    d3.selectAll('g.node')  //here's how you get all the nodes
      .each(function(d) {
        const found = _.find(selectedNodes, function(o) { return o.textContent === d.name; });
        if (found) {
          d3.select(this).attr('selected', 'true');
          d3.select(this).select('text').transition()
              .duration(250)
              .attr('selected', 'true')
              .style('fill', fontColor)
              .style('stroke', fontColor)
              .style('stroke-width', '.35px')
              .style('font-weight', fontWeight)
              .style('font-size', size + 'px')
              .style('font-family', name);
        } else {
          d3.select(this).select('text').transition()
              .duration(250)
              .style('fill', '#333')
              .style('stroke', '#333')
              .style('stroke-width', '.35px');
        }
      });
    $('#theModal').modal('hide');
  }

  getData() {
    return {nodes: [{
      name: 'Myriel',
      group: 1,
      CCLASSIFICATIONID: 'A'
    }, {
      name: 'Napoleon',
      group: 1,
      CCLASSIFICATIONID: 'A'
    },  {
      name: 'Mlle.Baptistine',
      group: 1,
      CCLASSIFICATIONID: 'A'
    }, {
      name: 'Mme.Magloire',
      group: 1,
      CCLASSIFICATIONID: 'B'
    }, {
      name: 'CountessdeLo',
      group: 1,
      CCLASSIFICATIONID: 'B'
    }, {
      name: 'Geborand',
      group: 1,
      CCLASSIFICATIONID: 'B'
    }, {
      name: 'Champtercier',
      group: 1,
      CCLASSIFICATIONID: 'C'
    }, {
      name: 'Cravatte',
      group: 1,
      CCLASSIFICATIONID: 'C'
    }, {
      name: 'Count',
      group: 1,
      CCLASSIFICATIONID: 'D'
    }, {
      name: 'OldMan',
      group: 1,
      CCLASSIFICATIONID: 'D'
    }, {
      name: 'Labarre',
      group: 2,
      CCLASSIFICATIONID: 'D'
    }, {
      name: 'Valjean',
      group: 2,
      CCLASSIFICATIONID: 'D'
    }, {
      name: 'Marguerite',
      group: 3,
      CCLASSIFICATIONID: 'D'
    }, {
      name: 'Mme.deR',
      group: 2,
      CCLASSIFICATIONID: 'D'
    }, {
      name: 'Isabeau',
      group: 2,
      CCLASSIFICATIONID: 'D'
    }, {
      name: 'Gervais',
      group: 2,
      CCLASSIFICATIONID: 'D'
    }, {
      name: 'Tholomyes',
      group: 3,
      CCLASSIFICATIONID: 'D'
    }, {
      name: 'Listolier',
      group: 3,
      CCLASSIFICATIONID: 'D'
    }, {
      name: 'Fameuil',
      group: 3,
      CCLASSIFICATIONID: 'D'
    }, {
      name: 'Blacheville',
      group: 3,
      CCLASSIFICATIONID: 'D'
    }, {
      name: 'Favourite',
      group: 3,
      CCLASSIFICATIONID: 'D'
    }],
      links: [{
        source: 1,
        target: 0,
        value: 1
      }, {
        source: 2,
        target: 0,
        value: 8
      }, {
        source: 3,
        target: 0,
        value: 10
      }, {
        source: 3,
        target: 2,
        value: 6
      }, {
        source: 4,
        target: 0,
        value: 1
      }, {
        source: 5,
        target: 0,
        value: 1
      }, {
        source: 6,
        target: 0,
        value: 1
      }, {
        source: 7,
        target: 0,
        value: 1
      }, {
        source: 8,
        target: 0,
        value: 2
      }, {
        source: 9,
        target: 0,
        value: 1
      }, {
        source: 11,
        target: 10,
        value: 1
      }, {
        source: 11,
        target: 3,
        value: 3
      }, {
        source: 11,
        target: 2,
        value: 3
      }, {
        source: 11,
        target: 0,
        value: 5
      }, {
        source: 12,
        target: 11,
        value: 1
      }, {
        source: 13,
        target: 11,
        value: 1
      }, {
        source: 14,
        target: 11,
        value: 1
      }, {
        source: 15,
        target: 11,
        value: 1
      }, {
        source: 17,
        target: 16,
        value: 4
      }, {
        source: 18,
        target: 16,
        value: 4
      }, {
        source: 18,
        target: 17,
        value: 4
      }, {
        source: 19,
        target: 16,
        value: 4
      }, {
        source: 19,
        target: 17,
        value: 4
      }, {
        source: 19,
        target: 18,
        value: 4
      }, {
        source: 20,
        target: 16,
        value: 3
      }, {
        source: 20,
        target: 17,
        value: 3
      }, {
        source: 20,
        target: 18,
        value: 3
      }, {
        source: 20,
        target: 19,
        value: 4
      }],
      icons: [
          {classificationId: 'A', iconName: '/img/bee.png'},
          {classificationId: 'B', iconName: '/img/doubleswoosh.png'},
          {classificationId: 'C', iconName: '/img/fire.png'},
          {classificationId: 'D', iconName: '/img/gradhat.png'}
      ]
    };
  }
  showIcon(key) {
    const dropd = document.getElementById('image-dropdown_' + key);
    dropd.style.height = '120px';
    dropd.style.overflow = 'scroll';
  }

  hideee(key) {
    const dropd = document.getElementById('image-dropdown_' + key);
    dropd.style.height = '30px';
    dropd.style.overflow = 'hidden';
  }

  selectIcon(imgParent, key, image) {
    hideee(key);

    const mainDIVV = document.getElementById('image-dropdown_' + key);
    imgParent.parentNode.removeChild(imgParent);
    mainDIVV.insertBefore(imgParent, mainDIVV.childNodes[0]);
    mainDIVV.style.overflow = 'hidden';
    mainDIVV.scrollTop = 0;
    updateIcon(key, image);
  }
}
