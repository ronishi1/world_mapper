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
        owner: {
            type: String,
        },
        parent: {
            type: String,
        },
        capital: {
            type: String,
        },
        leader: {
            type: String,
        },
        numSub: {
            type: Number,
        },
        landmarks: [String],
        regions: [String],
    },
);

const Map = model('Map', mapSchema);
module.exports = Map;