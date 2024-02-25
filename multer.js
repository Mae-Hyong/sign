const multer = require("multer");

// Multer 설정을 수정하여 로컬 디렉토리에 저장하지 않도록 변경합니다.
const upload = multer();

module.exports = upload;