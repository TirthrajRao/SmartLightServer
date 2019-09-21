const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const zoneSchema = new Schema({
    zone_name: { type: String },
    unique_name: { type: String, unique: true, required: true }
});

module.exports = mongoose.model('zones', zoneSchema);