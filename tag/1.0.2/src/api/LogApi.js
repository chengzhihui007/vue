import axios from 'axios';
import {post} from "../common/js/axios_promise";

const urlEncode = function (data, isPrefix = false) {
    let prefix = isPrefix ? '?' : ''
    let _result = []
    for (let key in data) {
      let value = data[key]
      // 去掉为空的参数
      if (['', undefined, null].includes(value)) {
        continue
      }
      if (value.constructor === Array) {
        value.forEach(_value => {
          _result.push(encodeURIComponent(key) + '[]=' + encodeURIComponent(_value))
        })
      } else {
        _result.push(encodeURIComponent(key) + '=' + encodeURIComponent(value))
      }
    }
    return _result.length ? prefix + _result.join('&') : ''
  }
 


let base = 'https://ydlog-api.yd.com.cn';


export default {
    //数据统计
    findLogin(obj){
    return get(base+"/dataStatistics/login?"+urlEncode(obj), {headers: {"Content-Type": 'application/json'}});
},
findPlateByPage(obj){
    return get(base+"/dataStatistics/plate?"+urlEncode(obj), {headers: {"Content-Type": 'application/json'}});
},
findFunctionByPage(obj){
    return get(base+"/dataStatistics/function?"+urlEncode(obj), {headers: {"Content-Type": 'application/json'}});
},
findActivityByPage(obj){
    return get(base+"/dataStatistics/activity?"+urlEncode(obj), {headers: {"Content-Type": 'application/json'}});
}
}

async function get(url) {
    try{
        let body = await axios.get(url);
        return body.data;
    }catch (err){
        console.log(err);
    }

}


