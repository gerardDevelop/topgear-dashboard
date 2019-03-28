const mongoose = require('mongoose');
const getDateString = require('../utils/GetDateString');

// DB schemas
const SurveyTemplateSchema = new mongoose.Schema({
  templateId: {
    type: Number,
    required: true
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

module.exports = SurveyTemplateSchema;