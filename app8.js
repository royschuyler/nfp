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

app.get('/', function(req, res) {

  db.serialize(function() {

    // db.run('DROP TABLE Donor');

    // db.run('CREATE TABLE Donor (PrimaryID integer primary key not null, FirstName text not null, LastName text not null, email text not null)');
    // db.run('INSERT INTO Donor(PrimaryID, FirstName, LastName, email) VALUES(1, "John", "Smithmun", "abc@mail.com")');
    // db.run('INSERT INTO Donor(FirstName, LastName, email) VALUES("Tim", "Brahmstein", "jebadiah@amish.com")');
    // db.run('INSERT INTO Donor(FirstName, LastName, email) VALUES("Phil", "Resurrected", "philmun@phlaker.com")');
    // db.run('INSERT INTO Donor(FirstName, LastName, email) VALUES("Greg", "Phaulstein", "maude@lebski.com")');

    db.all('SELECT * FROM Donor', function(err, rows) {
      var arr = [];
      console.log(rows);
      console.log(rows.length);
      res.render('index2', {
        data: rows
      });
    });
  });
});

app.get('/signup', function (req, res) {
  res.render('signup')
});

app.post('/signup', function(req, res) {
  // res.render('signup')
  console.log(req.body);
  console.log(req.body.lname)

  db.serialize(function() {
    if (req.body.lname) {
      db.run('INSERT INTO Donor(FirstName, LastName, email) VALUES(' + "'" + req.body.fname + "'" + ',' + "'" + req.body.lname + "'" + ',' + "'" + req.body.email + "'" + ')');
    };
  });
  res.redirect('/')
});

app.listen(3000);


