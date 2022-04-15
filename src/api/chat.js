var Wilddog = require("wilddog");
const service = {
  msgArr:[],
  userlist:[],
}
var config = {
  syncURL: "https://ydlive.wilddogio.com",
  authDomain: "ydlive.wilddog.com"
};
Wilddog.initializeApp(config);
var ref = wilddog.sync().ref("roomguandian/talk");
ref.orderByKey().limitToLast(1000).on('child_added', function(snap) {
  var json = snap.val();  
  if(service.userlist.indexOf(json.uid) == -1 && json.group != 12){    
    service.userlist.unshift(json.uid);
    service.msgArr.unshift(json)
  }else{
    var ud = json.uid
    service.msgArr.forEach(element => {
      if(element.uid == ud){  
        element.contents = json.contents;
        element.createtime = json.createtime;
        element.role = ''
      }            
    });
        
    if(json.group == 12){
      service.msgArr.forEach(element => {        
        if(json.to == element.uid){          
          element.contents = json.contents;
          element.createtime = json.createtime;
          element.role = json.group;
        }            
      });
    }
  }   
  // service.msgArr.unshift(snap.val())
  

})
export default service
