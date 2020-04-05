/* 라우팅 함수 선언[main] */

/* mongoose 모듈 참조 */
const mongoose = require('mongoose');
//mongoose.Promise = Promise;

/* Model 불러오기*/
const User = mongoose.model('User');
const Saveword = mongoose.model('Saveword');
const only = require('only');//object중 원하는 데이터만 sorting하여 리턴하는 helper 모듈

var status = new Object();
status={"print":"메인화면", "link":"location.href ='/'"};//로그인을 했을 경우 어떤 화면에서든 메인화면으로 돌아올 수 있게 함


const {API_URL, SERVICEKEY} = require('../../config/environment');
const request = require('request-promise');

const convert = require('xml-js');

console.log('call : /controllers/main.js');

//웹 메인 화면 index. 주요 기능 집합 화면
exports.index = function (req, res) {
    const isLogin = req.isAuthenticated(); //로그인 여부 확인.
    var statusi = new Object(); //index 화면에서는 로그인시 마이페이지로 갈 수 있게 함.
        if(isLogin) {
            User.load(req.user.email, function (user) { //로그인 한 사용자 정보
                if(user.admin){//관리자가 로그인 했다면 관리자 모드로 연결할 수 있게 함.
                    statusi={"print":"관리자모드", "link":"location.href ='/adminpage'"};
                } else {//일반 사용자가 로그인 했다면 마이페이지로 연결할 수 있게 함.
                    statusi={"print":"마이페이지", "link":"location.href ='/mypage'"};
                }
                res.render('main/index', {//index.hbs와 랜더링
                    isUserLogedIn: isLogin, user: user, status:statusi
                });
            });
        } else {
            res.render('main/index', {
                isUserLogedIn: isLogin
            });
        }
};

module.exports.helper = async function (req, res) {
    const isLogin = req.isAuthenticated();
    console.log("레포트 내용",req.body.content);
    
    var xdc={'apiId': "gachon.pproject.46131529c35d2",
            'apiKey': "3ece068b5b084f83b54796fa15e562a2",
            'context': req.body.content}
    const XDCResult = await request.post({
        headers: {'Content-Type': 'application/json'},
        url: "https://api.maum.ai/api/bert.xdc",
        body:xdc,
        json: true
    }).then((result) => {
        console.log(result);
        return result
    }).catch(e => {
        console.error("request Error : " + e)
    });
    
    if(XDCResult.message.status == 0) {
    
    var firstword = "";
    var secondword = "";
    var thirdword = "";
    
    var firstsentence = "";
    var secondsentence = "";
    
    console.log(XDCResult.wordIndices[0].startIdx);
    console.log(XDCResult.wordIndices[0].endIdx);
    
    for(var i = parseInt(XDCResult.wordIndices[0].startIdx); i < parseInt(XDCResult.wordIndices[0].endIdx); i++) {
        firstword += req.body.content[i];
    }
    for(var i = parseInt(XDCResult.wordIndices[1].startIdx); i < parseInt(XDCResult.wordIndices[1].endIdx); i++) {
        secondword += req.body.content[i];
    }
    for(var i = parseInt(XDCResult.wordIndices[2].startIdx); i < parseInt(XDCResult.wordIndices[2].endIdx); i++) {
        thirdword += req.body.content[i];
    }
        
        
    var firstblank = "";
    var secondblank = "";
    var thirdblank = "";
    
    for(var i = 0; i < parseInt(XDCResult.sentenceIndices[0].startIdx); i++) {
        firstblank += req.body.content[i];
    } 
    for(var i = parseInt(XDCResult.sentenceIndices[0].startIdx); i < parseInt(XDCResult.sentenceIndices[0].endIdx); i++) {
        firstsentence += req.body.content[i];
    }
    for(var i = parseInt(XDCResult.sentenceIndices[0].endIdx); i < parseInt(XDCResult.sentenceIndices[1].startIdx); i++) {
        secondblank += req.body.content[i];
    }
    for(var i = parseInt(XDCResult.sentenceIndices[1].startIdx); i < parseInt(XDCResult.sentenceIndices[1].endIdx); i++) {
        secondsentence += req.body.content[i];
    }
    for(var i = parseInt(XDCResult.sentenceIndices[1].endIdx); i < req.body.content.length; i++) {
        thirdblank += req.body.content[i];
    }
        
    //console.log(req.body.content.length);
    
    console.log(XDCResult.labels[0].label);
    console.log(XDCResult.labels[1].label);
    console.log(XDCResult.labels[2].label);
    console.log(firstsentence);
    console.log(secondsentence);
    console.log(firstblank);
    console.log(secondblank);
    console.log(thirdblank);
    
    var resultword1 = XDCResult.labels[0].label;
    var resultword2 = XDCResult.labels[1].label;
    var resultword3 = XDCResult.labels[2].label;
    
    /* 조회결과 응답(reqInfo/result.hbs 뷰 템플릿 랜더링) */
    if(isLogin) {
            User.load(req.user.email, function (user) {
                User.list(function (users) {
                    res.render('main/helper', {
                        isUserLogedIn: isLogin, user: user, status:status, users:users, content:req.body.content, firstword:firstword, secondword:secondword, thirdword:thirdword, firstsentence:firstsentence, secondsentence:secondsentence, resultword1:resultword1, resultword2:resultword2, resultword3:resultword3, firstblank:firstblank, secondblank:secondblank, thirdblank:thirdblank
                    });
                });
            });
        } else {
        res.render('main/helper', {
            isUserLogedIn: isLogin, status:status, content:req.body.content, firstword:firstword, secondword:secondword, thirdword:thirdword, firstsentence:firstsentence, secondsentence:secondsentence, resultword1:resultword1, resultword2:resultword2, resultword3:resultword3, firstblank:firstblank, secondblank:secondblank, thirdblank:thirdblank
        });
        }
        
    }
    
    else {
        if(isLogin) {
            User.load(req.user.email, function (user) {
                User.list(function (users) {
                    res.render('main/index', {
                        isUserLogedIn: isLogin, user: user, status:status, users:users, content:req.body.content
                    });
                });
            });
        } else {
        res.render('main/index#portfolio', {
            isUserLogedIn: isLogin, status:status, content:req.body.content
        });
        }
        
    }
    
};

