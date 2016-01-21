function populateDriverList(dataObj) {

  var acceptedMapper = {
      1: 'pending',
      2: 'accepted'
    },
    rowMapper = {
      'severe': 4,
      'high': 3,
      'medium': 2,
      'low': 1
    },
    columnMapper = {
      'noImpact': 1,
      'lowImpact': 2,
      'mediumImpact': 3,
      'highImpact': 4
    };

  $('.driver-list-wrapper').empty();
  $('.driver-list-wrapper').append('<h2 class="primary-header clearfix"><div class="left-view">' + dataObj.headerName + '\
  <span class="driver-count">  (' + dataObj.count + ')</span></div><div class="right-view"><span class="pen-wrapper status-filter selected-filter" id="pendingFilter">\
  <span class="pen-stat">&#9998;</span></span><span id="acceptedFilter" class="acc-filter status-filter selected-filter "></span></div></h2>');
  _.map(dataObj.crunchedData, function(driverData) {
    $('.driver-list-wrapper').append('<h4 class="transformIt secondary-header">' + driverData.name + '</h4><ul class="driver-list" id="' + driverData.name + 'list"></ul>');
    _.map(driverData.data, function(driverInfo) {
      var acceptedStatus = (acceptedMapper[driverInfo.riskStatus] ? acceptedMapper[driverInfo.riskStatus] : "");
      var cubeBackground = $('#cube-' + columnMapper[driverInfo.columnName] + '-' + rowMapper[driverInfo.rowName]).css('background-color');
      $('#' + driverData.name + 'list').append('<li class="list-item driver-item '+acceptedStatus+'Item" data-driverID="' + driverInfo.id + '">\
      <span class="bullet" style="background-color:' + cubeBackground + '"></span>\
      <span class="driver-name">' + driverInfo.driver + '</span>\
      <span class="driver-status status-' + acceptedStatus + '">' + acceptedStatus + '</span>' + '</li>');
    });
  });
  $('.driver-item').click(function() {
    $('#clicked-asset').html($(this).attr('data-driverID'));
  });

  $('.status-filter').click(function() {
    $(this).toggleClass('selected-filter');
    var clickedFilter = $(this).attr('id').split('Filter')[0];
    $('.'+clickedFilter+'Item').toggle();
  });
}
