const multer = require("multer");
const cloudinary = require('cloudinary').v2;  // cloudinary instance
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const { v4 } = require("uuid");
require('dotenv').config();

// import Cloudinary storage


cloudinary.config({ 
    cloud_name: 'htqoudlxz', 
    api_key: '916439993188377', 
    api_secret: 'xFJiNTT5JjB8B7MWT_z3qLbmbNg' 
});


// var storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, "C:/Node/user_image");
//   },

//   filename: function (req, file, cb) {
    // const currentDate = new Date();
    // const year = currentDate.getFullYear();
    // const month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
    // const day = currentDate.getDate().toString().padStart(2, '0');
    // const hours = currentDate.getHours().toString().padStart(2, '0');
    // const minutes = currentDate.getMinutes().toString().padStart(2, '0');
    // const seconds = currentDate.getSeconds().toString().padStart(2, '0');

    // const timestamp = `${year}-${month}-${day}_${hours}-${minutes}-${seconds}`;
    // const originalnameWithoutSpaces = file.originalname.replace(/\s/g, '_'); // 공백을 언더스코어(_)로 대체
    // const newFilename = `${timestamp}_${originalnameWithoutSpaces}`;
//     cb(null, newFilename);
//   },
// });

const currentDate = new Date();
const year = currentDate.getFullYear();
const month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
const day = currentDate.getDate().toString().padStart(2, '0');
const hours = currentDate.getHours().toString().padStart(2, '0');
const minutes = currentDate.getMinutes().toString().padStart(2, '0');
const seconds = currentDate.getSeconds().toString().padStart(2, '0');

const timestamp = `${year}-${month}-${day}_${hours}-${minutes}-${seconds}`;


const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params:{
      folder:'user_images',
      allowedFormats: ['jpeg', 'png', 'jpg'],
      public_id: (req, file) => {
        return timestamp + "_" + v4()
      },
  },
});

const upload = multer({ storage: storage });



module.exports = upload;