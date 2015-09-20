var express = require('express');
var app = express();
var bodyParser = require('body-parser')

app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(bodyParser.json());

var sqlite3 = require('sqlite3');
var db = new sqlite3.Database('Tester3');

app.set('view engine', 'jade');
app.use(express.static('www'));

//--------------------------------------------------------------------------------------------

app.get('/home', function(req, res) {
  var pass = '';
  res.render('header');
});

//--------------------------------------------------------------------------------------------

app.get('/search', function(req, res) {
  res.render('search')

});

//--------------------------------------------------------------------------------------------
app.post('/search', function(req, res) {

  res.redirect('/search')
});

//--------------------------------------------------------------------------------------------

app.get('/', function(req, res) {
  var pass = '';

  db.serialize(function() {

    db.all('SELECT * FROM Donor', function(err, rows) {
      res.render('list', {
        data: rows
      });
    });
  });
});

//---------------------------------------------------------------------------------------------

app.get('/signup', function(req, res) {

  res.render('signup')
});

app.post('/signup', function(req, res) {

  db.serialize(function() {
    if (req.body.lname) {

      db.run('INSERT INTO Donor(FirstName, LastName, email, Affiliation) VALUES(' + "'" + req.body.fname + "'" + ',' + "'" + req.body.lname + "'" + ',' + "'" + req.body.email + "'" + ',' + "'" + req.body.affiliation + "'" + ')');
    };
  });
  res.redirect('/')
});

//----------------------------------------------------------------------------------------------

app.get('/:id', function(req, res, next) {

  pass = req.params.id;


  db.all('SELECT * FROM Donor INNER JOIN Donation ON Donor.PrimaryID = Donation.DonorID WHERE Donation.DonorID =' + "'" + pass + "'", function(err, rows) {
// console.log(rows[0].amount)
  if(rows.length != 0) {
    var arr = [];

    for (var i = 0; i < rows.length; i++) {
      var num = Number(rows[i].amount)
      arr.push(num)
    }
console.log(arr)

    var total = arr.reduce(function(a, b) {
      return a + b;
    });

console.log(total)



    res.render('name', {
      name: pass,
      data: rows,
      rows: rows[0],
      total: total
     });

    } else {

      db.all('SELECT * FROM Donor WHERE PrimaryID =' + "'" + pass + "'", function(err, rows) {

        res.render('name', {
        name: pass,
        data: rows,
        rows: rows[0]
        });
      });
    };
  });
});


  app.post('/:id', function(req, res) {
    var pass = req.params.id;
    console.log(pass)
    if (req.body.date) {
      // console.log(req.body)
      db.run('INSERT INTO Donation(DonorID, Date, amount, method) VALUES(' + "'" + pass + "'" + ',' + '"' + req.body.date + '"' + ',' + req.body.amount + ',' + '"' + req.body.method + '"' + ')');
    };

    res.redirect(req.get('referer'));

  });



//---------------------------------------------------------------------------------------------

//-----------------------------------------------------------------------------------------------

app.listen(3000);
