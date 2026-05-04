const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (file.mimetype === 'model/gltf-binary' || path.extname(file.originalname).toLowerCase() === '.glb' || path.extname(file.originalname).toLowerCase() === '.gltf') {
      cb(null, 'server/ar-models/');
    } else {
      cb(null, 'server/uploads/');
    }
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB
  },
  fileFilter: (req, file, cb) => {
    const allowedImageTypes = /jpeg|jpg|png|gif|webp/;
    const allowedModelTypes = /model\/gltf-binary|glb|gltf/;
    
    const imageExt = allowedImageTypes.test(file.originalname.toLowerCase());
    const modelExt = path.extname(file.originalname).toLowerCase() === '.glb' || path.extname(file.originalname).toLowerCase() === '.gltf';
    
    if (imageExt || modelExt) {
      cb(null, true);
    } else {
      cb(new Error('Only images (jpg,png,webp) and 3D models (.glb,.gltf) allowed'), false);
    }
  }
});

module.exports = upload.single('file');
