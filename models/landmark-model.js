const { model, Schema, ObjectId } = require('mongoose');

const landmarkSchema = new Schema(
	{
		_id: {
			type: String,
		},
		name: {
			type: String,
		},
		locationName: {
			type: String,
		},
        locationID: {
			type: String,
		},
	}
);

const Landmark = model('Landmark', landmarkSchema);
module.exports = Landmark;