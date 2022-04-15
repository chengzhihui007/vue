let OSS = require('ali-oss');

// let client = new OSS({
//   accessKeyId: 'LTAI4Fj3s66HrAkfegPKNEZw',
//   accessKeySecret: 'YpvC3P76I3iiTUM5Vc5YumMXlFoGLU',
// });
let client = new OSS({
  region: 'oss-cn-beijing',
  accessKeyId: 'LTAI4Fj3s66HrAkfegPKNEZw',
  accessKeySecret: 'YpvC3P76I3iiTUM5Vc5YumMXlFoGLU',
  bucket: 'hxg-file-cdn'
});

exports.ossput = async function (storeAs, file) {
  try {
    let result = await client.put(storeAs, file);
    return result;
  } catch (e) {
      console.log(e);
  }
}