const cloudinary = require('cloudinary').v2;
const streamifier = require('streamifier');

//Cloudinary 
cloudinary.config({ 
  cloud_name: 'dcj6ct5ea', 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET
});
//End Cloudinary

module.exports.upload = (req, res, next) => {
    if (req.file) {
        let streamUpload = (req) => {
            return new Promise((resolve, reject) => {
                let stream = cloudinary.uploader.upload_stream(
                    (error, result) => {
                        if (result) {
                            resolve(result);
                        } else {
                            reject(error);
                        }
                    }
                );
                streamifier.createReadStream(req.file.buffer).pipe(stream);
            });
        };
        async function upload(req) {
            let result = await streamUpload(req);
            req.body[req.file.fieldname] = result.url;
            console.log(req.body);
            next();
        }
        upload(req);
    } else{
        next();
    }
}