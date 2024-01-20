const express = require('express');
const mysql = require('mysql');
const bcrypt = require('bcrypt');
const db = require('./DB'); // DB.js 파일을 불러옵니다.

const app = express();

const port = 3000;

// express.json() 미들웨어를 사용하여 POST 요청의 body를 파싱합니다.
app.use(express.json());

// '/' 경로에 대한 GET 요청 핸들러 함수를 정의합니다.
app.get('/', (req, res) => {
  // 루트 경로에 접속하면 'Root'라는 메시지를 응답으로 보냅니다.
  res.send('Root');
});

// '/users' 경로에 대한 GET 요청 핸들러 함수를 정의합니다.
app.get('/users', (req, res) => {
  // DB 연결 객체를 통해 'sign_up' 테이블에서 모든 데이터를 가져옵니다.
  db.query('SELECT * from sign_up', (err, results) => {
    // 오류가 발생하면 오류를 콘솔에 출력하고 처리를 중단합니다.
    if (err) throw err;

    // 클라이언트에 결과를 응답으로 보냅니다.
    res.send(results);
  });
});

// 회원가입을 처리하는 엔드포인트
app.post('/register', async (req, res) => {
    // 요청(body)에서 사용자 아이디와 비밀번호를 추출합니다.
    const { userId, userPassword } = req.body;
  
    // 비밀번호를 bcrypt를 사용하여 해시화합니다.
    const hashedPassword = await bcrypt.hash(userPassword, 10);
  
    // MySQL 쿼리를 생성하여 사용자 정보를 데이터베이스에 저장합니다.
    const query = 'INSERT INTO sign_up (user_id, user_password) VALUES (?, ?)';
    db.query(query, [userId, hashedPassword], (err, result) => {
      // 에러가 발생하면 에러를 콘솔에 출력하고 500 상태 코드로 응답합니다.
      if (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
        return;
      }
  
      // 성공적으로 데이터를 추가했을 경우 콘솔에 로그를 출력하고 201 상태 코드로 응답합니다.
      console.log('User added:', result);
      res.status(201).send('User added successfully');
    });
  });
  
  // 로그인을 처리하는 엔드포인트
  app.post('/login', async (req, res) => {
    // 요청(body)에서 사용자 아이디와 비밀번호를 추출합니다.
    const { userId, userPassword } = req.body;
  
    // MySQL 쿼리를 생성하여 사용자 아이디로 사용자 정보를 조회합니다.
    const query = 'SELECT * FROM sign_up WHERE user_id = ?';
    db.query(query, [userId], async (err, result) => {
      // 에러가 발생하면 에러를 콘솔에 출력하고 500 상태 코드로 응답합니다.
      if (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
        return;
      }
  
      // 조회된 사용자가 없으면 404 상태 코드로 응답합니다.
      if (result.length === 0) {
        res.status(404).send('User not found');
        return;
      }
  
      // bcrypt를 사용하여 저장된 해시된 비밀번호와 비교합니다.
      const isPasswordValid = await bcrypt.compare(userPassword, result[0].user_password);
  
      // 비밀번호가 유효하면 200 상태 코드로 응답합니다.
      if (isPasswordValid) {
        res.status(200).send('Login successful');
      } else {
        // 비밀번호가 유효하지 않으면 401 상태 코드로 응답합니다.
        res.status(401).send('Invalid password');
      }
    });
  });
  
  // 서버를 지정된 포트에서 실행합니다.
  app.listen(port, () => {
    console.log(`SERVER 실행됨 ${port}`);
  });

  