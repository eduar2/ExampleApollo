const {ApolloServer, gql}= require('apollo-server');
const tennants = [{ items: [{markerId:"1"},{markerId:"2"}], nextToken:"dkfasj" }]
const typeDefs = gql`

type Query {
	listTennants(limit: Int, nextToken: String): [TennantsConnection]
}

type Tennant {
	markerId: String!

}

type TennantsConnection {
	items: [Tennant]
	nextToken: String
}

`;

// A map of functions which return data for the schema.

const resolvers = {
    Query: {
      listTennants: () =>tennants
    }
};

// const resolvers = {
//   Query: {
//     listTennants: (limit) =>{items: [{
//         markerId:'1'
//         },
//         {
//             markerId:'2'
//         }
//         ]
//       },
//     },
// };


const server = new ApolloServer({
    typeDefs,
    resolvers,
  });
  
  server.listen().then(({ url }) => {
    console.log(`🚀 Server ready at ${url}`);
  });