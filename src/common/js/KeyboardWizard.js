import axios from 'axios';
import cookie from "./cookie.js";
import api from "../../api/api.js";
export default {
    query: async function (input) {
        var listResult = new Array();
        var list = await api.findPlates(input);
        console.log(JSON.stringify(list))
        var listEach = list.data
        if (!listEach || listEach.length == 0) {

        } else {
            listEach.forEach(function (n) {
                if(n.plateName)
                var item = {
                    "value": n.sectorCode,
                    "label": n.plateName
                };
                listResult.push(item);
            })
        }
        return listResult;
    },
    getBanKuai: async function (input) {
        var listResult = new Array();
        var list = await api.getBanKuai(input);
        var listEach = list
        if (!listEach || listEach.length == 0) {

        } else {
            listEach.forEach(function (n) {
                if(n.plateName)
                var item = {
                    "value": n.marketCode,
                    "label": n.plateName
                };
                listResult.push(item);
            })
        }
        return listResult;
    },
    find: async function (input) {
        var listResult = new Array();
        
        var list = await axios.get("https://newf10.ydtg.com.cn/apis/fis/v1/pcapp/qtd/sectorList?type=10&searchShortName=" + input + "&sectorCode"+ input +"&page=1&size=10");
        // console.log(JSON.stringify(list))
        var listEach = list.data.data
        if (!listEach || listEach.length == 0) {

        } else {
            listEach.forEach(function (n) {
                if(n.jc)
                var item = {
                    "value": n.dm,
                    "label": n.jc
                };
                listResult.push(item);
            })
        }
        return listResult;
    }
}