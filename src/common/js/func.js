/**
 * Created by Administrator on 2017/8/10.
 */


/*
* 分页查询公共方法
* */
export async function pageTool(data,params) {
    try{

        let pageNo=params.pageNo;
        let pageSize=params.pageSize;

        let pageData =await data.filter((u, index) => index < pageSize * pageNo && index >= pageSize * (pageNo - 1));

        return pageData;
    }catch (err){
        console.log(err);
    }

}