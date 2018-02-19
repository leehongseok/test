/* 
    hbs helper
*/
var expHelper = {
    table: function(data) {
      var str = '<table>';
      for (var i = 0; i < data.length; i++ ) {
        str += '<tr>';
        for (var key in data[i]) {
          console.log(data[i][key] );
          str += '<td>' + data[i][key] + '</td>';
        };
        str += '</tr>';
      };
      str += '</table>';
    
      return str;
    }
    
  }


  module.exports = expHelper;