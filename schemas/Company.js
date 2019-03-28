const mongoose = require('mongoose');
const getDateString = require('../utils/GetDateString');

// DB schemas
const CompanySchema = new mongoose.Schema({
  companyid: {
    type: String,
    required: true
  },

});

module.exports = CompanySchema;