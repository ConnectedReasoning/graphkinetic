
$('.btnModal').on('click', function(e){
  e.preventDefault();
  $('#theModal').modal('show').find('.modal-content').load($(this).attr('href'));
});
$('#theModal').on('shown.bs.modal', function (e) { 
    
    e.preventDefault();
    var data = getData();
    var groups = _.groupBy(data.nodes, 'CCLASSIFICATIONID');
    $("table tbody tr").remove();
    _.forOwn(groups, function(value, key) { 
        var names = _.map(value, 'name');
        var icon = getIcon(key)
        var markup = "<tr>" + 
                     "<td>" + key + "</td><td>" + names.join(",") + "</td>" +
                     "<td><img src='" + icon + "' width=30 height=30 /></td>" + 
                    "<td>" +
                        "<div id='image-dropdown_" + key + "' class='image-dropdown'  onmouseleave='hideee(\"" + key + "\");'>" +

                            "<div class='img_holder' onclick='myfuunc(this, \"" + key + "\", \"\");' onmouseover='showww(\"" + key + "\");'>" +
                                "<img class='flagimgs first' src='' height=30 width=30 /> <span class='iTEXT'>Select Image</span>" +
                            "</div>" +                       
                            "<div class='img_holder' onclick='myfuunc(this, \"" + key + "\", \"img/bee.png\");' onmouseover='showww(\"" + key + "\");'>" +
                                "<img class='flagimgs first' src='img/bee.png' height=30 width=30 /> <span class='iTEXT'>Bee</span>" +
                            "</div>" +
                            "<div class='img_holder' onclick='myfuunc(this, \"" + key + "\", \"img/doubleswoosh.png\");' onmouseover='showww(\"" + key + "\");'>" +
                                "<img class='flagimgs first' src='img/doubleswoosh.png' height=30 width=30 /> <span class='iTEXT'>doubleswoosh</span>" +
                            "</div>" +
                            "<div class='img_holder' onclick='myfuunc(this, \"" + key + "\", \"img/fire.png\");' onmouseover='showww(\"" + key + "\");'>" +
                                "<img class='flagimgs first' src='img/fire.png' height=30 width=30  /> <span class='iTEXT'>fire</span>" +
                            "</div>" +
                            "<div class='img_holder' onclick='myfuunc(this, \"" + key + "\", \"img/githubicon.png\");' onmouseover='showww(\"" + key + "\");'>" +
                                "<img class='flagimgs first' src='img/githubicon.png'  height=30 width=30  /> <span class='iTEXT'>Githubicon</span>" +
                            "</div>" +
                            "<div class='img_holder' onclick='myfuunc(this,\"" + key + "\", \"img/gradhat.png\");' onmouseover='showww(\"" + key + "\");'>" +
                                "<img class='flagimgs first' src='img/gradhat.png' height=30 width=30 /> <span class='iTEXT'>Gradhat</span>" +
                            "</div>" +
                            "<div class='img_holder' onclick='myfuunc(this, \"" + key + "\", \"img/greenshield.jpg\");' onmouseover='showww(\"" + key + "\");'>" +
                                "<img class='flagimgs first' src='img/greenshield.jpg' height=30 width=30 /> <span class='iTEXT'>Greenshield</span>" +
                            "</div>" +                                            
                            "<div class='img_holder' onclick='myfuunc(this, \"" + key + "\", \"img/blackstar.png\");' onmouseover='showww(\"" + key + "\");'>" +
                                "<img class='flagimgs first' src='img/blackstar.png' height=30 width=30 /> <span class='iTEXT'>Blackstar</span>" +
                            "</div>" +  
                        "</div>" +
                    "</td>" +
                    "</tr>"

        $("table tbody").append(markup);
    });
    _.forOwn(groups, function(value, key) { 
        var icon_select = document.getElementById('icon_select_' + key);
        if(icon_select !== null){
            icon_select.addEventListener('change', handleIconSelect, false);
        }
    });
});
$("#filter_form").submit(function( event ) {
    event.preventDefault();
    var nodes = svg.selectAll(".node")[0];
    if(nodes !== null && nodes.length > 0){        
        var searchTerm = $("#filter")[0].value;
        var foundNodes = _.filter(nodes, function (node){
            return node.textContent.match(new RegExp("^" + "(" + searchTerm+ ")", "i"));
        });
        selectNodes(foundNodes);
    }
});

var width = 700;
var height = 700;

var svg = d3.select("#graphdiagram").append("svg")
    .attr("id", "mySvg")
    .attr("width", width)
    .attr("height", height);

