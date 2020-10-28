var rfr = require('rfr');

var utils = rfr('/server/shared/utils'),
jobStatusModel = rfr('/server/models/jobStatus');

function updateJobStatus(req, res) {
  var cb = function(result) {
    utils.sendResponse(res, result);
  }
  jobStatusModel.updateJobStatus(req, res, cb);
}

function getAll(req, res) {
  var cb = function(result) {
    utils.sendResponse(res, result);
  }
  jobStatusModel.getAll(req, res, cb);
}

function saveRating(req, res) {
  var cb = function(result) {
    utils.sendResponse(res, result);
  }
  jobStatusModel.saveRating(req, res, cb);
}

module.exports = {
  updateJobStatus,
  getAll,
  saveRating
}
