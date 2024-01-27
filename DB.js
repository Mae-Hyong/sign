const mysql = require("mysql");

let connection = mysql.createConnection({
    host     : 'grp6m5lz95d9exiz.cbetxkdyhwsb.us-east-1.rds.amazonaws.com', //실제로 연결할 데이터베이스의 위치
    user     : 'o60e520n4ok4t4oe',
    password : 'nu0tvn1135wjzvhx',
    database : 'thwp8adpnzejuik8' //데이터베이스 이름
  });

  connection.connect();

  module.exports = connection;