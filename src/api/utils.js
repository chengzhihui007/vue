let OSS = require('ali-oss');

let client = new OSS({
});

exports.ossput = async function (storeAs, file) {
  try {
    let result = await client.put(storeAs, file);
    return result;
  } catch (e) {
      console.log(e);
  }
}
