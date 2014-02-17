var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// 数据库配置信息
//var db_name = 'BgFAYlVRhMgfsPhvkzMh';                  // 数据库名，从云平台获取
//var db_host =  process.env.BAE_ENV_ADDR_MONGO_IP;     // 数据库地址
//var db_port =  process.env.BAE_ENV_ADDR_MONGO_PORT;  // 数据库端口
//var username = process.env.BAE_ENV_AK;                // 用户名
//var password = process.env.BAE_ENV_SK;				// 密码
////'mongodb://username:password@host:port/database
//mongoose.connect("mongodb://"+username+":"+password+"@"+db_host+":"+db_port+"/"+db_name);
mongoose.connect("mongodb://localhost/mypage");

var ObjectId = mongoose.Schema.Types.ObjectId;

var ArticleClassModel = mongoose.model('articleclass',{
    name:String
});
module.exports.ArticleClass = ArticleClassModel;

var ArticleModel = mongoose.model('article',{
    title:String,
    content:String,
    time:{type:Date,default:Date.now},
    readCount:{type:Number,default:0},
    articleClass_id:{type:ObjectId,ref:'articleclass'}
});
module.exports.Article = ArticleModel;
