var Wilddog = require("wilddog");
var config = {
  syncURL: "https://ydlive.wilddogio.com",
  authDomain: "ydlive.wilddog.com"
};
Wilddog.initializeApp(config);
var w_sync = wilddog.sync()
export default w_sync