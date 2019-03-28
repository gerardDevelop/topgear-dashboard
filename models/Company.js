const mongoose = require('mongoose');
const getDateString = require('../utils/GetDateString');

// DB schemas
const CompanySchema = new mongoose.Schema({
  companyid: {
    type: String,
    required: true
  },
});

var CompanyModel = mongoose.model('Company', CompanySchema);

module.exports = CompanyModel;