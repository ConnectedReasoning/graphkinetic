var locationsFile = require("./locations");

var neo4j = require('neo4j-driver').v1;
var _ = require('lodash');

var driver = neo4j.driver("bolt://localhost:7687", neo4j.auth.basic("neo4j", "bagel1neo"));
var session = driver.session(); 
var data = locationsFile.data;

var locationsArray =  _.map(data, function(d){
    return d.graph.nodes[0].properties;
});

session.run('match (n)-[r]-()  delete r'
).then(function(result){
    console.log(" successflly deleted old relatinoships");
    session.close();
    driver.close();
},function(error){
    console.log("error on delete relationships", error);
}
);
session.run('match (n) delete n'
).then(function(result){
        console.log(" successfully deleted old nodes");
        session.close();
        driver.close();
    },function(error){
        console.log("error on delete nodes", error);
    }
);
for(var i = 0; i < locationsArray.length; i++){
  location = locationsArray[i];
  session.run( 'CREATE (n:Locations{id:{id}, LOCATION:{LOCATION}, STATUS: {STATUS}, DESCRIPTION:{DESCRIPTION}, LOCATIONSID:{LOCATIONSID}, PARENT:{PARENT}, PLUSPCUSTOMER:{PLUSPCUSTOMER}} )',
      {id:location.id, LOCATION:location.LOCATION, STATUS: location.STATUS, DESCRIPTION:location.DESCRIPTION, LOCATIONSID:location.LOCATIONSID, PARENT:location.PARENT, PLUSPCUSTOMER:location.PLUSPCUSTOMER}
  ).then( function( result ) {
      console.log('write to neo4j successful');
    session.close();
  },
  function(error){
    console.log("error on create nodes", error);
    session.close();
    driver.close();
  } 
  );
}
