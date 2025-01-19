const S3 = require("aws-sdk/clients/s3");
const bucketName = process.env.BUCKET_NAME;
const region = "ap-northeast-1";
const accessKeyId = process.env.ACCESS_KEY_ID;
const secretaccessId = process.env.SECRET_KEY;
//initialise instance of S3
const s3 = new S3({
  region,
  accessKeyId,
  secretaccessId,
});
exports.uploadToS3 = (data, filename) => {
  const params = {
    Bucket: bucketName,
    Key: filename,
    body: data,
    ACL: "public-read",
  };
  return new Promise((resolve, reject) => {
    s3.upload(params, (err, s3response) => {
      if (err) {
        console.log(err);
        reject(err);
      } else {
        console.log("success", s3response);
        resolve(s3response.Location);
      }
    });
  });
};
