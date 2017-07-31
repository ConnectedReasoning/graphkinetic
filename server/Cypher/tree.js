
var neo4j = require('neo4j-driver').v1;
var _ = require('lodash');

var driver = neo4j.driver("bolt://localhost:7687", neo4j.auth.basic("neo4j", "bagel1neo"));
var session = driver.session(); 


session.run('Match (p:locations{locationsId:40})-[*]->(s) return s').then(
    function(result){
        var locationsCollection = [];
        var records = result.records;
        for(var i = 0; i < records.length; i++){
            record = records[i];
            fields = record._fields;
            for(var j = 0; j < fields.length; j++){
                field = fields[j];
                location = field.properties;
                locationsCollection.push(location);
            }
        }

        for(var i = 0; i < locationsCollection.length; i++){
            currentCollection = locationsCollection[i];
            var children = _.filter(locationsCollection, function(location){
               return location.parent == currentCollection.name;
            });
            currentCollection.children = children;
        }
            console.log("WithChildren", locationsCollection);
        session.close();
        driver.close();
  },
  function(error){
    console.log("error on create nodes", error);
    session.close();
    driver.close();
  } 
  );
