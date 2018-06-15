import {inject, DOM, noView, bindable} from 'aurelia-framework';
import * as _ from 'lodash';
import 'materialize-css';
import * as d3 from 'd3';
import * as $ from 'jquery';
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
    this.selectedIcon = null;
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
      }
    );
    force.on('tick',  function() {
      edges.attr({'x1': function(d) {return d.source.x;},
        'y1': function(d) {return d.source.y;},
        'x2': function(d) {return d.target.x;},
        'y2': function(d) {return d.target.y;}
      });

      nodes.attr('transform', function(d) {
        return 'translate(' + d.x + ', ' + d.y + ')';
      });
    });
  }

  initIcons() {
    const json = this.getData();
    this.icons = json.icons;
    this.images = json.images;
    localStorage.setItem('icons', JSON.stringify(this.icons));
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
    this.setOpenClassificationModalContent();
    this.classificationModal[0].open();
  }
  setOpenClassificationModalContent() {
    const groupedNodes = _.groupBy(this.lesmiserables.nodes, 'CCLASSIFICATIONID');
    this.groups = [];
    const groupNames = Object.getOwnPropertyNames(groupedNodes);

    groupNames.forEach( (key) => {
      if (groupedNodes.hasOwnProperty(key)) {
        this.groups.push(groupedNodes[key]);
      }
    });
    this.groups.forEach((g) => {
      g.icon = this.getIcon(g[0].CCLASSIFICATIONID);
      g.id = g[0].CCLASSIFICATIONID;
      g.count = g.length;
    });
    setTimeout(() => {
      const elems = document.querySelectorAll('.dropdown-trigger');
      M.Dropdown.init(elems, null);
    }, 500);
  }

  onCloseClassificationModal() {
    this.classificationModal[0].close();
  }

  updateIcon(iconname, key) {
    const index = _.findIndex(this.icons, function(icon) {
      return icon.classificationId === key;
    });

    this.icons[index].iconName = iconname;
    localStorage.setItem('icons', JSON.stringify(this.icons));
    this.setOpenClassificationModalContent();
  }

  applyIcons() {
    const self = this;
    const nodes = this.svg.selectAll('.node');
    this.svg.selectAll('g.node image').remove();
    nodes.each(function(d) {
      const icon =  self.getIcon(d.CCLASSIFICATIONID);
      d3.select(this).append('image')
          .attr('xlink:href', icon)
          .attr('x', -32)
          .attr('y', -20)
          .attr('width', 42)
          .attr('height', 42);
    });
    this.onCloseClassificationModal();
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
      ],
      images: [
        '/img/bee.png',
        '/img/doubleswoosh.png',
        '/img/fire.png',
        '/img/gradhat.png',
        '/img/greenshield.jpg'
      ]
    };
  }
  showIcon(key) {
    const dropd = document.getElementById('image-dropdown_' + key);
    dropd.style.height = '120px';
    dropd.style.overflow = 'scroll';
  }
}
