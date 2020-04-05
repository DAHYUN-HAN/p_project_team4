const mongoose = require('mongoose');
const Schema   = require('mongoose').Schema;

console.log('call: /models/saveword.js');

const SavewordSchema = new Schema({
	word: {type: String, default: '', trim: true},//음식종류
    user: {type: String, default: ''},//작성자 정보
	createdAt: {type: Date, default: Date.now}//작성 시간
});


SavewordSchema.statics = {
    //선택한 글 정보
	load: function (user, cb) {
		this.findOne({user})
		    .exec(function (err, db) {
			    cb(db)
		    });
	},
    //전체 글 정보
	list: function (cb) {
		this.find({}).sort({createdAt: -1}).exec(function (err, foods) {
			cb(foods)
		});
	},
    //10개 단위 글 정보
    list10: function (num, cb) {
		this.find({}).sort({createdAt: -1}).skip(10*(num-1)).limit(10).exec(function (err, foods) {
			cb(foods)
		});
	},
    //내가 작성한 글 전체 정보
    myword: function (user, cb) {
		this.find({user}).sort({createdAt: -1}).exec(function (err, foods) {
			cb(foods)
		});
	},
    //DB에 저장된 데이터 개수
    count: function (cb) {
		this.find({}).count().exec(function (err, count) {
			cb(count)
		});
	},
}

SavewordSchema.path('word').required(true, '단어는 필수사항입니다');

mongoose.model('Saveword', SavewordSchema);
