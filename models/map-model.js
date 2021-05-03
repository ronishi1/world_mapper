const { model, Schema, ObjectId } = require('mongoose');

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
        landmarks: [String],
        regions: [String],
    },
);

const Map = model('Map', mapSchema);
module.exports = Map;