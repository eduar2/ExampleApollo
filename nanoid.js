const generate = require('nanoid/generate')
const jsonToSchema = require ('@walmartlabs/json-to-simple-graphql-schema/lib');
let fs = require('fs');

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

fs.readFile('sample.json', (err, data) => {
    if (err) {
        console.log('error: ', err);
    } else {
        let objectJson = JSON.parse(data);
        objectJson.forEach(tennant => {
            tennant._id = generate('1234567890', 5);
            let lastChar = tennant._id[tennant._id.length - 1];
            let totalProperties = 0;
                switch (lastChar) {
                    case "1":
                        totalProperties = 5
                        break;
                    case "2":
                        totalProperties = 6
                        break;
                    case "3":
                        totalProperties = 7
                        break;
                    case "4":
                        totalProperties = 8
                        break;
                    case "5":
                        totalProperties = 9
                        break;
                    case "6":
                        totalProperties = 5
                        break;
                    case "7":
                        totalProperties = 6
                        break;
                    case "8":
                        totalProperties = 7
                        break;
                    case "9":
                        totalProperties = 8
                        break;
                    case "0":
                        totalProperties = 9
                        break;
                    default:
                        break;
                }
            tennant.properties.splice(totalProperties)
            tennant.properties.forEach(property => {
                let prop_id = generate('1234567890', 5);
                property._id = prop_id
                property.tennantId = tennant._id
                let lastChar = prop_id[prop_id.length - 1];
                let totalBuildings = 0;
                switch (lastChar) {
                    case "1":
                        totalBuildings = 5
                        break;
                    case "2":
                        totalBuildings = 6
                        break;
                    case "3":
                        totalBuildings = 7
                        break;
                    case "4":
                        totalBuildings = 8
                        break;
                    case "5":
                        totalBuildings = 9
                        break;
                    case "6":
                        totalBuildings = 5
                        break;
                    case "7":
                        totalBuildings = 6
                        break;
                    case "8":
                        totalBuildings = 7
                        break;
                    case "9":
                        totalBuildings = 8
                        break;
                    case "0":
                        totalBuildings = 9
                        break;
                    default:
                        break;
                }
                property.buildings.splice(totalBuildings)
                property.buildings.forEach(building => {
                    building._id = generate('1234567890', 5);
                    let result = nearlyPoint(property.latitude,property.longitude,DIRECTION.NONE);
                    building.latitude = result.lat
                    building.longitude = result.lng
                    building.propertyId = property._id
                });
            });
        });
        let json = JSON.stringify(objectJson);

        fs.writeFile('sample1.json', json, {}, () => {
            console.log("complete");
        });

    }
});
