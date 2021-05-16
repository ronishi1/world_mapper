const { gql } = require('apollo-server');

const typeDefs = gql `
	type Map {
		_id: String
		name: String
		parent: String
		parentName: String
		capital: String
        leader: String
		landmarks: [String]
		regions: [String]
	}
	extend type Query {
		getAllMaps: [Map]
		getRegion(_id:String!): Map
	}
	extend type Mutation {
		addMap(map: MapInput!): String
		deleteMap(_id:String!): Boolean
		renameMap(_id:String!, name:String!): String
		addSubregion(map: MapInput!): String
		editRegion(_id:String!, field: String!, value: String!): String
		deleteRegion(region: MapInput!, parentRegion: MapInput!): String
		unDeleteRegion(region: MapInput!, parentRegion: MapInput!): String
		sortRegions(_id: String!, field: String!, order: Int!, prev: [String!]): [String]

	}
	input MapInput {
		_id: String
		name: String
		parent: String
		parentName: String
		capital: String
        leader: String
		landmarks: [String]
		regions: [String]
	}
`;

module.exports = { typeDefs: typeDefs }