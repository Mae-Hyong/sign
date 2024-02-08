const express = require('express');
const bcrypt = require('bcrypt');
const cors = require('cors');
const db = require('./DB'); // DB.js 파일을 불러옵니다.

const app = express();

const PORT = process.env.PORT || 8080;

// express.json() 미들웨어를 사용하여 POST 요청의 body를 파싱합니다.
app.use(express.json());

// '/' 경로에 대한 GET 요청 핸들러 함수를 정의합니다.
app.get('/', (req, res) => {
  // 루트 경로에 접속하면 'Root'라는 메시지를 응답으로 보냅니다.
  res.send('Root');
});

// 회원가입을 처리하는 엔드포인트
app.post('/register', async (req, res) => {
  // 요청(body)에서 사용자 아이디와 비밀번호를 추출합니다.
  const { userId, userPassword, phoneNumber } = req.body;

  // 비밀번호를 bcrypt를 사용하여 해시화합니다.
  const hashedPassword = await bcrypt.hash(userPassword, 10);

  // MySQL 쿼리를 생성하여 사용자 정보를 데이터베이스에 저장합니다.
  const query = 'INSERT INTO user_info (user_id, user_password, phone_number) VALUES (?, ?, ?)';
  db.query(query, [userId, hashedPassword, phoneNumber], (err, result) => {
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
  const query = 'SELECT * FROM user_info WHERE user_id = ?';
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

// '/users' 경로에 대한 GET 요청 핸들러 함수를 정의합니다.
app.get('/users', (req, res) => {
  const userName = req.query.user_name;

  // 만약 user_name 매개변수가 제공된 경우, 필터링된 쿼리를 수행합니다.
  if (userName) {
    const query = 'SELECT * FROM user_info WHERE user_name = ?';

    db.query(query, [userName], (err, results) => {
      if (err) {
        console.error(err);
        res.status(500).send('내부 서버 오류');
        return;
      }

      res.send(results);
    });
  } else {
    // 만약 user_name 매개변수가 제공되지 않은 경우, 모든 사용자를 검색합니다.
    const query = 'SELECT * FROM user_info';

    db.query(query, (err, results) => {
      if (err) {
        console.error(err);
        res.status(500).send('내부 서버 오류');
        return;
      }

      res.send(results);
    });
  }
});

// app.post('/profile', async (req, res) => {
//   const { userName, masterAuth, userId } = req.body;
//   const query = 'INSERT INTO user_info (user_name, ) VALUES (?, ?, ?)'
//   db.query(query, [userName, masterAuth, userId], (err, result) => {
//     if(err) {
//       console.log(err);
//       res.status(500).send('Internal Server Error');
//       return;
//     }

//     console.log('Profile added:', result);
//     res.status(201).send('Profile added successfully');
//   });
// });
  
app.post('/apply', async (req, res) =>{
  const{ eMail, companyName, applyStatus, buisnessNumber, userName } = req.body;
  const query = 'INSERT INTO master_apply (e_mail, company_name, apply_status, buisness_number, user_name) VALUES (?, ?, ?, ?, ?)'
  db.query(query, [eMail, companyName, applyStatus, buisnessNumber, userName], (err, result) => {
    if(err) {
      console.log(err);
      res.status(500).send('Internal Server Error');
      return;
    }

    console.log('apply added:', result);
    res.status(201).send('apply added successfully');
  });
});

app.get('/apply_check', async (req, res) => {
  db.query('SELECT * from master_apply', (err, result) => {
    if (err) throw err;

    res.send(result);
  });
});

  // 서버를 지정된 포트에서 실행합니다.
app.listen(PORT, () => {
  console.log(`SERVER 실행됨 ${PORT}`);
});