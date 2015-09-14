var sqlite3 = require('sqlite3');
var db = new sqlite3.Database('./Test.sl3');

db.serialize(function () {


  //firstName(txt), lastName(txt), email(txt), phone(num), address(number(txt), street(txt) apt#(txt), city(txt), zip(txt)), birthday(txt)


  // db.run('DROP TABLE Donor');

  // db.run('CREATE TABLE Donor (PrimaryID integer primary key not null, FirstName text not null)');
  db.run('INSERT INTO Donor(PrimaryID, FirstName) VALUES(1, "John")');
  db.run('INSERT INTO Donor(FirstName) VALUES("Tim")');
  db.run('INSERT INTO Donor(FirstName) VALUES("Phil")');
  db.run('INSERT INTO Donor(FirstName) VALUES("Greg")');


  db.each('SELECT * FROM Donor', function(err, row) {
    console.log('PrimaryID: ' + row.PrimaryID, 'FirstName: ' + row.FirstName);

  })






db.close();
})
