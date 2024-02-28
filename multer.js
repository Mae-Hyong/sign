const multer = require("multer");

// 디스크에 파일을 저장하는 storage 설정
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'user_image/') // 파일이 저장될 디렉토리를 지정합니다.
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname) // 파일의 원래 이름을 사용합니다.
  }
});

const upload = multer({ storage: storage });

module.exports = upload;