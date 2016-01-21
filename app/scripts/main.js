$(function() {
  'use strict';
  var domElement = '.confirmit-grid tbody tr';
  var dataArray =[];
  $.get('/fixtures/dummyData.json',function(data) {
    dataArray = data;
    createMatrix(dataArray);
  });
});
