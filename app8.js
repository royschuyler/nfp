var express = require('express');
var app = express();

var sqlite3 = require('sqlite3');
var db = new sqlite3.Database('Tester3');



app.set('view engine', 'jade');


app.get('/', function (req, res) {

   db.serialize(function() {
    db.all('SELECT * FROM Donor', function(err, rows) {

      console.log(rows);
      console.log(rows.length);
      // res.render('index', { title: rows.PrimaryID, message: rows.FirstName });






        res.send(rows)


   });
  })
 })

app.listen(3000);