module.exports.sum_result = async function (req, res) {
    const isLogin = req.isAuthenticated();
    console.log("레포트 내용",req.body.Summarycontent);
    console.log(req.body.inputquestion);
    
    var mrc={'apiId': "gachon.pproject.46131529c35d2",
            'apiKey': "3ece068b5b084f83b54796fa15e562a2",
            'lang':"kor",
            'context': req.body.Summarycontent,
            'question': req.body.inputquestion}
    
    const MRCResult = await request.post({
        headers: {'Content-Type': 'application/json'},
        url: "https://api.maum.ai/api/bert.mrc/",
        body:mrc,
        json: true
    }).then((result) => {
        console.log(result);        
        return result
    }).catch(e => {
        console.error("request Error : " + e)
    });

    /*문자열 패턴구하기*/
    var pattern = MRCResult.answer;
    var re = new RegExp(pattern, "g");
    //문자열구하기
    var searchString = req.body.Summarycontent;//원본
   // console.log(searchString)
    
    var result = re.exec(searchString);
   /* console.log(result);
    console.log("startIdx:")
    console.log(result.index);
    console.log("endIdx:")
    console.log((pattern.length)+(result.index))*/
    
    var answersentence1="";
    var answersentence2="";
    var answersentence3="";
    
    if(result!=null){
    var answerStartIdx = parseInt(result.index);
    var answerEndIdx = parseInt((pattern.length)+(result.index));
    var lastidx = parseInt(searchString.length); 
    
    console.log(searchString[answerStartIdx])
    console.log(searchString[answerEndIdx])
    
    for(var i=0; i<answerStartIdx; i++){
        answersentence1 += searchString[i];
    }
    
    for(var i =answerStartIdx; i < answerEndIdx; i++) {
        answersentence2 += searchString[i];
    }
    
    for(var i =answerEndIdx; i <lastidx ; i++) {
        answersentence3 += searchString[i];
    }
    
    }else{
        answersentence1=searchString;
    }
    
    
    /* 조회결과 응답(reqInfo/result.hbs 뷰 템플릿 랜더링) */
    if(isLogin) {
            User.load(req.user.email, function (user) {
                User.list(function (users) {
                    res.render('main/sum_result', {
                        isUserLogedIn: isLogin, user: user, status:status, users:users, content:req.body.Summarycontent, answer:MRCResult.answer, question:req.body.inputquestion,
                         answersentence1: answersentence1, answersentence2: answersentence2, answersentence3: answersentence3

                    });
                });
            });
        } else {
        res.render('main/sum_result', {
            isUserLogedIn: isLogin, status:status, content:req.body.Summarycontent, anser:MRCResult, answer:MRCResult.answer, question:req.body.inputquestion,
             answersentence1: answersentence1, answersentence2: answersentence2, answersentence3: answersentence3
        });
        }
};

