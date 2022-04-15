import axios from 'axios';
import cookie from "./cookie.js";
import api from "../../api/api.js";
export default {
    query: async function (input) {
        var yundzhToken = cookie.get('dzhtoken');
        var token = await api.getyundzhToken();
        cookie.set("dzhtoken", token, "d1");
        yundzhToken = token;
        var listResult = new Array();
        var list = await axios.get("https://gw.yundzh.com/kbspirit?token=" + yundzhToken + "&type=0,1&market=SH,SZ&output=json&input=" + input);
        var listEach = list.data.Data.RepDataJianPanBaoShuChu[0].JieGuo ? list.data.Data.RepDataJianPanBaoShuChu[0].JieGuo[0].ShuJu : null;

        if (!listEach || listEach.length == 0) {

        } else {
            listEach.forEach(function (n) {
                if(n.MingCheng)
                var item = {
                    "value": n.DaiMa,
                    "label": n.MingCheng
                };
                listResult.push(item);
            })
        }
        return listResult;
    }
}