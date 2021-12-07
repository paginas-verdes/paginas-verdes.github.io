
console.log("Hi! If you want to check this project's code you can find it here: https://github.com/ecologismo-argentina")

var publicSpreadsheetUrl = 'https://docs.google.com/spreadsheets/d/1QQKTVEIHFY1OTlYWXgCE2Nw1JrcnKOLARkGtGAPoF5o/pub?output=csv';
var sheet_data;

function init() {
          Papa.parse(publicSpreadsheetUrl, {
          download: true,
          header: true,
          complete: function(results) {
            var data = results.data
            loadSheet(data)
          }
        })
}
function loadSheet(data, tabletop) {
  var data_processed = data.map( x => ['<a href="'+ x["Link"] +'" target="blank">'+ x["Título"] + '</a>', x["Descripción"], x["Provincia"], x["Categorías"], x["Localidad"]] )
  var table = $('#example').DataTable({
      "bPaginate": false,
      "bLengthChange": false,
      "bFilter": true,
      "bInfo": false,
      "bAutoWidth": false,

      "data" : data_processed,
      "column": [
      { "data" : "Titulo" },
      { "data" : "Descripción" },
      { "data" : "Provincia" },
      { "data" : "Categorías" },      
      { "data" : "Localidad" },      
      ],
      "columnDefs": [
          {
              "targets": [2],
              "visible": false
          },
          {
              "targets": [3],
              "visible": false
          },
          {
              "targets": [4],
              "visible": false
          },
      ],
   });


  var indices = [2,3]
  $("#search b").each( function ( i ) {
      i = indices[i];

      if ($(this).text() !== '') {
          var isStatusColumn = (($(this).text() == 'Status') ? true : false);
          var select = $('<select><option value="">'+$(this).text()+'</option></select>')
              .appendTo( $(this).empty() )
              .on( 'change', function () {
                  var val = $(this).val();
                  
                  table.column( i )
                      //.search( val ? '^'+$(this).val()+'$' : val, true, false ) // Soporta regex esto ;)
                      .search( val ? $(this).val() : val, true, false )
                      .draw();
              } );
          
          var values = [];

          table.column( i ).data().unique().sort().each( function ( d, j ) {  
              d.split(", ").map( d => values.push(d))
          });

          values = [...new Set(values)];

          values.map( function ( d, j ) {
              select.append( '<option value="'+d+'">'+d+'</option>' );
          } );

      }
  } );

}

init();