module.exports.report_list2 = async function (req, res) {
    const isLogin = req.isAuthenticated();
    console.log("report list 실행");
    console.log(req.params.id);
    
    const reportResult = await request.get({
        url: API_URL,
        timeout: 10000,
        xml: true,
        qs: {
            'target': "se",
            'key': SERVICEKEY,
            'sorttype':"3",
            'pagecount':"10",
            'pagenumber':1,
            'searchall': req.params.id,
        },
    }).then((result) => {
        //console.log(result)
        return result
    }).catch(e => {
        console.error("request Error : " + e)
    });
    var xmlToJson = convert.xml2json(reportResult, {compact: true, spaces: 4});
    obj = JSON.parse(xmlToJson);
    //console.log(obj.root.paramdata.totalcount._text);
    var totalcount = parseInt(obj.root.paramdata.totalcount._text);

    //검색된 전체 도서 갯수를 통해 페이징 구현
    var last5 = parseInt((totalcount/50)*5);
    var last = parseInt(((totalcount-1)/10)+1);
    
    var page = 1;
    console.log(page);
    if(page <= last5) {
        var defaultpage = (parseInt((page-1)/5)*5+1);
        var pageArray = [ defaultpage, defaultpage+1, defaultpage+2, defaultpage+3, defaultpage+4 ];
        console.log(defaultpage);
    }
    else {
        var etc = last-last5;
        var defaultpage = (parseInt((page-1)/5)*5+1);
        switch(etc) {
            case 1:
                var pageArray = [ defaultpage];
                break;
            case 2:
                var pageArray = [ defaultpage, defaultpage+1];
                break;
            case 3:
                var pageArray = [ defaultpage, defaultpage+1, defaultpage+2];
                break;
            case 4:
                var pageArray = [ defaultpage, defaultpage+1, defaultpage+2, defaultpage+3];
                break;
        }
    }
    
    var print = new Object();
    for(var i=0; i<pageArray.length; i++) {
        if(parseInt(1) == pageArray[i]) {
            print[i] = { "page": pageArray[i], "Status": "active" };
        } else {
            print[i] = { "page": pageArray[i], "Status": "" };
        }
    }
    if(parseInt(1) <= 5) {
        var first = "disabled";
        var second = "";
    } else if(parseInt(1) > last5) {
        var first = "";
        var second = "disabled";
    } else {
        var first = "";
        var second = "";
    }
    
    /* 조회결과 응답(reqInfo/result.hbs 뷰 템플릿 랜더링) */
    if(isLogin) {
            User.load(req.user.email, function (user) {
                User.list(function (users) {
                    res.render('main/report_list', {
                        isUserLogedIn: isLogin, user: user, status:status, users:users, first: first, second: second, print: print, pageNo: page, inputselectword:req.params.id, obj:obj
                    });
                });
            });
        } else {
        res.render('main/report_list', {
            isUserLogedIn: isLogin, status:status, first: first, second: second, print: print, pageNo: page, inputselectword:req.params.id, obj:obj
        });
        }
};


