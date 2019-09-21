const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const deviceSchema = new Schema({
    type: { type: String },
    device_id: { type: String },
    state: { type: String },
    zone_id: { type: String, required: true },
    unique_name: { type: String, unique: true, required: true }
});

module.exports = mongoose.model('device', deviceSchema);