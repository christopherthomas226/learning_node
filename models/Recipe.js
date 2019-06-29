const mongoose = require('mongoose')

const Schema = mongoose.Schema

const RecipeSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    category:{
        type: String,
        reqiure: true
    },
    description: {
        type: String,
        require: true
    },
    instructions:{
        type: String,
        require: true
    },
    createdDate:{
        type: Date,
        default: Date.now
    },
    likes:{
        type: Number,
        default: 0
    },
    userName:{
        type: String
    }
})

RecipeSchema.index({
    "$**": "text"
})

module.exports = mongoose.model('Recipe', RecipeSchema)