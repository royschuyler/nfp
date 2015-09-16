var express = require('express');
var app = express();

var sqlite3 = require('sqlite3');
var db = new sqlite3.Database('Tester3');



app.set('view engine', 'jade');


app.get('/', function (req, res) {

   db.serialize(function() {
    db.all('SELECT * FROM Donor', function(err, rows) {
      var arr = [];
      console.log(rows);
      console.log(rows.length);
      res.render('index2', { title: rows[0].PrimaryID, message: rows[0].FirstName, data: rows });

        // res.send(rows)

      // for (i=0;i<rows.length;i++) {

      // }

   });
  })
 })

app.listen(3000);



