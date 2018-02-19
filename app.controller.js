/* 
    Parse & DB logic 
*/
const Parse = require('parse/node');
const moment = require('moment');
const bcrypt = require('bcrypt-nodejs');
const formatCurrency = require('format-currency')
const formatNum = require('format-num')

Parse.initialize('stackhouse');
Parse.serverURL = 'http://api.stackhouse.co.kr/parse'; 


var controller = {
    
    regist:(data)=>{
        return new Promise((resolve,reject)=>{
        });
    },
    socialLogin:(data)=>{
        // 회원가입 유무체크 후, 진행 
        return new Promise((resolve,reject)=>{
            //social login key
            var social_id = data.auth_id + "@" + data.auth_type + '.com'; 
            var social_pw = social_id;//bcrypt.hashSync(data.auth_id);
            console.log("social_pw:" + social_pw);
             

            var query = new Parse.Query(Parse.User);
            query.equalTo('username', social_id);
            query.count().then(
                count=>{
                    if(count > 0){
                        //있으면 로그인처리 후 리턴
                        Parse.User.logIn( social_id, social_pw ).then(
                            success=>{
                                // console.log(JSON.stringify(success));
                                resolve(success);
                            },
                            error=>{
                                reject(error);
                            }
                        )
                    }else{
                        //신규회원가입처리
                        var user = new Parse.User();
                        user.set("username", social_id);
                        user.set("password", social_pw);
                        user.set("email", social_id);
                        user.set("mail", data.auth_email); //mail도 같이 저장 
                        user.set("name", data.auth_name);
                        user.set("picture", data.auth_picture);
                        user.set("loginType", data.auth_type ); //타입 
                       
                    
                        user.signUp(null, {
                            success: function(result) {
                                resolve(result);
                            },
                            error: function(user, error){
                                reject(error);
                            }
                        });
                    }

                },
                error=>{
                    reject(error);
                }
            )
        });
    },
    login:(data)=>{
        return new Promise((resolve,reject)=>{
            Parse.User.logIn(data.username, data.password).then(
                success=>{
                    // console.log(JSON.stringify(success));
                    resolve(success);
                },
                error=>{
                    reject(error);
                }
            )
        });
    },

    appReferer:( data )=>{ 
        return new Promise((resolve,reject)=>{
            var AppReferer = Parse.Object.extend('AppReferer');
            var appReferer = new AppReferer();
            appReferer.save(data).then(
                result=>{
                    resolve(result);
                },
                (o,error)=>{
                    console.log(error);
                    reject(error);
                }
            )
        });
    },
    searchBoard:(q, no)=>{
        let pageNo = no || 1;
        let pageSize = 10;
        return new Promise((resolve,reject)=>{
            //값이 있을때만, 검색 
            if( q ){
                var q1 = new Parse.Query('Board');
                var q2 = new Parse.Query('Board');
                var q3 = new Parse.Query('Board');
                q1.matches('title', q);
                q2.matches('content', q); 
                q3.matches('tags', q); 
                
                var query = new Parse.Query.or(q1, q2, q3);

                query.equalTo('isOpen',true); //오픈된것만 검색 

                query.limit( pageSize);
                query.skip( pageSize * ( pageNo - 1));

                query.find().then(
                    result=>{ 
                        let list = [];
                        for(let item of result){
                            let _item = flat(item); 
                            _item.contentShort = contentShort( _item.content );
                            _item.category_uri = _item.category.replace(' ','');

                            var _inputDt = item.get('inputDt') ? item.get('inputDt') :  item.createdAt;// 입력일 또는 작성일 
                            _item.fromNow = moment( _inputDt ).fromNow();
                            _item.dateFormat = moment( _inputDt ).format('ll'); 


                            //이미지없는것 
                            if( !_item.mainImg ){
                                _item.mainImg = '/images/no-image.png';
                            }

                            list.push(_item);
                        }   
                        resolve(list);
                    },
                    error=>{
                        reject(error);
                        console.log(error);
                    }
                )
            }else{
                resolve([]); //empty
            }
        });
        
    },
    getEvents:()=>{
        console.log("getEvents()");
        return new Promise((resolve,reject)=>{
            var query = new Parse.Query('Event');
             query.find().then(
                result=>{
                    var list = flatArray(result);
                    // console.log(list);
                    resolve(list);
                },
                error=>{
                    console.log(error);
                    reject(error);
                }
            )
        });
    },
    getEvent:(id)=>{
        return new Promise((resolve,reject)=>{
            var query = new Parse.Query('Event');
             query.get(id).then(
                result=>{ 

                    var _item = flat(result);
                    var _inputDt = result.get('inputDt') ? result.get('inputDt') :  result.createdAt;// 입력일 또는 작성일 
                    _item.fromNow = moment( _inputDt ).fromNow();
                    _item.dateFormat = moment( _inputDt ).format('ll');

                    resolve(_item);
                    
                },
                error=>{
                    console.log(error);
                    reject(error);
                }
            )
        });
    },
    getTop:(category)=>{
        //20 page
        return new Promise((resolve,reject)=>{
            var query = new Parse.Query('Top');
            query.include('top1');
            query.include('top2');
            query.include('top3');
            query.include('video1');
            query.include('video2');
            query.include('video3');
            query.include('video4');
            query.include('top1.editor');
            query.include('top2.editor');
            query.include('top3.editor');
            query.include('video1.user');
            query.include('video2.user');
            query.include('video3.user');
            query.include('video4.user');

            query.equalTo('category', category );

            query.first().then(
                result=>{ 
                    var _item = flat(result);  

                    //category_uri 세팅
                    try{
                        _item.top1.category_uri = _item.top1.category.replace(' ','');
                        _item.top2.category_uri = _item.top2.category.replace(' ','');
                        _item.top3.category_uri = _item.top3.category.replace(' ','');
                    }catch(e){
                        console.error(e);
                    }
                    resolve(_item);
                },
                error=>{
                    console.log(error);
                    reject(error);
                }
            )
        });
    },
    getSTS:( user_id, no )=>{
        let pageNo = no || 1;
        let pageSize = 20;
        //20 page
        return new Promise((resolve,reject)=>{
            var query = new Parse.Query('Board');
            query.include('editor');
            query.include('user');
            query.equalTo('category','sts');

            //내껏만 가져올때 
            if( user_id ){
                query.equalTo('user', new Parse.User({objectId: user_id})); //user 
            }else{
                // 내것이 아닐때는 isOpen(승인여부) 확인하기 
                query.equalTo('isOpen',true);
            }

            query.descending('inputDt');

            query.limit( pageSize);
            query.skip( pageSize * ( pageNo - 1));
 
             query.find().then(
                result=>{
                    var list = flatArray(result);

                    var _list = [];
                    for(let item of list ){
                        var _item = item;
                        try{
                            _item.category_uri = item.category.replace(' ','');
                            _item.fromNow = moment( item.createdAt ).fromNow();
                            // console.log(_item.fromNow);
                            _list.push(_item);
                        }catch(e){
                            console.error(e);
                        }
                    }
                    // console.log(_list);
                    resolve(_list);
                },
                error=>{
                    console.log(error);
                    reject(error);
                }
            )
        });
    }, 
    getChannels:(category, no, size)=>{
        let pageNo = no || 1;
        let pageSize = size || 20;
        //20 page
        return new Promise((resolve,reject)=>{
            var query = new Parse.Query('Board');
            query.include('editor');

            query.limit( pageSize);
            query.skip( pageSize * ( pageNo - 1));

            query.descending('inputDt');

            
            query.equalTo('isOpen',true);
            

            if(category){
                query.equalTo('category', category );
                console.log('category', category);
            }
             query.find().then(
                result=>{ 

                    var _list = [];
                    for(let item of result ){
                        var _item = flat(item);
                        try{
                            if(_item.category){
                                _item.category_uri = _item.category.replace(' ','');
                            }else{
                                // 카테고리 없는것은 sts로 처리 
                                _item.category = 'sts';
                                _item.category_uri = 'sts';
                            }

                            //이미지없는것 
                            if( !_item.mainImg ){
                                _item.mainImg = '/images/no-image.png';
                            }
                            
                            var _inputDt = item.get('inputDt') ? item.get('inputDt') :  item.createdAt;// 입력일 또는 작성일 
                            _item.fromNow = moment( _inputDt ).fromNow();
                            _item.dateFormat = moment( _inputDt ).format('ll'); 

                            // console.log(_item.fromNow);
                            _list.push(_item);
                        }catch(e){
                            console.error(e);
                        }
                    }
                    // console.log(_list);
                    resolve(_list);
                },
                error=>{
                    console.log(error);
                    reject(error);
                }
            )
        });
    },

    getVideos:(category, no)=>{
        let pageNo = no || 1;
        let pageSize = 8;
        //20 page
        return new Promise((resolve,reject)=>{
            var query = new Parse.Query('Video');

            if(category){
                query.equalTo('category', category );
                console.log('category', category);
            }

            query.limit( pageSize);
            query.skip( pageSize * ( pageNo - 1));
 
             query.find().then(
                result=>{
                    var list = flatArray(result);

                    var _list = [];
                    for(let item of list ){
                        var _item = item;
                        try{ 
                            _list.push(_item);
                        }catch(e){
                            console.error(e);
                        }
                    }
                    // console.log(_list);
                    resolve(_list);
                },
                error=>{
                    console.log(error);
                    reject(error);
                }
            )
        });
    },

    getArticle:(id)=>{
        return new Promise((resolve,reject)=>{
           
            var query = new Parse.Query('Board');
            query.include('user');
            query.include('editor');
            query.get(id).then(
                result=>{
                    try{
                        var _item = flat(result);
                    
                        var _inputDt = result.get('inputDt') ? result.get('inputDt') :  result.createdAt;// 입력일 또는 작성일 
                        _item.fromNow = moment( _inputDt ).fromNow();
                        _item.dateFormat = moment( _inputDt ).format('ll'); 
                        // console.log(_item);

                        //editor정보에 social 등록여부 확인 (facebook,instargram 둘 다 없으면 호출)
                        _item.needSocialAccount = true;
                        if( _item.editor.instagram || _item.editor.facebook){
                            _item.needSocialAccount = false; 
                        }

                        //og데이터를 위한 콘텐츠
                        _item.content_text = stripHTML( _item.content );
                        //뷰카운터 천단위 숫자표시 
                        _item.view = formatNum( _item.view || 1 ); 

                        //tag array변환 
                        _item.tagsArr = _item.tags ? _item.tags.split(',') : [];

                        //뷰카운터 올리기
                        result.increment('view');
                        result.save().then(
                            success=>{
                                resolve(_item);
                            },
                            (o,error)=>{
                                reject(error);
                            });

                        
                    }catch(e){
                        console.error(e);
                        reject(e);
                    }  
                },
                (o,error)=>{
                    console.log(error);
                    reject(error);
                }
            ) 
        
        });
    },
    getYoutubeStack:(category)=>{

        return new Promise((resolve,reject)=>{
            var query = new Parse.Query('Youtube');
            query.ascending('rank');
            if(category){
                query.equalTo('category', category );
                console.log('category', category);
            }
             query.find().then(
                result=>{
                    var list = [];
                    for(let item of result ){
                        try{
                            var _item = JSON.parse( JSON.stringify(item) );
                            _item.category_uri = _item.category.replace(' ','');
                            _item.fromNow = moment( item.get('inputDt') ).fromNow();

                            // console.log(_item.fromNow); 

                            // 날짜처리 
                            list.push(_item);

                        }catch(e){
                            console.error(e);
                        }
                    }
                    // console.log(list);
                    resolve(list);
                },
                error=>{
                    console.log(error);
                    reject(error);
                }
            )
        });
    },
}
module.exports = controller;


// Helpers
function flat(result){
    return JSON.parse(JSON.stringify(result));
}
function flatArray(result){
    return JSON.parse(JSON.stringify(result));
}
function contentShort(str){
    str = str.replace(/<(?:.|\n)*?>/gm, ''); //remove Tags
    str = str.substring(0,140);
    return str; 
}  
function stripHTML(str){
    str = str.replace(/<(?:.|\n)*?>/gm, ''); //remove Tags
    return str;
}