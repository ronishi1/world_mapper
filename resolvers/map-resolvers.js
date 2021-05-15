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
			const maps = await Map.find({parent: _id});
			if(maps) return (maps);
		},
		getRegion: async (_, args) => {
			const { _id } = args;
			if(!_id) { return([])};
			const map = await Map.findOne({_id:_id});
			if(map) return (map);
		}
	},
	Mutation: {
		addMap: async (_, args) => {
			const { map } = args;
			const objectId = new ObjectId();
			const { name, parent } = map;
			const newMap = new Map({
				_id: objectId,
				name: name,
				regions: [],
				parent: parent,
				parentName:"",
				capital: "",
				leader: "",
				landmarks: []
			});
			const updated = newMap.save();
			if(updated) return objectId + "|||" + name;
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
			const updated = await Map.updateOne({_id:objectId},{name:name})
		},
		addSubregion: async (_, args) => {
			const { map } = args;
			const objectId = new ObjectId();
			const { parent,parentName } = map;
			const newMap = new Map({
				_id: objectId,
				name: "Unnamed",
				regions: [],
				parent: parent,
				parentName:parentName,
				capital: "Unnamed",
				leader: "Unnamed",
				landmarks: []
			});
			const updated = newMap.save();
			const parentObjectId = new ObjectId(parent);
			const found = await Map.findOne({_id:parentObjectId})
			let regions = found.regions
			found.regions.push(objectId)
			await Map.updateOne({_id:parentObjectId},{regions:regions})
			if(updated) return objectId;
			else return ('Could not add map');
		},
		editRegion: async (_, args) => {
			const { _id, field, value} = args;
			const objectId = new ObjectId(_id);
			let update = {};
			update[field] = value;
			const updated = await Map.updateOne({_id:objectId},update);
			
		}

	}
}