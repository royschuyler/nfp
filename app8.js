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
app.get('/test', function(req, res) {
  res.render('test')
});

//--------------------------------------------------------------------------------------------
  app.get('/home', function(req, res) {
    res.render('home')
  });
//--------------------------------------------------------------------------------------------
  app.get('/donation-query', function(req, res) {
    res.render('donation-query')
  });
//--------------------------------------------------------------------------------------------

  app.get('/volunteer-query', function(req, res) {
    res.render('volunteer-query')
  });
//--------------------------------------------------------------------------------------------



//--------------------------------------------------------------------------------------------
  app.post('/donation-query', function(req, res) {

    var date1 = req.body.date1 + 'e' + req.body.date2
    var date2 = req.body.date2

     //db.run('INSERT INTO Query(Date1, Date2)VALUES(' + "'" + date1 + "'," + "'" + date2 + "'" + ')');

     res.redirect('/donation-query/' + date1)
  });

//--------------------------------------------------------------------------------------------
  app.post('/volunteer-query', function(req, res) {

    var date1 = req.body.date1 + 'e' + req.body.date2
    var date2 = req.body.date2

     //db.run('INSERT INTO Query(Date1, Date2)VALUES(' + "'" + date1 + "'," + "'" + date2 + "'" + ')');

     res.redirect('/volunteer-query/' + date1)
  });
//--------------------------------------------------------------------------------------------

  app.get('/donation-query/:id', function(req, res) {
    var id = req.params.id;
    var split = id.split('e');
    var date1 = split[0];
    var date2 = split[1];
    db.all('SELECT * From Donation JOIN Donor ON Donation.DonorID = Donor.PrimaryID WHERE Date BETWEEN' + "'" + date1 + "'"  + 'AND' + "'" + date2 + "'", function(err, rows) {
      console.log(rows)
      res.render('donation-query-id', {data: rows, date: date1 + ' and ' + date2})
    });

  });
//--------------------------------------------------------------------------------------------

  app.get('/volunteer-query/:id', function(req, res) {
    var id = req.params.id;
    var split = id.split('e');
    var date1 = split[0];
    var date2 = split[1];
    db.all('SELECT * From Volunteer JOIN Donor ON Volunteer.VolunteerID = Donor.PrimaryID WHERE Date BETWEEN' + "'" + date1 + "'"  + 'AND' + "'" + date2 + "'", function(err, rows) {
      console.log(rows)
      res.render('volunteer-query-id', {data: rows, date: date1 + ' and ' + date2})
    });
  });

//**********************************************************************************************
//**********************************************************************************************

  app.get('/affiliation', function(req, res) {
    db.all('SELECT Name, PrimaryID FROM Affiliation', function(err, rows) {
      res.render('affiliation', {rows: rows})
    })
  });

//--------------------------------------------------------------------------------------------

  app.post('/affiliation', function(req, res) {
    // console.log(req.body)
    db.run('INSERT INTO Affiliation(Name, CFirstName, CLastName, Cemail, CPhone, StreetNumber, StreetName, City, State, Zip) Values(' + "'" + req.body.aname + "'," + "'" + req.body.fname + "'," + "'" + req.body.lname + "'," + "'" + req.body.Cemail + "'," + "'" + req.body.CPhone + "'," + "'" + req.body.StreetNumber + "'," + "'" + req.body.StreetName + "'," + "'" + req.body.City + "'," + "'" + req.body.State + "'," + "'" + req.body.Zip + "'" + ')')
    res.redirect('/affiliation')
  });

//--------------------------------------------------------------------------------------------


  app.get('/affiliation/:id', function(req, res) {
    var pass = req.params.id
    db.all('SELECT * FROM Affiliation JOIN Donor ON Affiliation.Name = Donor.Affiliation WHERE Affiliation.PrimaryID =' + "'" + pass + "'", function(err, rows) {
      console.log(rows);
      res.render('affiliation-id', {rows: rows, data: rows[0]})
    });
  });

//--------------------------------------------------------------------------------------------

app.get('/search', function(req, res) {
  db.all('SELECT DISTINCT Affiliation FROM Donor', function(err, rows) {
    res.render('search', { affiliations: rows } )
  });
});

//--------------------------------------------------------------------------------------------
app.post('/search', function(req, res) {

  res.redirect('/search')
});

//--------------------------------------------------------------------------------------------

app.get('/', function(req, res) {

  db.serialize(function() {

    db.all('SELECT * FROM Donor ORDER BY LastName', function(err, rows) {
      res.render('list', {
        data: rows
      });
    });
  });
});

//---------------------------------------------------------------------------------------------

app.get('/signup', function(req, res) {
  db.all('SELECT DISTINCT Name FROM Affiliation', function(err, rows) {
    // console.log(rows)
    res.render('signup', { affiliations: rows } )
  });
});

