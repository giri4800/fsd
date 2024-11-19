const mongoose = require('mongoose');

const outWard = new mongoose.Schema({
    date: String,
    lotNo: String,
    bales: String,
    center: String,
     
   
}, { timestamps: true });

module.exports = mongoose.model('Outward', outWard);