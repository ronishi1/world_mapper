const ObjectId = require('mongoose').Types.ObjectId;
const Map = require('../models/map-model');
const Landmark = require('../models/landmark-model')
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
			const { _id, map } = args;
			const { parent,parentName } = map;
			let objectId = _id
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
			if(updated) return objectId;
			else return ('Could not update')
		},
		deleteRegion: async(_, args) => {
			const { regionID, parentRegion } = args;
			const parentId = new ObjectId(parentRegion._id);
			let updateRegions = parentRegion.regions.filter(r => r !== regionID);
			const updated = await Map.updateOne({_id:parentId},{regions:updateRegions});
			let objectId = new ObjectId(regionID);
			await Map.deleteOne({_id:objectId})
		},
		unDeleteRegion: async(_, args) => {
			const { region, parentRegion } = args;
			const parentId = new ObjectId(parentRegion._id);
			const updated = await Map.updateOne({_id:parentId},{regions:parentRegion.regions});
			const remake = new Map(region);
			remake.save();
		},
		sortRegions: async(_, args) => {
			const { _id, field, order, prev} = args;
			const objectId = new ObjectId(_id);
			const found = await Map.findOne({_id: objectId});
			let regionIDs = found.regions;
			let result = await Map.find({_id:{$in:regionIDs}});
			let regions = [];
			regionIDs.forEach((id) => {
				for(let i = 0; i < result.length;i++){
					if(result[i]._id == id){
						regions.push(result[i])
					}
				}
			});
			let temp = [...regions]
			let tempFlag = false;
			let fin;
			if (order == 0) {
				regions.sort((a, b) => (a[field] > b[field]) ? 1 : -1);
				for(var i = 0; i<regions.length; i++){
					if(regions[i][field] != temp[i][field]){
						tempFlag = true;
					}
				}
				if(!tempFlag) {
					regions.sort((a, b) => (a[field] < b[field]) ? 1 : -1);
				}
				fin = regions.map(region => region._id);
			}
			else if (order==1){
				fin = prev;
			}
			const updated = await Map.updateOne({_id: objectId}, { regions:fin })
			return regions.map(result => result.name)
		},
		addLandmark: async(_, args) => {
			const {_id , name, locationName, locationID } = args;
			let newLandmark = new Landmark({
				_id: _id,
				name: name,
				locationName:locationName,
				locationID: locationID
			});
			let objectId = new ObjectId(locationID);
			let found = await Map.findOne({_id: objectId});
			found.landmarks.push(newLandmark);
			let updated = await Map.updateOne({_id:objectId},{landmarks:found.landmarks})
			let parentId;
			while(found.parentName != "") {
				parentId = new ObjectId(found.parent);
				found = await Map.findOne({_id:parentId});
				found.landmarks.push(newLandmark);
				updated = await Map.updateOne({_id:parentId},{landmarks:found.landmarks})
			}
		},
		deleteLandmark: async(_, args) => {
			const {_id, locationID} = args;
			let objectId = new ObjectId(locationID);
			let found = await Map.findOne({_id: objectId});
			let result = [];
			for(let i = 0; i < found.landmarks.length;i++){
				if(found.landmarks[i]._id != _id){
					result.push(found.landmarks[i]);
				}
			}
			let updated = await Map.updateOne({_id:objectId},{landmarks:result})
			let parentId;
			while(found.parentName != "") {
				result = [];
				parentId = new ObjectId(found.parent);
				found = await Map.findOne({_id:parentId});
				for(let i = 0; i < found.landmarks.length;i++){
					if(found.landmarks[i]._id != _id){
						result.push(found.landmarks[i]);
					}
				}		
				updated = await Map.updateOne({_id:parentId},{landmarks:result})
			}
			return "done"
		}

	}
}