app.post('/signup', function(req, res) {
      console.log(req.body)
      db.run('INSERT INTO Donor(FirstName, LastName,email,Phone,DStreetNumber,DStreetName,DCity,DState,DZip,Affiliation) VALUES(' + "'" + req.body.fname + "'" + ',' + "'" + req.body.lname + "'" + ',' + "'" + req.body.email + "'," + "'" + req.body.phone + "',"  +  "'" + req.body.DStreetNumber + "'," + "'" + req.body.DStreetName + "'," + "'" + req.body.DCity + "'," + "'" + req.body.DState + "'," + "'" + req.body.DZip + "'," + "'" + req.body.affiliation + "'" + ')');
    res.redirect('/')
  });


//----------------------------------------------------------------------------------------------
app.get('/:id', function(req, res) {

  pass = req.params.id;

  db.all('SELECT * FROM Donor WHERE PrimaryID =' + "'" + pass + "'", function(err, rows) {
    console.log(rows);
    var name = rows[0].FirstName + ' ' + rows[0].LastName;
    var link = rows[0].PrimaryID;
    console.log(name)
    res.render('donor',
     { name: name,
       link: link,
       donation: link + '/donation',
       volunteer: link + '/volunteer',
       pass: pass,
       rows: rows[0]
     });
  });
});


//----------------------------------------------------------------------------------------------
app.get('/:id/donation', function(req, res, next) {

  pass = req.params.id;


  db.all('SELECT * FROM Donor INNER JOIN Donation ON Donor.PrimaryID = Donation.DonorID WHERE Donation.DonorID =' + "'" + pass + "'", function(err, rows) {
// console.log(rows[0].amount)
  if(rows.length != 0) {
    var arr = [];

    for (var i = 0; i < rows.length; i++) {
      var num = Number(rows[i].amount)
      arr.push(num)
    }

    var total = '$' + arr.reduce(function(a, b) {
      return a + b;
    });

    res.render('donation', {
      fullName: rows[0].FirstName + ' ' + rows[0].LastName,
      name: pass,
      data: rows,
      rows: rows[0],
      total: total
     });

    } else {

      db.all('SELECT * FROM Donor WHERE PrimaryID =' + "'" + pass + "'", function(err, rows) {

        res.render('donation', {
        fullName: rows[0].FirstName + ' ' + rows[0].LastName,
        name: pass,
        data: rows,
        rows: rows[0]
        });
      });
    };
  });
});


  app.post('/:id/donation', function(req, res) {
    var pass = req.params.id;
    console.log(pass)
    if (req.body.date) {
      // console.log(req.body)
      db.run('INSERT INTO Donation(DonorID, Date, amount, method) VALUES(' + "'" + pass + "'" + ',' + '"' + req.body.date + '"' + ',' + req.body.amount + ',' + '"' + req.body.method + '"' + ')');
    };

    res.redirect(req.get('referer'));

  });

//---------------------------------------------------------------------------------------------

  app.get('/:id/volunteer', function(req, res, next) {

  pass = req.params.id;

  db.all('SELECT * FROM Donor INNER JOIN Volunteer ON Donor.PrimaryID = Volunteer.VolunteerID WHERE Volunteer.VolunteerID =' + "'" + pass + "'", function(err, rows) {
// console.log(rows[0].amount)
  if(rows.length != 0) {
    var arr = [];

    for (var i = 0; i < rows.length; i++) {
      var num = Number(rows[i].Hours)
      arr.push(num)
    }

    var total = arr.reduce(function(a, b) {
      return a + b;
    });

    res.render('volunteer', {
      fullName: rows[0].FirstName + ' ' + rows[0].LastName,
      name: pass,
      data: rows,
      rows: rows[0],
      total: total
     });

    } else {

      db.all('SELECT * FROM Donor WHERE PrimaryID =' + "'" + pass + "'", function(err, rows) {

        res.render('volunteer', {
        fullName: rows[0].FirstName + ' ' + rows[0].LastName,
        name: pass,
        data: rows,
        rows: rows[0]
        });
      });
    };
  });
});


  app.post('/:id/volunteer', function(req, res) {
    var pass = req.params.id;
    console.log(pass)
    if (req.body.Hours) {
      // console.log(req.body)
      db.run('INSERT INTO Volunteer(VolunteerID, Date, Hours, Department) VALUES(' + "'" + pass + "'" + ',' + '"' + req.body.Date + '"' + ',' + req.body.Hours + ',' + '"' + req.body.Department + '"' + ')');
    };

    res.redirect(req.get('referer'));

  });


//-----------------------------------------------------------------------------------------------

app.listen(3000);
