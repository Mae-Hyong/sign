// const mysql = require("mysql2");
// const db_info = mysql.createConnection({
//     host: "localhost", // 데이터베이스 주소
//     port: "3306", // 데이터베이스 포트
//     user: "root", // 로그인 계정
//     password: "seal", // 비밀번호
//     database: "test", // 엑세스할 데이터베이스
// });

// const getUsers = async ()=>
// {
//     const promisePool = db_info.promise();
//     const [rows] = await promisePool.query('select * from sign_up;');
//     console.log(rows);
//     return rows;
// };

// module.exports = 
// {
//     getUsers
// };

const mysql = require("mysql");

// const password = process.env.DATABASE_SPRINT_PASSWORD;

// const host = "localhost";

let connection = mysql.createConnection({
    host     : 'grp6m5lz95d9exiz.cbetxkdyhwsb.us-east-1.rds.amazonaws.com', //실제로 연결할 데이터베이스의 위치
    user     : 'o60e520n4ok4t4oe',
    password : 'nu0tvn1135wjzvhx',
    database : 'thwp8adpnzejuik8' //데이터베이스 이름
  });

  connection.connect();

  module.exports = connection;