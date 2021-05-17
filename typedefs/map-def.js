const { gql } = require('apollo-server');

const typeDefs = gql `
	type Map {
		_id: String
		name: String
		parent: String
		parentName: String
		capital: String
        leader: String
		landmarks: [Landmark]
		regions: [String]
	}
	type Landmark {
		_id: String
		name: String
		locationName: String
		locationID: String
	}
	extend type Query {
		getAllMaps: [Map]
		getRegion(_id:String!): Map
	}
	extend type Mutation {
		addMap(map: MapInput!): String
		deleteMap(_id:String!): Boolean
		renameMap(_id:String!, name:String!): String
		addSubregion(_id: String!, map: MapInput!): String
		editRegion(_id:String!, field: String!, value: String!): String
		deleteRegion(regionID: String!, parentRegion: MapInput!): String
		unDeleteRegion(region: MapInput!, parentRegion: MapInput!): String
		sortRegions(_id: String!, field: String!, order: Int!, prev: [String!]): [String]
		addLandmark(_id: String!, name: String!, locationName: String!, locationID: String!): String
		deleteLandmark(_id:String!, locationID: String!): String
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
	input LandmarkInput {
		_id: String
		name: String
		locationName: String
		locationID: String
	}
`;

module.exports = { typeDefs: typeDefs }