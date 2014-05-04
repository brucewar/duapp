/**
 * cofig of my page
 */

exports.config = {
  //page info
  name: "brucewar",
  email: 'wjl891014@gmail.com',
  version: "0.0.1",
  host: "www.brucewar.com",
  port: "18080",
  session_secret: "mypagebybrucewar",
  max_age: 3600000 * 24 * 30,

  page_limit: 10,

  //db info
  db: {
    user_name: "",
    password: "",
    host: "127.0.0.1",
    port: 27017,
    name: "mypage"
  },

  //local test db
  local_db: "mongodb://127.0.0.1/mypage",

  //mail options
  mail_opts: {
    host: 'smtp.163.com',
    port: 25,
    auth: {
      user: 'brucewar@163.com',
      pass: 'wjl8175803'
    }
  }
};