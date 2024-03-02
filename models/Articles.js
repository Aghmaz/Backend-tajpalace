const mongoose = require('mongoose')

const ArtcleSchema = new mongoose.Schema({
    headline: { type: String, required: true, unique: true },
    bgimg: { type: String, required: true, unique: true },
    titleOne: { type: String, required: true },
    titleTwo: { type: String },
    titleThree: { type: String },
    titleFour: { type: String},
    paraOne:{type:String, required:true},
    paraTwo:{type:String, required:true},
    paraThree:{type:String, required:true},
    paraFour:{type:String, required:true},
    img: [String]
},
    { timestamps: true }
)

module.exports = mongoose.model("Articles", ArtcleSchema);