const generate = require('nanoid/generate')
const jsonToSchema = require ('@walmartlabs/json-to-simple-graphql-schema/lib');
let fs = require('fs');
var arregloBuildings = [];
var arregloProperties = [];
var arregloTennants = [];
fs.readFile('sample1.json', (err, data) => {
    if (err) {
        console.log('error: ', err);
    } else {
        let objectJson = JSON.parse(data);
        objectJson.forEach(tennant => {
            tennant.properties.forEach(property => {
                property.buildings.forEach(building => {
                    arregloBuildings.push(building);
                });
                delete property.buildings
                arregloProperties.push(property);
            });
            delete tennant.properties                
            arregloTennants.push(tennant);
        });
        let jsonTennant = JSON.stringify(arregloTennants);
        let jsonProperty = JSON.stringify(arregloProperties);
        let jsonBuilding = JSON.stringify(arregloBuildings);

        fs.writeFile('tennantsList.json', jsonTennant, {}, () => {
            console.log("write tennants");
            fs.writeFile('propertiesList.json',jsonProperty,{},()=>{
                console.log("write Properties");
                fs.writeFile('buildingsList.json',jsonBuilding,{},() =>{
                    console.log('write buildings');
                })
            })
        });

    }
});