const auth = require("../app/controllers/AuthController");

//관련 모듈 참조

const main =  require('../app/controllers/main');
const multer = require('multer');
const path = require('path');
const mongoose = require('mongoose');

console.log('call: /config/routes.js');

/* multer.diskStorage() 메서드로 파일 업로드를 위한 multer 설정*/
const storage = multer.diskStorage({
	// 업로드할 폴더
	destination: './public/uploads/',
	/*저장할 파일명의 중복울 막기 위해 filename 속성으로 고유한 파일이름으로 변경 */
	filename: function (req, file, cb) {
        console.log("file: ", file);
        console.log("cb: ", cb);
        
		/* ObjectId()는 절대로 중복될 수 없도록 고안된 값(저장시 파일명 중복 방지)*/
		file.uploadedFile = {
			name: mongoose.Types.ObjectId(),
			ext: file.mimetype.split('/')[1]
		};
        //cb(null, 저장파일명)
		cb(null, file.uploadedFile.name + '.' + file.uploadedFile.ext);
	}
});

// multer 설정값을 바탕으로 초기화를 진행합니다. 
const uploads = multer({ storage: storage });

// 라우팅 함수 설정
/* app.js 파일에서 "app"을 인자로 받음 */
module.exports = function (app, passport){
	app.get('/', main.index);//홈페이지 메인 화면
    app.get('/mypage', main.mypage);//개인서재 화면
    
    app.post('/helper', main.helper);
    app.post('/sum_result', main.sum_result);
    app.post('/report_list', main.report_list);
    app.get('/report_list/:id', main.report_list2);
    app.post('/savewordindb', main.savewordindb);
    
    app.post('/deleteword', main.deleteword);//리뷰 삭제를 위한 라우팅
    
    app.get('/login', auth.login);//로그인
    app.get('/signup', auth.signup);//회원가입
    app.get('/logout', auth.logout);//로그아웃
    app.get('/signout', auth.signout);//회원탈퇴
    
    /* form 유저로그인 */
    app.post("/login_user", passport.authenticate('local', {
        successRedirect : '/',
        failureRedirect: '/login',
        failureFlash:true
    }),auth.checkUserLogin);
    
    /*회원 탈퇴*/
    app.post("/signout_user", passport.authenticate('local', {
        
        successRedirect : '/signout',
        failureRedirect: '/mypage#signout',
        failureFlash:true
    }));

    /* 유저생성*/
    app.post('/create', auth.create);
};