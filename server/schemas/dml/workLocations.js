var rfr = require('rfr'),
mongoose = require('mongoose'),
workLocations = mongoose.model('work_locations');

var workLocationModel = rfr('/server/models/static/workLocations');

workLocations.count().exec(function(err, res) {
  if (res === 0) {
    workLocations.insertMany([
      {'name': 'On-Site'},
      {'name': 'Remote'},
      {'name': 'On-Site or Remote'},
      {'name': 'On-Site and Remote'}
    ], function(err, res) {
      workLocationModel.get();
    });
  } else {
    workLocationModel.get();
  }
});
