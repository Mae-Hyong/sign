const multer = require("multer");

// multer의 storage 옵션을 사용하지 않고, memoryStorage를 사용하여 파일을 메모리에 저장합니다.
const storage = multer.memoryStorage();

const upload = multer({ storage: storage });

module.exports = upload;