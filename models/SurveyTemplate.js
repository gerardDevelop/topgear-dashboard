// grab the things we need
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// create a schema
var SurveyTemplateSchema = new Schema({
  templateId: {
    type: Number,
    required: true,
  },
  data: {
    type: Object,
    required: true
  },
  description: {  // don't necessarily need this
    type: String
  },
  date: {
    type: String,
    required: true
  }
});

// the schema is useless so far
// we need to create a model using it
var SurveyTemplate = mongoose.model('SurveyTemplate', SurveyTemplateSchema);

// make this available to our users in our Node applications
module.exports = SurveyTemplate;


/*

 name: String,
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  admin: Boolean,
  location: String,
  meta: {
    age: Number,
    website: String
  },
  created_at: Date,
  updated_at: Date

*/