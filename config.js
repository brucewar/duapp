/**
 * cofig of my page
 */

exports.config = {
  //page info
  name: "My_Page",
  version: "0.0.1",
  host: "localhost",
  port: "18080",
  session_secret: "mypagebybrucewar",
  max_age: 3600000 * 24 * 30,

  //db info
  db: {
    user_name: "prjcuLAqrarGhhCAhG1tksC5",
    password: "th7vKYACQVIC7Q4EWOs3qGEBYADda2bt",
    host: "mongo.duapp.com",
    port: 8908,
    name: "BgFAYlVRhMgfsPhvkzMh"
  },

  //local test db
  local_db: "mongodb://127.0.0.1/mypage"
};