var ServiceResponse = require('./ServiceResponse');
function ArticleClassResponse(entity,status){
    this.entity = entity;
    ServiceResponse.call(this,status);
}
module.exports = ArticleClassResponse;