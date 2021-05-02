const { gql } = require('apollo-server');

const typeDefs = gql `
	type Map {
		_id: String
		name: String
		owner: String
		parent: String
		capital: String
        leader: String
        numSub: Int
		landmarks: [String]
		regions: [String]
	}
	extend type Query {
		getAllMaps: [Map]
	}
	extend type Mutation {
		addMap(map: MapInput!): String
		deleteMap(_id:String!): Boolean
	}
	input MapInput {
		_id: String
		name: String
		owner: String
		parent: String
		capital: String
        leader: String
        numSub: Int
		landmarks: [String]
		regions: [String]
	}
`;

module.exports = { typeDefs: typeDefs }