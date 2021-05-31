const mysql = require('mysql');

const connection = mysql.createConnection({
    host     : 'freedb.tech',
    user     : 'freedbtech_yashodhara',
    password : 'iostream.h',
    database : 'freedbtech_viyas_airways',
    multipleStatements : true
});

connection.connect(function(err) {
    if (err) throw err;
});

module.exports = connection;