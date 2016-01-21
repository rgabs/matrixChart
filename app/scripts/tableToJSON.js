function TableToJSON(tableDomElement) {
  //for creating data array from html table
  var dataArray = [],
    count = 1,
    likelihoodMapper = {
      4: 'severe',
      3: 'high',
      2: 'medium',
      1: 'low'
    },
    impactMapper = {
      1: 'noImpact',
      2: 'lowImpact',
      3: 'mediumImpact',
      4: 'highImpact'
    };
  $(tableDomElement).map(function() {
    var $cells = $(this).children();
    if ($(this).children().length === 5) {
      dataArray.push({
        id: 'AS' + count,
        driver: $cells.eq(0).text(),
        rowName: likelihoodMapper[$cells.eq(1).find('input').val()],
        columnName: ($cells.eq(4).find('input').val() === '1') ? impactMapper[4] : impactMapper[$cells.eq(2).find('input').val()],
        riskStatus: $cells.eq(3).find('input').val(), // 1: pending, 2: accepted
        topRisk: $cells.eq(4).find('input').val() //
      });
      count++;
    }
  });
  this.dataArray = dataArray;
}
