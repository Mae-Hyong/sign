const express = require('express');
const bcrypt = require('bcrypt');
const upload = require("./multer");
const fs = require('fs'); // fs 모듈을 추가
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

app.post('/apply', async (req, res) =>{
  const{ eMail, companyName, applyStatus, buisnessNumber, userName } = req.body;
  const query = 'INSERT INTO master_apply (user_name, company_name, buisness_number, company_location, apply_status) VALUES (?, ?, ?, ?, ?)'
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

app.post("/profile_update", upload.single("file"), async (req, res, next) => {
  console.log(req.file);
  const { userId, userName } = req.body;

  try {
    let userImage = null;
    if (req.file) {
      userImage = req.file.path;
    }

    // 사용자 이름과 이미지 URL을 업데이트하는 쿼리를 생성합니다.
    const updateQuery = "UPDATE user_info SET user_name = ?, user_image = ? WHERE user_id = ?";
    
    db.query(updateQuery, [userName, userImage, userId], (err, result) => {
      if (err) {
        console.error("Error updating user info in database:", err);
        return res.status(500).json({
          resultCode: 500,
          resultMsg: "회원 정보를 업데이트하는 도중 오류가 발생했습니다.",
          error: err.message
        });
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({
          resultCode: 404,
          resultMsg: "해당하는 사용자를 찾을 수 없습니다.",
        });
      }

      return res.json({
        resultCode: 200,
        resultMsg: "회원 정보 업데이트 성공",
      });
    });
  } catch (error) {
    console.error("Error uploading image to Cloudinary:", error);
    return res.status(500).json({
      resultCode: 500,
      resultMsg: "이미지를 Cloudinary에 업로드하는 도중 오류가 발생했습니다.",
      error: error.message
    });
  }
});

app.get("/user_info", (req, res) => {
  const userId = req.query.user_id;
  if (!userId) {
    return res.status(400).json({
      resultCode: 400,
      resultMsg: "사용자 ID를 제공해야 합니다.",
    });
  }

  const selectQuery = "SELECT user_name, user_image FROM user_info WHERE user_id = ?";
  
  db.query(selectQuery, [userId], (err, result) => {
    if (err) { 
      console.error("Error fetching user image from database:", err);
      return res.status(500).json({
        resultCode: 500,
        resultMsg: "사용자 이미지를 조회하는 도중 오류가 발생했습니다.",
      });
    }

    if (result.length === 0) {
      return res.status(404).json({
        resultCode: 404,
        resultMsg: "해당하는 사용자의 이미지를 찾을 수 없습니다.",
      });
    }

    const userImage = result[0].user_image;
    return res.json({
      resultCode: 200,
      userImage: userImage,
    });
  });
});

// 서버를 지정된 포트에서 실행합니다.
app.listen(PORT, () => {
  console.log(`SERVER 실행됨 ${PORT}`);
});