function initSvg(){
    svg.append("rect")
        .attr("width", "100%")
        .attr("height", "100%")
        .attr("fill", "white");
    var json = getData();

    var force = d3.layout.force()
        .gravity(.05)
        .distance(150)
        .charge(-100)
        .size([width, height])
        .nodes(json.nodes)
        .links(json.links)
        .start();


    var edges = svg.selectAll("line")
      .data(json.links)
      .enter().append("line")
      .attr("class", "link");

    var node = svg.selectAll(".node")
        .data(json.nodes)
        .enter().append("g")
        .attr("class", "node")
        .attr("selected", "false")
        .on("click", click)
        .call(force.drag);
    node.selected = false;
    node.each(function(d){
        var icon = getIcon(this.__data__.CCLASSIFICATIONID);
        d3.select(this).append("image")
            .attr("xlink:href", icon)
            .attr("x", -8)
            .attr("y", -8)
            .attr("width", 16)
            .attr("height", 16);
    });
    node.append("text")
        .attr("dx", 12)
        .attr("dy", ".35em")
        .text(function (d) {
            return d.name
        });
    
    var edgepaths = svg.selectAll(".edgepath")
        .data(json.links)
        .enter()
        .append('path')
        .attr({'d': function(d) {return 'M '+d.source.x+' '+d.source.y+' L '+ d.target.x +' '+d.target.y},
               'class':'edgepath',
               'fill-opacity':0,
               'stroke-opacity':0,
               'fill':'blue',
               'stroke':'red',
               'id':function(d,i) {return 'edgepath'+i}})
        .style("pointer-events", "none");

    var edgelabels = svg.selectAll(".edgelabel")
        .data(json.links)
        .enter()
        .append('text')
        .style("pointer-events", "none")
        .attr({'class':'edgelabel',
               'id':function(d,i){return 'edgelabel'+i},
               'dx':55,
               'dy':0});

    edgelabels.append('textPath')
        .attr('xlink:href',function(d,i) {return '#edgepath'+i})
        .style("pointer-events", "none")
        .text(function(d,i){return 'label '+i});

    force.on("tick", function () {
        edges.attr({"x1": function (d) {return d.source.x;},
                    "y1": function (d) {return d.source.y;},
                    "x2": function (d) {return d.target.x;},
                    "y2": function (d) {return d.target.y;}
        });

        node.attr("transform", function (d) {
            return "translate(" + d.x + "," + d.y + ")";
        });
        edgepaths.attr('d', function(d) { var path='M '+d.source.x+' '+d.source.y+' L '+ d.target.x +' '+d.target.y;
                                           return path});       

        edgelabels.attr('transform',function(d,i){
            if (d.target.x<d.source.x){
                bbox = this.getBBox();
                rx = bbox.x+bbox.width/2;
                ry = bbox.y+bbox.height/2;
                return 'rotate(180 '+rx+' '+ry+')';
                }
            else {
                return 'rotate(0)';
                }
        });
    });
    svg
        .on( "mousedown", function() {
            var p = d3.mouse( this);
            svg.append( "rect")
            .attr({
                rx      : 6,
                ry      : 6,
                class   : "selection",
                x       : p[0],
                y       : p[1],
                width   : 0,
                height  : 0
            })
        })
        .on( "mousemove", function() {
            var s = svg.select( "rect.selection");

            if( !s.empty()) {
                var p = d3.mouse( this),

                    d = {
                        x       : parseInt( s.attr( "x"), 10),
                        y       : parseInt( s.attr( "y"), 10),
                        width   : parseInt( s.attr( "width"), 10),
                        height  : parseInt( s.attr( "height"), 10)
                    },
                    move = {
                        x : p[0] - d.x,
                        y : p[1] - d.y
                    }
                ;

                if( move.x < 1 || (move.x*2<d.width)) {
                    d.x = p[0];
                    d.width -= move.x;
                } else {
                    d.width = move.x;       
                }

                if( move.y < 1 || (move.y*2<d.height)) {
                    d.y = p[1];
                    d.height -= move.y;
                } else {
                    d.height = move.y;       
                }
                s.attr( d);
            }
        })
        .on( "mouseup", function() {
            var s = svg.select( "rect.selection");
            var rect  = null;
            var selectBox = null;
            if( !s.empty()) {
                var p = d3.mouse( this),

                    rect = {
                        x       : parseInt( s.attr( "x"), 10),
                        y       : parseInt( s.attr( "y"), 10),
                        width   : parseInt( s.attr( "width"), 10),
                        height  : parseInt( s.attr( "height"), 10)
                    }
                    selectBox = {
                        x1 : rect.x,
                        y1 : rect.y,
                        x2 : rect.x + rect.width,
                        y2 : rect.y + rect.height
                    }
            }
            d3.selectAll("g.node")  //here"s how you get all the nodes
                .each(function(d, that) {
                    // your update code here as it was in your example

                    var position = this.attributes["transform"].value.replace("translate(", "").replace(")", "");
                    position = position.split(",");
                    var x = position[0];
                    var y = position[1];
                    if(selectBox !== null && typeof(selectBox) !== 'undefined' && x > selectBox.x1 && x < selectBox.x2 && y > selectBox.y1 && y < selectBox.y2){
                        d3.select(this).attr("selected", "true");
                        d3.select(this).select("text").transition()
                            .duration(250)
                            .style("fill", "red")
                            .style("stroke", "red")
                            .style("stroke-width", ".5px")
                            .style("font", "12px sans-serif");
                    } else {
                        d3.select(this).attr("selected", "false");
                        d3.select(this).select("text").transition()
                            .duration(250)
                            .style("fill", "#333")
                            .style("stroke", "#333")
                            .style("stroke-width", ".5px")
                            .style("font", "10px sans-serif");
                        var name = d.name;
                        var foundLines = _.filter( svg.selectAll("line")[0], function(o, d){
                            return (o.__data__.source.name === name || o.__data__.target.name === name);
                        });   

                        if(foundLines !== null && typeof(foundLines) !== 'undefined' && foundLines.length > 0){
                            _.forEach(foundLines, function(foundLine){
                                foundLine.style.stroke = "#ccc";
                                foundLine.style.strokeWidth = ".5epx";
                            });
                        }
                        var foundTexts = _.filter( svg.selectAll(".edgelabel")[0], function(o, d){
                            return (o.__data__.source.name === name || o.__data__.target.name === name);
                        });   

                        if(foundTexts !== null && typeof(foundTexts) !== 'undefined' && foundTexts.length > 0){
                            _.forEach(foundTexts, function(foundText){
                                foundText.style.font = "10px sans-serif";
                                foundText.style.fill = "#ccc";
                            });
                        }
                    }
                }
            );        
            svg.select(".selection").remove();

        });
    
}
function initIcons(){
    var json = getData();
    var icons = json.icons;
    if(!localStorage.getItem("icons")){//only reset if localstorage is empty
        localStorage.setItem("icons", JSON.stringify(icons));
    }
}
function click() {
    d3.select(this).attr("selected", "true");
    d3.select(this).select("text").transition()
        .duration(250)
        .style("fill", "red")
        .style("stroke", "red")
        .style("stroke-width", ".35px")
        .style("font", "12px sans-serif");
    svg.select(".selection").remove();

}
function updateIcon(key, image){

    var iconsJSON = localStorage.getItem("icons");
    var icons = JSON.parse(iconsJSON);
    var classificationId = key;
    var index = _.findIndex(icons, function(icon){
        return icon.classificationId === key;
    });
    icons[index].iconName = image;
 
    localStorage.setItem("icons", JSON.stringify(icons));


}
function applyIcons(){
    var node = svg.selectAll(".node");
    svg.selectAll("g.node image").remove();
    node.each(function(d){
        var icon =  getIcon(this.__data__.CCLASSIFICATIONID);
        d3.select(this).append("image")
            .attr("xlink:href", icon)
            .attr("x", -8)
            .attr("y", -8)
            .attr("width", 16)
            .attr("height", 16);
    });
    $('#theModal').modal('hide')

}
function getIcon(classificationId){
    var foundData;
    try{
        var iconsJSON = localStorage.getItem("icons");
        var icons = JSON.parse(iconsJSON);
        foundData = _.find(icons, function(icon){
            return icon.classificationId===classificationId
        });
    }
    catch(e){
        console.log("An error occured", e);
    }
    return foundData.iconName;
}
function selectNodes(selectedNodes){
  d3.selectAll("g.node")  //here"s how you get all the nodes
    .each(function(d) {
      // your update code here as it was in your example
        var found = _.find(selectedNodes, 
            function(o){
                return o.textContent === d.name
            });
        if(found){
            d3.select(this).attr("selected", "true");
            d3.select(this).select("text").transition()
                .duration(250)
                .style("fill", "red")
                .style("stroke", "red")
                .style("stroke-width", ".35px")
                .style("font", "12px sans-serif");
        } else{
            d3.select(this).attr("selected", "false");
            d3.select(this).select("text").transition()
                .duration(250)
                .attr("selected", "true")
                .style("fill", "#333")
                .style("stroke", "#333")
                .style("stroke-width", ".35px")
                .style("font", "10px sans-serif");
        }
    }
  );
}
function setSelectedStyle(selectedNodes, fontSetting, fontColor){
    var that = this;
    d3.selectAll("g.node")  //here"s how you get all the nodes
        .each(function(d) {
        var found = _.find(selectedNodes, 
            function(o){
                return o.textContent === d.name
            }
        );
        if(found){
            d3.select(this).attr("selected", "true");
            d3.select(this).select("text").transition()
                .duration(250)
                .attr("selected", "true")
                .style("fill", fontColor)
                .style("stroke", fontColor)
                .style("stroke-width", ".35px")
                .style("font", fontSetting);
        } else {
            d3.select(this).select("text").transition()
                .duration(250)
                .style("fill", "#333")
                .style("stroke", "#333")
                .style("stroke-width", ".35px")
                .style("font", "10px sans-serif");           
            }
    }); 
  
    var allLines = svg.selectAll("line")[0];
    if(allLines !== null && typeof(allLines) !== 'undefined' && allLines.length > 0){
        _.forEach(allLines, function(line){
            line.style.stroke = "#333";
            line.style.strokeWidth = '.35px';
        });
    }
    var allTexts = svg.selectAll(".edgelabel")[0];
    if(allTexts !== null && typeof(allTexts) !== 'undefined' && allTexts.length > 0){
        _.forEach(allTexts, function(text){
            text.style.font = "10px sans-serif";
            text.style.fill = "#333";
        });
    }
    _.forEach(selectedNodes, function(n){
        var foundLines = _.filter( svg.selectAll("line")[0], function(o){
            return (o.__data__.source.name === n.textContent || o.__data__.target.name === n.textContent);
        });   

        if(foundLines !== null && typeof(foundLines) !== 'undefined' && foundLines.length > 0){
            _.forEach(foundLines, function(foundLine){
                foundLine.style.stroke = fontColor;
                foundLine.style.strokeWidth = '1.5px';
            });
        }
        var foundTexts = _.filter( svg.selectAll(".edgelabel")[0], function(o){
            return (o.__data__.source.name === n.textContent || o.__data__.target.name === n.textContent);
        });   

        if(foundTexts !== null && typeof(foundTexts) !== 'undefined' && foundTexts.length > 0){
            _.forEach(foundTexts, function(foundText){
                foundText.style.font = fontSetting;
                foundText.style.fill = fontColor;
            });
        } 
  });  
}
function getData() {
    return {
        nodes: [{
            name: "Myriel",
            group: 1,
            CCLASSIFICATIONID:'A'
        }, {
            name: "Napoleon",
            group: 1,
            CCLASSIFICATIONID:'A'
        },  {
            name: "Mlle.Baptistine",
            group: 1,
            CCLASSIFICATIONID:'A'
        }, {
            name: "Mme.Magloire",
            group: 1,
            CCLASSIFICATIONID:'B'
        }, {
            name: "CountessdeLo",
            group: 1,
            CCLASSIFICATIONID:'B'
        },{
            name: "Geborand",
            group: 1,
            CCLASSIFICATIONID:'B'
        }, {
            name: "Champtercier",
            group: 1,
            CCLASSIFICATIONID:'C'
        }, {
            name: "Cravatte",
            group: 1,
            CCLASSIFICATIONID:'C'
        }, {
            name: "Count",
            group: 1,
            CCLASSIFICATIONID:'D'
        }, {
            name: "OldMan",
            group: 1,
            CCLASSIFICATIONID:'D'
        }, {
            name: "Labarre",
            group: 2,
            CCLASSIFICATIONID:'D'
        }, {
            name: "Valjean",
            group: 2,
            CCLASSIFICATIONID:'D'
        }, {
            name: "Marguerite",
            group: 3,
            CCLASSIFICATIONID:'D'
        }, {
            name: "Mme.deR",
            group: 2,
            CCLASSIFICATIONID:'D'
        }, {
            name: "Isabeau",
            group: 2,
            CCLASSIFICATIONID:'D'
        }, {
            name: "Gervais",
            group: 2,
            CCLASSIFICATIONID:'D'
       }, {
            name: "Tholomyes",
            group: 3,
            CCLASSIFICATIONID:'D'
        }, {
            name: "Listolier",
            group: 3,
            CCLASSIFICATIONID:'D'
        }, {
            name: "Fameuil",
            group: 3,
            CCLASSIFICATIONID:'D'
        }, {
            name: "Blacheville",
            group: 3,
            CCLASSIFICATIONID:'D'
        }, {
            name: "Favourite",
            group: 3,
            CCLASSIFICATIONID:'D'
    }/*, {
            name: "Dahlia",
            group: 3,
            CCLASSIFICATIONID:'D'
        }/*, {
            name: "Zephine",
            group: 3
        }, {
            name: "Fantine",
            group: 3
        }, {
            name: "Mme.Thenardier",
            group: 4
        }, {
            name: "Thenardier",
            group: 4
        }, {
            name: "Cosette",
            group: 5
        }, {
            name: "Javert",
            group: 4
        }, {
            name: "Fauchelevent",
            group: 0
        }, {
            name: "Bamatabois",
            group: 2
        }, {
            name: "Perpetue",
            group: 3
        }, {
            name: "Simplice",
            group: 2
        }, {
            name: "Scaufflaire",
            group: 2
        }, {
            name: "Woman1",
            group: 2
        }, {
            name: "Judge",
            group: 2
        }, {
            name: "Champmathieu",
            group: 2
        }, {
            name: "Brevet",
            group: 2
        }, {
            name: "Chenildieu",
            group: 2
        }, {
            name: "Cochepaille",
            group: 2
        }, {
            name: "Pontmercy",
            group: 4
        }, {
            name: "Boulatruelle",
            group: 6
        }, {
            name: "Eponine",
            group: 4
        }, {
            name: "Anzelma",
            group: 4
        }, {
            name: "Woman2",
            group: 5
        }, {
            name: "MotherInnocent",
            group: 0
        }, {
            name: "Gribier",
            group: 0
        }, {
            name: "Jondrette",
            group: 7
        }, {
            name: "Mme.Burgon",
            group: 7
        }, {
            name: "Gavroche",
            group: 8
        }, {
            name: "Gillenormand",
            group: 5
        }, {
            name: "Magnon",
            group: 5
        }, {
            name: "Mlle.Gillenormand",
            group: 5
        }, {
            name: "Mme.Pontmercy",
            group: 5
        }, {
            name: "Mlle.Vaubois",
            group: 5
        }, {
            name: "Lt.Gillenormand",
            group: 5
        }, {
            name: "Marius",
            group: 8
        }, {
            name: "BaronessT",
            group: 5
        }, {
            name: "Mabeuf",
            group: 8
        }, {
            name: "Enjolras",
            group: 8
        }, {
            name: "Combeferre",
            group: 8
        }, {
            name: "Prouvaire",
            group: 8
        }, {
            name: "Feuilly",
            group: 8
        }, {
            name: "Courfeyrac",
            group: 8
        }, {
            name: "Bahorel",
            group: 8
        }, {
            name: "Bossuet",
            group: 8
        }, {
            name: "Joly",
            group: 8
        }, {
            name: "Grantaire",
            group: 8
        }, {
            name: "MotherPlutarch",
            group: 9
        }, {
            name: "Gueulemer",
            group: 4
        }, {
            name: "Babet",
            group: 4
        }, {
            name: "Claquesous",
            group: 4
        }, {
            name: "Montparnasse",
            group: 4
        }, {
            name: "Toussaint",
            group: 5
        }, {
            name: "Child1",
            group: 10
        }, {
            name: "Child2",
            group: 10
        }, {
            name: "Brujon",
            group: 4
        }, {
            name: "Mme.Hucheloup",
            group: 8
        }*/
        ],

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
    }/*, {
            source: 21,
            target: 16,
            value: 3
        }, {
            source: 21,
            target: 17,
            value: 3
        }, {
            source: 21,
            target: 18,
            value: 3
        }, {
            source: 21,
            target: 19,
            value: 3
        }, {
            source: 21,
            target: 20,
            value: 5
        }/*, {
            source: 22,
            target: 16,
            value: 3
        }, {
            source: 22,
            target: 17,
            value: 3
        }, {
            source: 22,
            target: 18,
            value: 3
        }, {
            source: 22,
            target: 19,
            value: 3
        }, {
            source: 22,
            target: 20,
            value: 4
        }, {
            source: 22,
            target: 21,
            value: 4
        }, {
            source: 23,
            target: 16,
            value: 3
        }, {
            source: 23,
            target: 17,
            value: 3
        }, {
            source: 23,
            target: 18,
            value: 3
        }, {
            source: 23,
            target: 19,
            value: 3
        }, {
            source: 23,
            target: 20,
            value: 4
        }, {
            source: 23,
            target: 21,
            value: 4
        }, {
            source: 23,
            target: 22,
            value: 4
        }, {
            source: 23,
            target: 12,
            value: 2
        }, {
            source: 23,
            target: 11,
            value: 9
        }, {
            source: 24,
            target: 23,
            value: 2
        }, {
            source: 24,
            target: 11,
            value: 7
        }, {
            source: 25,
            target: 24,
            value: 13
        }, {
            source: 25,
            target: 23,
            value: 1
        }, {
            source: 25,
            target: 11,
            value: 12
        }, {
            source: 26,
            target: 24,
            value: 4
        }, {
            source: 26,
            target: 11,
            value: 31
        }, {
            source: 26,
            target: 16,
            value: 1
        }, {
            source: 26,
            target: 25,
            value: 1
        }, {
            source: 27,
            target: 11,
            value: 17
        }, {
            source: 27,
            target: 23,
            value: 5
        }, {
            source: 27,
            target: 25,
            value: 5
        }, {
            source: 27,
            target: 24,
            value: 1
        }, {
            source: 27,
            target: 26,
            value: 1
        }, {
            source: 28,
            target: 11,
            value: 8
        }, {
            source: 28,
            target: 27,
            value: 1
        }, {
            source: 29,
            target: 23,
            value: 1
        }, {
            source: 29,
            target: 27,
            value: 1
        }, {
            source: 29,
            target: 11,
            value: 2
        }, {
            source: 30,
            target: 23,
            value: 1
        }, {
            source: 31,
            target: 30,
            value: 2
        }, {
            source: 31,
            target: 11,
            value: 3
        }, {
            source: 31,
            target: 23,
            value: 2
        }, {
            source: 31,
            target: 27,
            value: 1
        }, {
            source: 32,
            target: 11,
            value: 1
        }, {
            source: 33,
            target: 11,
            value: 2
        }, {
            source: 33,
            target: 27,
            value: 1
        }, {
            source: 34,
            target: 11,
            value: 3
        }, {
            source: 34,
            target: 29,
            value: 2
        }, {
            source: 35,
            target: 11,
            value: 3
        }, {
            source: 35,
            target: 34,
            value: 3
        }, {
            source: 35,
            target: 29,
            value: 2
        }, {
            source: 36,
            target: 34,
            value: 2
        }, {
            source: 36,
            target: 35,
            value: 2
        }, {
            source: 36,
            target: 11,
            value: 2
        }, {
            source: 36,
            target: 29,
            value: 1
        }, {
            source: 37,
            target: 34,
            value: 2
        }, {
            source: 37,
            target: 35,
            value: 2
        }, {
            source: 37,
            target: 36,
            value: 2
        }, {
            source: 37,
            target: 11,
            value: 2
        }, {
            source: 37,
            target: 29,
            value: 1
        }, {
            source: 38,
            target: 34,
            value: 2
        }, {
            source: 38,
            target: 35,
            value: 2
        }, {
            source: 38,
            target: 36,
            value: 2
        }, {
            source: 38,
            target: 37,
            value: 2
        }, {
            source: 38,
            target: 11,
            value: 2
        }, {
            source: 38,
            target: 29,
            value: 1
        }, {
            source: 39,
            target: 25,
            value: 1
        }, {
            source: 40,
            target: 25,
            value: 1
        }, {
            source: 41,
            target: 24,
            value: 2
        }, {
            source: 41,
            target: 25,
            value: 3
        }, {
            source: 42,
            target: 41,
            value: 2
        }, {
            source: 42,
            target: 25,
            value: 2
        }, {
            source: 42,
            target: 24,
            value: 1
        }, {
            source: 43,
            target: 11,
            value: 3
        }, {
            source: 43,
            target: 26,
            value: 1
        }, {
            source: 43,
            target: 27,
            value: 1
        }, {
            source: 44,
            target: 28,
            value: 3
        }, {
            source: 44,
            target: 11,
            value: 1
        }, {
            source: 45,
            target: 28,
            value: 2
        }, {
            source: 47,
            target: 46,
            value: 1
        }, {
            source: 48,
            target: 47,
            value: 2
        }, {
            source: 48,
            target: 25,
            value: 1
        }, {
            source: 48,
            target: 27,
            value: 1
        }, {
            source: 48,
            target: 11,
            value: 1
        }, {
            source: 49,
            target: 26,
            value: 3
        }, {
            source: 49,
            target: 11,
            value: 2
        }, {
            source: 50,
            target: 49,
            value: 1
        }, {
            source: 50,
            target: 24,
            value: 1
        }, {
            source: 51,
            target: 49,
            value: 9
        }, {
            source: 51,
            target: 26,
            value: 2
        }, {
            source: 51,
            target: 11,
            value: 2
        }, {
            source: 52,
            target: 51,
            value: 1
        }, {
            source: 52,
            target: 39,
            value: 1
        }, {
            source: 53,
            target: 51,
            value: 1
        }, {
            source: 54,
            target: 51,
            value: 2
        }, {
            source: 54,
            target: 49,
            value: 1
        }, {
            source: 54,
            target: 26,
            value: 1
        }, {
            source: 55,
            target: 51,
            value: 6
        }, {
            source: 55,
            target: 49,
            value: 12
        }, {
            source: 55,
            target: 39,
            value: 1
        }, {
            source: 55,
            target: 54,
            value: 1
        }, {
            source: 55,
            target: 26,
            value: 21
        }, {
            source: 55,
            target: 11,
            value: 19
        }, {
            source: 55,
            target: 16,
            value: 1
        }, {
            source: 55,
            target: 25,
            value: 2
        }, {
            source: 55,
            target: 41,
            value: 5
        }, {
            source: 55,
            target: 48,
            value: 4
        }, {
            source: 56,
            target: 49,
            value: 1
        }, {
            source: 56,
            target: 55,
            value: 1
        }, {
            source: 57,
            target: 55,
            value: 1
        }, {
            source: 57,
            target: 41,
            value: 1
        }, {
            source: 57,
            target: 48,
            value: 1
        }, {
            source: 58,
            target: 55,
            value: 7
        }, {
            source: 58,
            target: 48,
            value: 7
        }, {
            source: 58,
            target: 27,
            value: 6
        }, {
            source: 58,
            target: 57,
            value: 1
        }, {
            source: 58,
            target: 11,
            value: 4
        }, {
            source: 59,
            target: 58,
            value: 15
        }, {
            source: 59,
            target: 55,
            value: 5
        }, {
            source: 59,
            target: 48,
            value: 6
        }, {
            source: 59,
            target: 57,
            value: 2
        }, {
            source: 60,
            target: 48,
            value: 1
        }, {
            source: 60,
            target: 58,
            value: 4
        }, {
            source: 60,
            target: 59,
            value: 2
        }, {
            source: 61,
            target: 48,
            value: 2
        }, {
            source: 61,
            target: 58,
            value: 6
        }, {
            source: 61,
            target: 60,
            value: 2
        }, {
            source: 61,
            target: 59,
            value: 5
        }, {
            source: 61,
            target: 57,
            value: 1
        }, {
            source: 61,
            target: 55,
            value: 1
        }, {
            source: 62,
            target: 55,
            value: 9
        }, {
            source: 62,
            target: 58,
            value: 17
        }, {
            source: 62,
            target: 59,
            value: 13
        }, {
            source: 62,
            target: 48,
            value: 7
        }, {
            source: 62,
            target: 57,
            value: 2
        }, {
            source: 62,
            target: 41,
            value: 1
        }, {
            source: 62,
            target: 61,
            value: 6
        }, {
            source: 62,
            target: 60,
            value: 3
        }, {
            source: 63,
            target: 59,
            value: 5
        }, {
            source: 63,
            target: 48,
            value: 5
        }, {
            source: 63,
            target: 62,
            value: 6
        }, {
            source: 63,
            target: 57,
            value: 2
        }, {
            source: 63,
            target: 58,
            value: 4
        }, {
            source: 63,
            target: 61,
            value: 3
        }, {
            source: 63,
            target: 60,
            value: 2
        }, {
            source: 63,
            target: 55,
            value: 1
        }, {
            source: 64,
            target: 55,
            value: 5
        }, {
            source: 64,
            target: 62,
            value: 12
        }, {
            source: 64,
            target: 48,
            value: 5
        }, {
            source: 64,
            target: 63,
            value: 4
        }, {
            source: 64,
            target: 58,
            value: 10
        }, {
            source: 64,
            target: 61,
            value: 6
        }, {
            source: 64,
            target: 60,
            value: 2
        }, {
            source: 64,
            target: 59,
            value: 9
        }, {
            source: 64,
            target: 57,
            value: 1
        }, {
            source: 64,
            target: 11,
            value: 1
        }, {
            source: 65,
            target: 63,
            value: 5
        }, {
            source: 65,
            target: 64,
            value: 7
        }, {
            source: 65,
            target: 48,
            value: 3
        }, {
            source: 65,
            target: 62,
            value: 5
        }, {
            source: 65,
            target: 58,
            value: 5
        }, {
            source: 65,
            target: 61,
            value: 5
        }, {
            source: 65,
            target: 60,
            value: 2
        }, {
            source: 65,
            target: 59,
            value: 5
        }, {
            source: 65,
            target: 57,
            value: 1
        }, {
            source: 65,
            target: 55,
            value: 2
        }, {
            source: 66,
            target: 64,
            value: 3
        }, {
            source: 66,
            target: 58,
            value: 3
        }, {
            source: 66,
            target: 59,
            value: 1
        }, {
            source: 66,
            target: 62,
            value: 2
        }, {
            source: 66,
            target: 65,
            value: 2
        }, {
            source: 66,
            target: 48,
            value: 1
        }, {
            source: 66,
            target: 63,
            value: 1
        }, {
            source: 66,
            target: 61,
            value: 1
        }, {
            source: 66,
            target: 60,
            value: 1
        }, {
            source: 67,
            target: 57,
            value: 3
        }, {
            source: 68,
            target: 25,
            value: 5
        }, {
            source: 68,
            target: 11,
            value: 1
        }, {
            source: 68,
            target: 24,
            value: 1
        }, {
            source: 68,
            target: 27,
            value: 1
        }, {
            source: 68,
            target: 48,
            value: 1
        }, {
            source: 68,
            target: 41,
            value: 1
        }, {
            source: 69,
            target: 25,
            value: 6
        }, {
            source: 69,
            target: 68,
            value: 6
        }, {
            source: 69,
            target: 11,
            value: 1
        }, {
            source: 69,
            target: 24,
            value: 1
        }, {
            source: 69,
            target: 27,
            value: 2
        }, {
            source: 69,
            target: 48,
            value: 1
        }, {
            source: 69,
            target: 41,
            value: 1
        }, {
            source: 70,
            target: 25,
            value: 4
        }, {
            source: 70,
            target: 69,
            value: 4
        }, {
            source: 70,
            target: 68,
            value: 4
        }, {
            source: 70,
            target: 11,
            value: 1
        }, {
            source: 70,
            target: 24,
            value: 1
        }, {
            source: 70,
            target: 27,
            value: 1
        }, {
            source: 70,
            target: 41,
            value: 1
        }, {
            source: 70,
            target: 58,
            value: 1
        }, {
            source: 71,
            target: 27,
            value: 1
        }, {
            source: 71,
            target: 69,
            value: 2
        }, {
            source: 71,
            target: 68,
            value: 2
        }, {
            source: 71,
            target: 70,
            value: 2
        }, {
            source: 71,
            target: 11,
            value: 1
        }, {
            source: 71,
            target: 48,
            value: 1
        }, {
            source: 71,
            target: 41,
            value: 1
        }, {
            source: 71,
            target: 25,
            value: 1
        }, {
            source: 72,
            target: 26,
            value: 2
        }, {
            source: 72,
            target: 27,
            value: 1
        }, {
            source: 72,
            target: 11,
            value: 1
        }, {
            source: 73,
            target: 48,
            value: 2
        }, {
            source: 74,
            target: 48,
            value: 2
        }, {
            source: 74,
            target: 73,
            value: 3
        }, {
            source: 75,
            target: 69,
            value: 3
        }, {
            source: 75,
            target: 68,
            value: 3
        }, {
            source: 75,
            target: 25,
            value: 3
        }, {
            source: 75,
            target: 48,
            value: 1
        }, {
            source: 75,
            target: 41,
            value: 1
        }, {
            source: 75,
            target: 70,
            value: 1
        }, {
            source: 75,
            target: 71,
            value: 1
        }, {
            source: 76,
            target: 64,
            value: 1
        }, {
            source: 76,
            target: 65,
            value: 1
        }, {
            source: 76,
            target: 66,
            value: 1
        }, {
            source: 76,
            target: 63,
            value: 1
        }, {
            source: 76,
            target: 62,
            value: 1
        }, {
            source: 76,
            target: 48,
            value: 1
        }, {
            source: 76,
            target: 58,
            value: 1
        }
        */
        ],
        icons: [
            {classificationId: 'A', iconName: 'img/bee.png'},
            {classificationId: 'B', iconName: 'img/doubleswoosh.png'},
            {classificationId: 'C', iconName: 'img/fire.png'},
            {classificationId: 'D', iconName: 'img/gradhat.png'},
            {classificationId: 'CSERV', iconName: 'img/blackstar.png'},

        ]
    };
};
function showww(key) {
  var dropd = document.getElementById("image-dropdown_" + key);
  dropd.style.height = "120px";
  dropd.style.overflow = "scroll";
}

function hideee(key) {
    var dropd = document.getElementById("image-dropdown_" + key);
    dropd.style.height = "30px";
    dropd.style.overflow = "hidden";
  }
  //dropd.addEventListener('mouseover', showOrHide, false);
  //dropd.addEventListener('click',showOrHide , false);


function myfuunc(imgParent, key, image) {
  hideee(key);
  
  var mainDIVV = document.getElementById("image-dropdown_" + key);
  imgParent.parentNode.removeChild(imgParent);
  mainDIVV.insertBefore(imgParent, mainDIVV.childNodes[0]);
  mainDIVV.style.overflow = "hidden";
  mainDIVV.scrollTop = 0;
  updateIcon(key, image);
  
}


initIcons();
initSvg();