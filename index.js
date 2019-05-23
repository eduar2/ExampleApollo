const {ApolloServer, gql}= require('apollo-server');
const lodash = require('lodash');
var schemaTennants = require('./tennantsList.json')
var schemaProperties = require('./propertiesList.json')
var schemaBuildings = require('./buildingsList.json')

const tennants = [{ items: schemaTennants}]
const properties = [{ items: schemaProperties}]
const buildings = [{ items: schemaBuildings}]

const DIRECTION={
  NORTH:'NORTH',
  SOUTH:'SOUTH',
  EAST:'EAST',
  WEST:'WEST',
  NONE:'NONE'
};

function nearlyPoint(lat, lng, direction) {
  let rand = Math.random();
  if(direction===DIRECTION.NONE){
      if(rand<=0.25){
          direction=DIRECTION.NORTH;
      }else if(rand<=0.5){
          direction=DIRECTION.SOUTH;
      }else if(rand<=0.75){
          direction=DIRECTION.EAST;
      }else{
          direction=DIRECTION.WEST;
      }
  }
  let factor = Math.ceil(rand*10)/100000;
  let result = {
      lat: lat,
      lng: lng,
      direction: direction
  };
  switch (direction) {
      case DIRECTION.NORTH:
          result.lng = Math.min(result.lng + factor,180);
          break;
      case DIRECTION.SOUTH:
          result.lng = Math.max(result.lng - factor,-180);
          break;
      case DIRECTION.EAST:
          result.lat = Math.min(result.lat + factor,90);
          break;
      case DIRECTION.WEST:
          result.lat = Math.max(result.lat - factor,-90);
          break;
  }
  return result;
}



function findTennant(id){
  let result= []
  for (let index = 0; index < schemaTennants.length; index++) {
    const element = schemaTennants[index];
    if (element._id == id){
      result.push(element)
      let tennantResult = [{ items: result}]
      return tennantResult
    }
  }

}


function findProperty(id){
  let result= []
  let tennant=[]
  for (let index = 0; index < schemaTennants.length; index++) {
    const element = schemaTennants[index];
    if (element._id == id){
      tennant.push(element)
      break;
    }
  }
  for (let index = 0; index < schemaProperties.length; index++) {
    const element = schemaProperties[index];
    if (element.tennantId == id){
      element.tennant = tennant[0]
      result.push(element)
    }
  }
  let propertyResult = [{ items: result}]
  return propertyResult
}


function findBuilding(id){
  let result= []
  let property=[]
  for (let index = 0; index < schemaProperties.length; index++) {
    const element = schemaProperties[index];
    if (element._id == id){
      property.push(element)
      break;
    }
  }
  for (let i = 0; i < schemaBuildings.length; i++) {
    const element = schemaBuildings[i];
    if (element.propertyId == id){
      element.property = property[0]
      result.push(element)
    }
  }
  let buildingResult = [{ items: result}]
  return buildingResult
}


const typeDefs = gql`
type Building {
  _id: String
  address: String
  phone: String
  name: String
  propertyId: String
  state: String
  latitude: String
  longitude: String
  property: Property
}

type BuildingsConnection {
	items: [Building]
	nextToken: String
}

type PropertiesConnection {
	items: [Property]
	nextToken: String
}

type Property {
  _id: String
  address: String
  phone: String
  name: String
  tennantId: String
  state: String
  latitude: String
  longitude: String
  tennant: Tennant
}

type Tennant {
  _id: String
  isActive: Boolean
  logo: String
  picture: String
  name: String
  phone: String
  address: String
}

type TennantsConnection {
	items: [Tennant]
	nextToken: String
}

input TennantSearch {
  id: String  
}

input PropertySearch {
  tennantId: String  
}

input BuildingSearch {
  tennantId: String
}

type Query {
  tennants: [TennantsConnection]
  getATennant(id: String): [TennantsConnection]
  properties(tennantId: String): [PropertiesConnection]
  buildings(propertyId: String): [BuildingsConnection]
  allBuildings: [BuildingsConnection]
}
`;


// A map of functions which return data for the schema.

const resolvers = {
    // Query: {
    //   listTennants: () => tennants
    // }
    Query: {
      tennants: () => tennants,
      getATennant:(_,{id})  => findTennant(id),
      properties:(_,{tennantId})  => findProperty(tennantId),
      buildings:(_,{propertyId})  => findBuilding(propertyId),
      allBuildings:() => buildings
    }
};


const server = new ApolloServer({
    typeDefs,
    resolvers,
  });
  
  server.listen().then(({ url }) => {
    console.log(`🚀 Server ready at ${url}`);
  });