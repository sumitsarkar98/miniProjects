import multer from "multer";

//The disk storage engine gives you full control on storing files to disk using multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/temp");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

export const upload = multer({ storage });

/*
// customize file name
filename: function (req, file, cb) {
  const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
  cb(null, file.fieldname + "-" + uniqueSuffix);
}
*/
