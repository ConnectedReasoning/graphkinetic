var lesmiserables = require("./lesmiserables");
var people = lesmiserables.nodes;

var neo4j = require('neo4j-driver').v1;

var driver = neo4j.driver("bolt://localhost:7687", neo4j.auth.basic("neo4j", "bagel1neo"));
var session = driver.session();

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


for(var i = 0; i < people.length; i++){
  person = people[i];
  session.run( 'CREATE (n:Person{positionId:{posId}, name:{name}, group: {group}, CLASSIFICATIONID:{classificationId}} )',
      {name: person.name, posId: person.positionId, group:person.group, classificationId: person.CLASSIFICATIONID}
  ).then( function( result ) {
    session.close();
    driver.close();
  },
  function(error){
    console.log("error on create nodes", error);
    session.close();
    driver.close();
  } 
  );
}

var links = lesmiserables.links;
for(var i = 0; i < links.length; i++){
  link = links[i];
  session.run('MATCH (m),(n) WHERE m.positionId =  {mpos}   AND n.positionId = {npos} CREATE (m)-[r:RELATED { value:  {val} }]->(n)',
  {mpos:link.source, npos: link.target, val: link.value}).then( function( result ) {
    session.close();
    driver.close();
  },
  function(error){
    console.log(error);
  } 
  );
  
}  
