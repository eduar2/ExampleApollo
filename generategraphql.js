const generateSchema = require('json-to-graphql')
import {data} from './sample1.json'

const schema = generateSchema(data)
fs.writeFile('schema.js', schema, callback)

