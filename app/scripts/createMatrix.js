function createMatrix(dataArray) {
  'use strict';

  var groupedData = {},
    backgroundColorMapper = ['#DD4B5C', '#DD4B5C', '#DD4B5C', '#93454F',
      '#F7AB63', '#DD4B5C', '#DD4B5C', '#DD4B5C',
      '#F7D064', '#F7AB63', '#F7AB63', '#F7AB63',
      '#B9D989', '#F7D064', '#F7D064', '#F7D064'],
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

  _.chain(dataArray).groupBy('rowName').map(function(riskData, key) {
    groupedData[rowMapper[key]] = _.chain(riskData).groupBy('columnName').mapKeys(function(impactObj, key) {
      return columnMapper[key];
    }).value();
  }).value();

  var populateMatrixInfo = function() {
    var acceptedCount = _.where(dataArray, {
        'riskStatus': '2'
      }).length,
      totalAssets = dataArray.length,
      pendingCount = totalAssets - acceptedCount;

    $('.pending-count').html(pendingCount);
    $('.accepted-count').html(acceptedCount);
    $('#assetCount').html(totalAssets);
  };

  var drawMatrix = function() {
    var matrixVal = 0,
      acceptedMatrixVal = 0;
    for (var i = 4; i >= 1; i--) { //for Risk
      $('.cube-container').append('<div class="cube-row row' + i + '"></div>');
      for (var j = 1; j <= 4; j++) { // for Impact
        matrixVal = _.isArray(groupedData[j][i]) ? groupedData[j][i].length : 0;
        acceptedMatrixVal = _.where(groupedData[j][i], {
          'riskStatus': '2'
        }).length;
        $('.cube-container .row' + i).append('<span class="inner-cube cube-size" style="background-color: ' + backgroundColorMapper[(4 - i) * 4 + j - 1] + '" id="cube-' + i + '-' + j + '"><span class="cube-value">' + matrixVal + '</span><span class="accepted-val">' + acceptedMatrixVal + '</span></span>').hide().fadeIn(((4 - i) * 4 + j - 1) * 20);
      }
    }
  };

  var drawLegends = function() {
    var bottomLegends = ['Low', 'Medium', 'High', 'severe'],
      leftLegends = ['No Impact', 'Low Impact', 'Medium', 'High Impact'],
      columnLength = 0,
      rowLength = 0,
      i = 0;

    $('.cube-container').prepend('<div class="cube-row legends legends-left"><div class="left-wrapper"></div><div class="left-legend-heading"></div></div>');
    $('.cube-container').append('<div class="cube-row legends legends-bottom"><div class="bottom-wrapper"></div></div><div class="bottom-legend-heading"></div>');
    for (i = 1; i <= 4; i++) {
      columnLength = 0;
      rowLength = 0;
      _.map(groupedData[i], function(data) {
        columnLength += data.length;
      });
      for (var j = 1; j <= 4; j++) {
        rowLength += groupedData[j][i] ? groupedData[j][i].length : 0;
      }
      $('.legends-left').append('<span class="cube-size left-legend legend' + '" id="legend-' + i + '-0">(' + rowLength + ')<br/>' + leftLegends[i - 1] + '</span>').hide().fadeIn(500, function() {
        $('.left-legend-heading').html('Impact').fadeIn(800);
      });
      $('.bottom-wrapper').append('<span class="cube-size bottom-legend legend' + '" id="legend-0-' + i + '">(' + columnLength + ')<br/>' + bottomLegends[i - 1] + '</span>').hide().fadeIn(500, function() {
        $('.bottom-legend-heading').html('Risk').fadeIn(800);
      });
    }
  };

  var clickHandlers = function() {
    // bottom-legend
    var legendMapper = {
      'legend-0-1': ['1-1', '2-1', '3-1', '4-1'],
      'legend-0-2': ['1-2', '2-2', '3-2', '4-2'],
      'legend-0-3': ['1-3', '2-3', '3-3', '4-3'],
      'legend-0-4': ['1-4', '2-4', '3-4', '4-4'],
      'legend-1-0': ['1-1', '1-2', '1-3', '1-4'],
      'legend-2-0': ['2-1', '2-2', '2-3', '2-4'],
      'legend-3-0': ['3-1', '3-2', '3-3', '3-4'],
      'legend-4-0': ['4-1', '4-2', '4-3', '4-4']
    };

    $('.select-all').click(function() {
      var allCubes = [];
      Object.keys(legendMapper).forEach(function(key) {
        allCubes.push.apply(allCubes, legendMapper[key]);
      });
      selectCubes(allCubes);
    });

    $('.inner-cube').click(function() {
      $('.legend').removeClass('legend-selected');
      selectCubes([$(this).attr('id').split('cube-')[1]]);
    });

    $('.legend').click(function() {
      $('.legend').removeClass('legend-selected');
      $(this).addClass('legend-selected');
      selectCubes(legendMapper[$(this).attr('id')]);
    });

    $('.select-all').click(); // select all cubes by default
  };


  function selectCubes(selection) {
    var selected = [],
      filteredData = [],
      count = 0,
      sortMapper = {
        'columnName': columnMapper, //row
        'rowName': rowMapper
      },
      uniqueBackgroundMapper = ['rgb(147, 69, 79)', 'rgb(221, 75, 92)', 'rgb(247, 171, 99)', 'rgb(247, 208, 100)', 'rgb(185, 217, 137)'];
    //view
    $('.inner-cube').removeClass('highlight-cube');
    _.map(selection, function(ids) {
      $('#cube-' + ids).addClass('highlight-cube');
    });
    //data
    selected = getSelectedData(selection);
    var groupByKey = selection.length > 1 ? selection[0].split('-')[1] === selection[1].split('-')[1] ? 'columnName' : 'rowName' : 'rowName';

    filteredData = _.chain(selected.filteredData).groupBy(groupByKey).map(function(arr, key) {
      return {
        name: key,
        data: _.sortBy(arr, function(dataObj) {
          var currentBackground = $('#cube-' + rowMapper[dataObj.rowName] + '-' + columnMapper[dataObj.columnName]).css('background-color');
          return uniqueBackgroundMapper.indexOf(currentBackground);
        })
      };
    }).value();

    var dataObj = {
      crunchedData: _.sortBy(filteredData, function(data) {
        return sortMapper[groupByKey][data.name];
      }).reverse(),
      count: selected.filteredData.length,
      headerName: selected.header
    };
    populateDriverList(dataObj);
  }

  function getSelectedData(selection) {
    var filteredData = [],
      header = 'Assets';
    if (selection.length === 4) {
      if (selection[0].split('-')[0] === selection[1].split('-')[0]) { //columnMapper (row)
        _.map(groupedData, function(impactData, likelihoodKey) {
          if (impactData[selection[1].split('-')[0]]) {
            filteredData.push.apply(filteredData, impactData[selection[1].split('-')[0]]);
            header = $('#legend-' + selection[1].split('-')[0] + '-0').html().split('>')[1];
          }
        });
      } else { //liklihoodMapper (column)
        _.map(groupedData[selection[0].split('-')[1]], function(likelihoodData) {
          filteredData.push.apply(filteredData, likelihoodData);
          header = $('#legend-0-' + selection[0].split('-')[1]).html().split('>')[1];
        });
      }
    } else if (selection.length === 1) { //single cube clicked
      filteredData = groupedData[selection[0].split('-')[1]][selection[0].split('-')[0]] || []; //groupedData[rowNo][columnNo]
      header = $('#legend-' + selection[0].split('-')[0] + '-0').html().split('>')[1];
    } else { //select all
      filteredData = dataArray;
    }
    return {
      filteredData: filteredData,
      header: header
    };
  }

  populateMatrixInfo();
  drawMatrix();
  drawLegends();
  clickHandlers();
}
