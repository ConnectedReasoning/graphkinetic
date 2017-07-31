var locationsFile = require("./locations");

var neo4j = require('neo4j-driver').v1;
var _ = require('lodash');

var driver = neo4j.driver("bolt://localhost:7687", neo4j.auth.basic("neo4j", "bagel1neo"));
var session = driver.session(); 
var data = locationsFile.data;

var locationsArray =  _.map(data, function(d){
    return d.graph.nodes[0].properties;
});

relations = [];
for(var i = 0; i < locationsArray.length; i++){
    currentCollection = locationsArray[i];
    var children = _.filter(locationsArray, function(location){
        return location.PARENT == currentCollection.LOCATION;
    });
    var relation = {};
    relation.parent = currentCollection.LOCATION;
    relation.children = children;
    relations.push(relation);
}
for(var i = 0; i < relations.length; i++){
    var relation = relations[i];
    for(var j = 0; j < relation.children.length; j++){
        var child_name = relation.children[j].LOCATION;
        console.log("MATCH (m:Locations{LOCATION:'" + relation.parent + "'}), (n:Locations {LOCATION:'" + child_name + "'}) CREATE (m)-[:RELATED]->(n) return r"); 

        session.run("MATCH (m:Locations{LOCATION:{parent}}), (n:Locations {LOCATION:{child}}) CREATE (m)-[r:RELATED]->(n) return r",
        {parent:relation.parent, child:child_name}).then( function( result ) {
            console.log('write relation succesful');
            session.close();
            driver.close();
        },
        function(error){
            console.log("an write relation error occured" );
            session.close();
            driver.close();
        } 
        );        
    }

}