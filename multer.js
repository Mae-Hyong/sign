const multer = require("multer");

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "C:/Node/user_image");
  },
  filename: function (req, file, cb) {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
    const day = currentDate.getDate().toString().padStart(2, '0');
    const hours = currentDate.getHours().toString().padStart(2, '0');
    const minutes = currentDate.getMinutes().toString().padStart(2, '0');
    const seconds = currentDate.getSeconds().toString().padStart(2, '0');

    const timestamp = `${year}-${month}-${day}_${hours}-${minutes}-${seconds}`;
    const originalnameWithoutSpaces = file.originalname.replace(/\s/g, '_'); // 공백을 언더스코어(_)로 대체
    const newFilename = `${timestamp}_${originalnameWithoutSpaces}`;
    cb(null, newFilename);
  },
});

const upload = multer({ storage: storage });

module.exports = upload;