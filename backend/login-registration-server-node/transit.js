const mongoose = require('mongoose');

const transitSchema = new mongoose.Schema({
    date: { 
        type: Date,  // Changed to Date type
        required: true 
    },
    invoice: String,
    lotNo: String,
    vehicleNo: String,
    ewayNo: String,
    factory: String,
    center: String,
    to: String,
    udNo: String,
    bales: { 
        type: Number, 
        required: true 
    },
    lrNo: String
});

const Transit = mongoose.model('Transit', transitSchema);
module.exports = Transit;