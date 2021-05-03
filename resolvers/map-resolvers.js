const ObjectId = require('mongoose').Types.ObjectId;
const Map = require('../models/map-model');

// The underscore param, "_", is a wildcard that can represent any value;
// here it is a stand-in for the parent parameter, which can be read about in
// the Apollo Server documentation regarding resolvers

module.exports = {
	Query: {
		getAllMaps: async (_, __, { req }) => {
			const _id = new ObjectId(req.userId);
			if(!_id) { return([])};
			const maps = await Map.find({owner: _id});
			if(maps) return (maps);

		},
	},
	Mutation: {
		addMap: async (_, args) => {
			const { map } = args;
			const objectId = new ObjectId();
			const { name, owner } = map;
			const newMap = new Map({
				_id: objectId,
				name: name,
				owner: owner,
				regions: [],
				parent: "",
				capital: "",
				leader: "",
				numSub: 0,
				landmarks: []
			});
			const updated = newMap.save();
			if(updated) return objectId;
			else return ('Could not add map');
		},
		deleteMap: async (_, args) => {
			const { _id } = args;
			const objectId = new ObjectId(_id);
			const deleted = await Map.deleteOne({_id: objectId});
			if(deleted) return true;
			else return false;
		},
		renameMap: async (_, args) => {
			const { _id , name} = args;
			const objectId = new ObjectId(_id);
			const found = Map.findOne({_id:objectId})
			found.name == name;
			const updated = await Map.updateOne({_id:objectId},{name:name})
		}

	}
}