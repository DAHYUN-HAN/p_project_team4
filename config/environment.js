console.log('call : /config/environment.js');

module.exports = {
    PORT:4500,//포트번호
    DATABASE:"mongodb://localhost:27017/ReportDB",
    SERVICEKEY:"8f063591c58324099c9582cc9f57d9fc",
    MONGO_SESSION_COLLECTION_NAME:"sessions",
    SESSION_SECRET:"your_secret", //세션 암호화에 사용할 값 ->랜덤 숫자를 넣으면 됨.
    API_URL:"http://api.dbpia.co.kr/v2/search/search.xml",
 //   PAGINATION:{
 //       PAGE_SIZE:10
 //   }
};