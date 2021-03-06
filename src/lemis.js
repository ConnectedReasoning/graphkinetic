export class lemis {

    constructor(){
        this.heading = "Funstuff";
        this.todos = [];
        this.todoDescription='';
        this.width = 700;
        this.height = 700;
        console.log('in constructor. d3 is ', d3);
        console.log('this.graphdiagram', this.graphdiagram);
        this.svg = d3.select(this.graphDiagram).selectAll("div").append("svg")
        .attr("width", this.width)
        .attr("height", this.height);
        console.log('in constructor. this.svg is ', this.svg);
    }
    attached(){
        console.log('attached');
        this.initIcons();
        this.initSvg();
    }


    initSvg(){

        this.svg.append("rect")
            .attr("width", "100%")
            .attr("height", "100%")
            .attr("fill", "white");

        console.log('in initSvg this.svg is ', this.svg);
        var json = this.getData();
        console.log('json ', json);
        var force = d3.layout.force()
            .gravity(.053)
            .distance(350)
            .charge(-300)
            .size([this.width, this.height])
            .nodes(json.nodes)
            .links(json.links)
            .start();


        var edges = this.svg.selectAll("line")
        .data(json.links)
        .enter().append("line")
        .attr("class", "link");

        var nodes = this.svg.selectAll(".node")
            .data(json.nodes)
            .enter().append("g")
            .attr("class", "node")
            .attr("selected", "false")
            .on("click", this.click)
            .call(force.drag);
        nodes.selected = false;

        nodes.each(function(d){
            var icon = getIcon(this.__data__.CCLASSIFICATIONID);
            d3.select(this).append("image")
                .attr("xlink:href", icon)
                .attr("x", -32)
                .attr("y", -20)
                .attr("width", 42)
                .attr("height", 42);
        });

        nodes.append("text")
            .attr("dx", 12)
            .attr("dy", ".35em")
            .style("cursor", "pointer")
            .style("font-size", "18px")
            .text(function (d) {
                return d.name
            });
        
        var edgepaths = this.svg.selectAll(".edgepath")
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

        var edgelabels = this.svg.selectAll(".edgelabel")
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
            .text(function(d,i){return ''});


            force.on("tick", function () {
            edges.attr({"x1": function (d) {return d.source.x;},
                        "y1": function (d) {return d.source.y;},
                        "x2": function (d) {return d.target.x;},
                        "y2": function (d) {return d.target.y;}
            });

            nodes.attr("transform", function (d) {
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
            
        this.svg
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
                                .style("stroke-width", ".5px");
                        } else {
                            d3.select(this).attr("selected", "false");
                            d3.select(this).select("text").transition()
                                .duration(250)
                                .style("fill", "#333")
                                .style("stroke", "#333")
                                .style("stroke-width", ".5px");
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
    
        console.log('at the end of init svg. svg is ', this.svg);
    }

    initIcons(){
        var json = this.getData();
        var icons = json.icons;
        localStorage.setItem("icons", JSON.stringify(icons));
    }

    click() {
        
        d3.select(this).attr("selected", "true");
        d3.select(this).select("text").transition()
            .duration(250)
            .style("fill", "red")
            .style("stroke", "red")
            .style("stroke-width", ".35px")
            .style("font-size", "22px")
            .style("font-family", "sans-serif")
            .style("font-weight", "700");
        svg.select(".selection").remove();

    }

    updateIcon(key, image){

        var iconsJSON = localStorage.getItem("icons");
        var icons = JSON.parse(iconsJSON);
        var classificationId = key;
        var index = _.findIndex(icons, function(icon){
            return icon.classificationId === key;
        });
        icons[index].iconName = image;
    
        localStorage.setItem("icons", JSON.stringify(icons));


    }
    applyIcons(){
        var nodes = svg.selectAll(".node");
        svg.selectAll("g.node image").remove();
        nodes.each(function(d){
            var icon =  getIcon(this.__data__.CCLASSIFICATIONID);
            d3.select(this).append("image")
                .attr("xlink:href", icon)
                .attr("x", -32)
                .attr("y", -20)
                .attr("width", 42)
                .attr("height", 42);
        });
        $('#theModal').modal('hide')

    }

    getIcon(classificationId){
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

    selectNodes(selectedNodes){
        d3.selectAll("g.node")  //here"s how you get all the nodes
            .each(function(d) {
            // your update code here as it was in your example
                var found = _.find(selectedNodes, 
                    function(o){
                        return o.textContent === d.name
                    }
                );
                
                if(found){
                    d3.select(this).attr("selected", "true");
                    d3.select(this).select("text").transition()
                        .duration(250)
                        .style("fill", "red")
                        .style("stroke", "red")
                        .style("stroke-width", ".35px")
                        .style("font-size", "18px")
                        .style("font-family", "sans-serif");
                } else{
                    d3.select(this).attr("selected", "false");
                    d3.select(this).select("text").transition()
                        .duration(250)
                        .attr("selected", "true")
                        .style("fill", "#333")
                        .style("stroke", "#333")
                        .style("stroke-width", ".35px")
                        .style("font-size", "18px")
                        .style("font-family", "sans-serif");
                }
            }
        );
    }

    setSelectedStyle(selectedNodes, bold, size, name, fontColor){
        var that = this;
        var fontWeight = (bold.trim() === "bold") ? "800" : "400";
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
                    .style("font-weight", fontWeight)
                    .style("font-size", size + "px")
                    .style("font-family", name);
            } else {
                d3.select(this).select("text").transition()
                    .duration(250)
                    .style("fill", "#333")
                    .style("stroke", "#333")
                    .style("stroke-width", ".35px");
            
                }
        }); 
        $('#theModal').modal('hide')
    
    }

    getData() {
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
            }
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
            }
            ],
            icons: [
                {classificationId: 'A', iconName: '/img/bee.png'},
                {classificationId: 'B', iconName: '/img/doubleswoosh.png'},
                {classificationId: 'C', iconName: '/img/fire.png'},
                {classificationId: 'D', iconName: '/img/gradhat.png'}
            ]
        };
    };

    showIcon(key) {
    var dropd = document.getElementById("image-dropdown_" + key);
    dropd.style.height = "120px";
    dropd.style.overflow = "scroll";
    }

    hideee(key) {
        var dropd = document.getElementById("image-dropdown_" + key);
        dropd.style.height = "30px";
        dropd.style.overflow = "hidden";
    }

    selectIcon(imgParent, key, image) {
    hideee(key);
    
    var mainDIVV = document.getElementById("image-dropdown_" + key);
    imgParent.parentNode.removeChild(imgParent);
    mainDIVV.insertBefore(imgParent, mainDIVV.childNodes[0]);
    mainDIVV.style.overflow = "hidden";
    mainDIVV.scrollTop = 0;
    updateIcon(key, image);
    
    }
}