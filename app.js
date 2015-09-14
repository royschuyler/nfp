var sqlite3 = require('sqlite3');
var db = new sqlite3.Database('./Test.sl3');

db.serialize(function () {


  //firstName(txt), lastName(txt), email(txt), phone(num), address(number(txt), street(txt) apt#(txt), city(txt), zip(txt)), birthday(txt)


  // db.run('DROP TABLE Favorites');

  db.run('CREATE TABLE Favorites (FavoriteID integer primary key not null, CategoryID integer not null)');
  db.run('INSERT INTO Favorites(FavoriteID, CategoryID) VALUES(1, 2)');
  db.run('INSERT INTO Favorites(CategoryID) VALUES(4)');
  db.run('INSERT INTO Favorites(CategoryID) VALUES(6)');
  db.run('INSERT INTO Favorites(CategoryID) VALUES(8)');


  db.each('SELECT * FROM Favorites', function(err, row) {
    console.log('FavoriteID: ' + row.FavoriteID, 'CategoryID: ' + row.CategoryID);

  })






db.close();
})
