var ServiceResponse = require('./ServiceResponse');
function ArticleResponse(entity,status){
    this.entity = entity;
    ServiceResponse.call(this,status);
}
module.exports = ArticleResponse;