module.exports.report_list = async function (req, res) {
    const isLogin = req.isAuthenticated();
    console.log("report list 실행");
    console.log(req.body.inputselectword);
    
    const reportResult = await request.get({
        url: API_URL,
        timeout: 10000,
        xml: true,
        qs: {
            'target': "se",
            'key': SERVICEKEY,
            'sorttype':"3",
            'pagecount':"10",
            'pagenumber':req.body.pageNo,
            'searchall': req.body.inputselectword,
        },
    }).then((result) => {
        //console.log(result)
        return result
    }).catch(e => {
        console.error("request Error : " + e)
    });
    var xmlToJson = convert.xml2json(reportResult, {compact: true, spaces: 4});
    obj = JSON.parse(xmlToJson);
    //console.log(obj.root.paramdata.totalcount._text);
    var totalcount = parseInt(obj.root.paramdata.totalcount._text);

    //검색된 전체 도서 갯수를 통해 페이징 구현
    var last5 = parseInt((totalcount/50)*5);
    var last = parseInt(((totalcount-1)/10)+1);
    
    var page = parseInt(req.body.pageNo);
    console.log(page);
    if(page <= last5) {
        var defaultpage = (parseInt((page-1)/5)*5+1);
        var pageArray = [ defaultpage, defaultpage+1, defaultpage+2, defaultpage+3, defaultpage+4 ];
        console.log(defaultpage);
    }
    else {
        var etc = last-last5;
        var defaultpage = (parseInt((page-1)/5)*5+1);
        switch(etc) {
            case 1:
                var pageArray = [ defaultpage];
                break;
            case 2:
                var pageArray = [ defaultpage, defaultpage+1];
                break;
            case 3:
                var pageArray = [ defaultpage, defaultpage+1, defaultpage+2];
                break;
            case 4:
                var pageArray = [ defaultpage, defaultpage+1, defaultpage+2, defaultpage+3];
                break;
        }
    }
    
    var print = new Object();
    for(var i=0; i<pageArray.length; i++) {
        if(parseInt(req.body.pageNo) == pageArray[i]) {
            print[i] = { "page": pageArray[i], "Status": "active" };
        } else {
            print[i] = { "page": pageArray[i], "Status": "" };
        }
    }
    if(parseInt(req.body.pageNo) <= 5) {
        var first = "disabled";
        var second = "";
    } else if(parseInt(req.body.pageNo) > last5) {
        var first = "";
        var second = "disabled";
    } else {
        var first = "";
        var second = "";
    }
    
    /* 조회결과 응답(reqInfo/result.hbs 뷰 템플릿 랜더링) */
    if(isLogin) {
            User.load(req.user.email, function (user) {
                User.list(function (users) {
                    res.render('main/report_list', {
                        isUserLogedIn: isLogin, user: user, status:status, users:users, first: first, second: second, print: print, pageNo: req.body.pageNo, inputselectword:req.body.inputselectword, obj:obj
                    });
                });
            });
        } else {
        res.render('main/report_list', {
            isUserLogedIn: isLogin, status:status, first: first, second: second, print: print, pageNo: req.body.pageNo, inputselectword:req.body.inputselectword, obj:obj
        });
        }
};



exports.mypage = function (req, res) {
    const isLogin = req.isAuthenticated();
    if(isLogin) {
        User.load(req.user.email, function (user) {
            Saveword.myword(req.user.email, function (saveword) {
                res.render('main/mypage', {
                    saveword:saveword, alert: req.flash(), user:user, isUserLogedIn: isLogin, status:status
                });
            });
        });
    }
};

exports.savewordindb = function (req, res) {
    
    console.log(req.body.inputselectword);
    console.log(req.body.user);
    
    var saveword = new Saveword();
    saveword.word = req.body.inputselectword;
    saveword.user = req.body.user;
    
    saveword.save(function (err, result) {
        if (err) {
            console.log("에러!!");
            res.sendStatus(400)
        }
        else {
            res.redirect('/mypage');
        }
    });
};

exports.deleteword = function (req, res) {
    console.log(req.body.id);
    Saveword.remove({
        _id: req.body.id
    }, function (err, result) {
        if (err) return res.send(err);
        res.sendStatus(200)
    });
};