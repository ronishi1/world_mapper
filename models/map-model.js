const { model, Schema, ObjectId } = require('mongoose');
const Landmark = require('./landmark-model').schema;

const mapSchema = new Schema(
    {
        _id: {
            type: ObjectId,
            required: true
        },
        name: {
            type: String,
        },
        parent: {
            type: String,
        },
        parentName: {
            type:String,
        },
        capital: {
            type: String,
        },
        leader: {
            type: String,
        },
        landmarks: [Landmark],
        regions: [String],
    },
);

const Map = model('Map', mapSchema);
module.exports = Map;