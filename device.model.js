const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const deviceSchema = new Schema({
    type: { type: String },
    device_id: { type: String },
    state: { type: String, default: "off" },
    zone_id: { type: String, required: true },
    is_used: { type: Boolean, default: false }
});

module.exports = mongoose.model('device', deviceSchema);