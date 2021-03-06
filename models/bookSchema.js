var mongoose = require('mongoose')
var Schema = mongoose.Schema;

var bookSchema = new Schema({
  title: {
    type: String,
    required: true
  } ,
  
  comment: {
  type: Array,
    default: []
  }
})

module.exports = mongoose.model('Books' , bookSchema);