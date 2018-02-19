/*
  Router
*/
var express = require('express');
var router = express.Router();
var db = require('./app.controller');
var async = require("async");
var requestIp = require('request-ip');
var useragent = require('express-useragent');
 
//social
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var NaverStrategy = require('passport-naver').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;
var KakaoStrategy = require('passport-kakao').Strategy;
var config = require('./app.config');



var auth = require('./routes/auth');
router.use('/auth', auth);

// var p1 = require('./routes/p1.js')(router); //객체 app을 전달;
// app.use('/p1', p1);

// var p2 = require('./routes/p2.js');
// app.use('/p2', p2);


 
//공과대학 
router.get('/', function(req, res, next){
  
  res.render('index'); // 여기 있는 파일이 home.hbs입니다. base.hbs에 home.hbs가 합쳐져서 render 
//  res.render('home', {layout:false});  //이렇게하면 기본 레이아웃인 base.hbs가 빠진상태로 render 
});


router.get('/bbs', function(req, res, next){
  res.render('bbs'); // 여기 있는 파일이 home.hbs입니다. base.hbs에 home.hbs가 합쳐져서 render 
//  res.render('home', {layout:false});  //이렇게하면 기본 레이아웃인 base.hbs가 빠진상태로 render 
}); 



router.get('/test', function(req, res, next){
    
  let data =  [
      {name: 'express', url: 'http://expressjs.com/'},
      {name: 'hapi', url: 'http://spumko.github.io/'},
      {name: 'compound', url: 'http://compoundjs.com/'},
      {name: 'derby', url: 'http://derbyjs.com/'}
     ]
  


  res.render('test', { data : data });  //이렇게하면 기본 레이아웃인 base.hbs가 빠진상태로 render 
}); 
// route sample
router.get('/new', function(req, res, next) {
  res.render('new')
}); 
 

// /*로그인 성공시 사용자 정보를 Session에 저장한다*/
// passport.serializeUser(function (user, done) {
//   console.log('serializing user: ');
//   console.log(user);
//   done(null, user)
// });

// /*인증 후, 페이지 접근시 마다 사용자 정보를 Session에서 읽어옴.*/
// passport.deserializeUser(function (user, done) {
//   // console.log('no im not serial');
//   // console.log(user);
//   done(null, user);
// });


// /* 로그인 유저 판단 로직 */
// var isAuthenticated = function (req, res, next) {
//   if (req.isAuthenticated())
//     return next();
//   res.redirect('/login');
// };

// /* login */  

// passport.use(new LocalStrategy({
//   usernameField: 'username',
//   passwordField: 'password',
//   passReqToCallback: true //인증을 수행하는 인증 함수로 HTTP request를 그대로  전달할지 여부를 결정한다
// }, function (req, username, password, done) { 
//     console.log(username, password);

//     db.login( {username: username, password: password }).then(
//       result=>{
//         done(null,{
//           id: result.id,
//           token: result.get('sessionToken'),
//           user_id: result.get('username'),
//           // email: result.get('email'),
//         })
//       },
//       error=>{
//         done(error);
//       }
//     )

//     // var info = {"auth_type":"naver","auth_id":"4994907","auth_name":"오션","auth_email":"hi30000@naver.com","auth_picture":"https://ssl.pstatic.net/static/pwe/address/img_profile.png"}
//     // db.socialLogin( info ).then(
//     //   result=>{
//     //     done(null,{
//     //       id: result.id,
//     //       token: result.get('sessionToken'),
//     //       username: result.get('username'),
//     //       // email: result.get('email'),
//     //     })
//     //   },
//     //   error=>{
//     //     done(error);
//     //   }
//     // )
// }));


// // social login process
// function loginByThirdparty(info, done){
//   console.log( "=====> loginByThirdparty");
//   console.log( JSON.stringify(info) );

//     db.socialLogin( info ).then(
//       result=>{
//         done(null,{
//           id: result.id,
//           token: result.get('sessionToken'),
//           username: result.get('username'),
//           // email: result.get('email'),
//         })
//       },
//       error=>{
//         done(error);
//       }
//     )
// }



// passport.use(new NaverStrategy({
//   clientID: config.social_login.naver.client_id,
//   clientSecret: config.social_login.naver.secret_id,
//   callbackURL: config.social_login.naver.callback_url
// },
// function (accessToken, refreshToken, profile, done) {
//   var _profile = profile._json;
//   console.log("===> Naver ")
//   console.log( JSON.stringify(_profile));
//   loginByThirdparty({
//     'auth_type': 'naver',
//     'auth_id': _profile.id,
//     'auth_name': _profile.nickname,
//     'auth_email': _profile.email || _profile.id +'@naver.com',
//     'auth_picture':_profile.profile_image,
//   }, done);
// }
// ));

// passport.use(new KakaoStrategy({
//   clientID: config.social_login.kakao.client_id,
//   callbackURL: config.social_login.kakao.callback_url
//   },
//   function (accessToken, refreshToken, profile, done) {
//     var _profile = profile._json;
//     console.log("===> Kakao ")
//     console.log( JSON.stringify(_profile));
//     loginByThirdparty({
//       'auth_type': 'kakao',
//       'auth_id': _profile.id,
//       'auth_name': _profile.properties.nickname,
//       'auth_email': _profile.kaccount_email || _profile.id +'@kakao.com',
//       'auth_picture':_profile.properties.profile_image,
//     }, done);
//   }
// ));

// passport.use(new FacebookStrategy({
//   clientID: config.social_login.facebook.client_id,
//   clientSecret: config.social_login.facebook.secret_id,
//   callbackURL: config.social_login.facebook.callback_url,
//   profileFields: ['id', 'email', 'picture', 'gender', 'link', 'locale', 'name', 'timezone',
//     'updated_time', 'verified', 'displayName']
// }, function (accessToken, refreshToken, profile, done) {
//   var _profile = profile._json;
//   console.log("===> Facebook ")
//   console.log( JSON.stringify(_profile));
//   loginByThirdparty({
//     'auth_type': 'facebook',
//     'auth_id': _profile.id,
//     'auth_name': _profile.name,
//     'auth_email':_profile.kaccount_email || _profile.id +'@facebook.com',
//     'auth_picture':_profile.picture.data.url
//   }, done);
// }
// ));

// // 기본 로그인
// router.post('/login', passport.authenticate('local', { failWithError:true, failureRedirect: '/login',  failureFlash: true}), // 인증실패시 401 리턴, {} -> 인증 스트레티지
//   function (req, res, next) {
//     res.redirect('/become'); 
//   },
//   function(err, req, res, next){
//     res.json(err);
//   }
// );
// router.post('/ajax/login', passport.authenticate('local', { failWithError:true, failureRedirect: '/login',  failureFlash: true}), // 인증실패시 401 리턴, {} -> 인증 스트레티지
//   function (req, res, next) { 
//     res.json( req.user );
//   },
//   function(err, req, res, next){
//     res.json(err);
//   }
// );

// /*Log out*/
// router.get('/logout', function (req, res) {
//   req.logout();
//   res.redirect('/');
// });

// // naver 로그인
// router.get('/auth/login/naver',
//   passport.authenticate('naver')
// );
// // naver 로그인 연동 콜백
// router.get('/auth/login/naver/callback',
//   passport.authenticate('naver', {
//     successRedirect: '/become',
//     failureRedirect: '/login'
//   })
// );
// // kakao 로그인
// router.get('/auth/login/kakao',
//   passport.authenticate('kakao')
// );
// // kakao 로그인 연동 콜백
// router.get('/auth/login/kakao/callback',
//   passport.authenticate('kakao', {
//     successRedirect: '/become',
//     failureRedirect: '/login'
//   })
// );
// // facebook 로그인
// router.get('/auth/login/facebook',
//   passport.authenticate('facebook')
// );
// // facebook 로그인 연동 콜백
// router.get('/auth/login/facebook/callback',
//   passport.authenticate('facebook', {
//     successRedirect: '/become',
//     failureRedirect: '/login'
//   })
// );

// //client login연동 
// router.get('/become', function(req, res, next) {
//   // res.json(req.user);
//   res.render('become', {user: req.user})
// });


// /* GET home page. */
// router.get('/', function(req, res, next) {
//   // try{
//   //   console.log( "req.user: " +  JSON.stringify( req.user ) );
//   // }catch(e){
//   //   console.log(e);
//   // }

//   // appReferer
//   var source = req.headers['user-agent'],
//   ua = useragent.parse(source);
//   db.appReferer({
//     ip:requestIp.getClientIp(req),
//     referer: req.headers.referer,
//     ua: ua.source,
//     isMobile: ua.isMobile,
//     os: ua.os,
//     browser: ua.browser
//   });


//   //show data 
//   var tasks = [
//     function(callback){
//       db.getTop( 'main' ).then(
//         result=>callback(null,result),
//         err=>callback(err)
//       ) 
//     },
//     function(callback){
//       db.getChannels('', '', 10).then(
//         result=>callback(null,result),
//         err=>callback(err)
//       ) 
//     },
//     //각 6개 채널 5개씩 목록 
   
//     function(callback){
//       //main 
//       db.getChannels('fashion', '', 5).then(
//         result=>callback(null,result),
//         err=>callback(err)
//       ) 
//     },
//     function(callback){
//       //main 
//       db.getChannels('sneakers', '', 5).then(
//         result=>callback(null,result),
//         err=>callback(err)
//       ) 
//     },
//     // function(callback){
//     //   //main 
//     //   db.getChannels('pop culture', '', 5).then(
//     //     result=>callback(null,result),
//     //     err=>callback(err)
//     //   ) 
//     // },
//     function(callback){
//       //main 
//       db.getChannels('music', '', 5).then(
//         result=>callback(null,result),
//         err=>callback(err)
//       ) 
//     },
//     function(callback){
//       //main 
//       db.getChannels('food', '', 5).then(
//         result=>callback(null,result),
//         err=>callback(err)
//       ) 
//     },
//     function(callback){
//       //main 
//       db.getChannels('sts', '', 5).then(
//         result=>callback(null,result),
//         err=>callback(err)
//       ) 
//     },
//   ]

  
  
//   // 실행 
//   async.series(tasks, function(err, results){
//     if(err){
//       res.send("error", {message:err});
//     }else{

//       //채널정보 모으기
//       let channels = [];
//       let cnt =2;
//       channels.push( {category:'fashion', list: results[cnt++] } );
//       channels.push( {category:'sneakers', list: results[cnt++] } );
//       // channels.push( {category:'pop culture', list: results[cnt++] } );
//       channels.push( {category:'music', list: results[cnt++] } );
//       channels.push( {category:'food', list: results[cnt++] } );
//       channels.push( {category:'sts', list: results[cnt++] } );
       

//       res.render('category', 
//       {
//         top: results[0],
//         latestList: results[1],
//         channels: channels
//       })
//     }
//   })
 

// });
// // 공용 Sub
// router.get('/article/:category/:id', function(req,res,next){
//   console.log(req.params.category);
//   let category = req.params.category;
//   let id = req.params.id;

//   //pop cultue
//   if(category == 'popculture'){
//     category = 'pop culture';
//   }

//   var tasks = [
//     function(callback){
//       db.getArticle( id ).then(
//         result=>callback(null,result),
//         err=>callback(err)
//       ) 
//     },
//     function(callback){
//       db.getChannels( category ).then(
//         result=>callback(null,result),
//         err=>callback(err)
//       ) 
//     }
//   ]
  
//   // 실행 
//   async.series(tasks, function(err, results){
//     if(!results[0]){
//       res.render("error", {message:'존재하지 않는 페이지입니다.'});
//     }else{
//       res.render('article', 
//       {
//         category: category,
//         category_uri: category.replace(' ',''),
//         data: results[0],
//         og: results[0], //same as data 
//         latestList: results[1],
//       })
//     }
//   })
 
   
// });


// router.get('/search', function(req,res,next){
//   let q  = req.query.q || '';
//   db.searchBoard(q).then(
//     result=>{
//       res.render('search', {q: q, result:result} )
//     },
//     error=>{
//       res.render('error', error );
//     }
//   )
  
// });

// // CHANNELS
// router.get('/fashion', function(req,res,next){  channelRender('fashion', res, req, next); });
// router.get('/sneakers', function(req,res,next){  channelRender('sneakers', res, req, next); });
// router.get('/popculture', function(req,res,next){  channelRender('pop culture', res, req, next); });
// router.get('/music', function(req,res,next){  channelRender('music', res, req, next); });
// router.get('/food', function(req,res,next){  channelRender('food', res, req, next); });

// function channelRender(category, res, req, next){
//   var tasks = [
//     function(callback){
//       db.getTop(category).then(
//         result=>callback(null,result),
//         err=>callback(err)
//       ) 
//     },
//     function(callback){
//       db.getChannels(category).then(
//         result=>callback(null,result),
//         err=>callback(err)
//       ) 
//     }
//   ]


//   // 실행 
//   async.series(tasks, function(err, results){
//     if(err){
//       res.send("error", {message:err});
//     }else{
//       res.render( 'category', 
//       {
//         category: category,
//         category_uri: category.replace(' ',''),
//         top: results[0],
//         latestList: results[1]
//       })
//     }
//   })
 
// } 
// // MORE 
// router.get('/more/:category?/:no', function(req,res,next){
//   let category = req.params.category;
//   let no = req.params.no;

//   //메인은 카테고리 조건 없애기 
//   if( category =='main'){
//     category = '';
//   }

//   db.getChannels(category, no).then(
//     result=>{
//       res.render("more-latest-item", {list: result, layout:false })
//     }
//   )  
  
// });

// router.get('/search/more/:no', function(req,res,next){
//   let no = req.params.no;
//   let q = req.query.q;
  
//   db.searchBoard(q, no).then(
//     result=>{
//       res.render("more-search-item", {list: result, layout:false })
//     }
//   )  
// });

// router.get('/video/more/:no', function(req,res,next){
//   let no = req.params.no;
  
//   db.getVideos('list', no).then(
//     result=>{
//       res.render("more-video-item", {list: result, layout:false })
//     }
//   )  
// });


// // MEMBERS
// router.get('/login', function(req,res,next){
//   res.render('login')
// });
// router.get('/join', function(req,res,next){
//   res.render('join')
// });
// router.get('/id_pw_search', function(req,res,next){
//   res.render('id_pw_search')
// });

// // STS 
// router.get('/sts', function(req,res,next){

//   db.getSTS().then(
//     result=>{
//       res.render('sts', { category:'sts', sts: result} )
//     },
//     error=>{
//       console.log(error);
//       res.render('error', error );
//     }
//   )
  
// });

// // STS 추가,수정 
// router.get('/sts/write', function(req,res,next){
//   res.render('write', {category:'sts'})
// });

// // STS 추가,수정 
// router.get('/:category/write/:id', function(req,res,next){
//   var id = req.params.id;
//   var category = req.params.category;
//   if(category == 'popculture'){
//     category = 'pop culture';
//   }
//   db.getArticle(id).then(
//     result=>{ 
//       res.render('write', { 
//         category: category , 
//         category_uri: category.replace(' ','') , 
//         id: id, data: result
//       } 
//       )
//     },
//     error=>{
//       console.log(error);
//       res.render('error', error );
//     }
//   )
// });

// // STS 더보기 
// router.get('/sts/more/:user_id/:no', function(req,res,next){
//   let user_id = req.params.user_id;
//   let no = req.params.no;
 

//   db.getSTS( user_id, no).then(
//     result=>{
//       res.render("more-latest-item", {list: result, layout:false })
//     }
//   )  
// });


// // 내정보 
// router.get('/profile', function(req,res,next){
//   let q  = req.query.q;
//   res.render('profile', {   q: q} )
// });

// router.get('/profile-pw', function(req,res,next){
//   let q  = req.query.q;
//   res.render('profile-pw', {  q: q} )
// });


// router.get('/profile-board/:userId', function(req,res,next){
//   let user_id = req.params.userId;

//   //내가 쓴글, 5개만 
//   db.getSTS( user_id ).then(
//     result=>{
//       res.render('profile-board', {  user_id: user_id, myList: result} )
//     },
//     error=>{
//       console.log(error);
//       res.render('error', error );
//     }
//   )
  
// });

// router.get('/youtubestacks', function(req,res,next){

//   var tasks = [
//     function(callback){
//       db.getYoutubeStack('fashion').then(
//         result=>callback(null,result),
//         err=>callback(err)
//       ) 
//     },
//     function(callback){
//       db.getYoutubeStack('sneakers').then(
//         result=>callback(null,result),
//         err=>callback(err)
//       ) 
//     },
//     function(callback){
//       db.getYoutubeStack('pop culture').then(
//         result=>callback(null,result),
//         err=>callback(err)
//       ) 
//     },
//     function(callback){
//       db.getYoutubeStack('music').then(
//         result=>callback(null,result),
//         err=>callback(err)
//       ) 
//     },
//     function(callback){
//       db.getYoutubeStack('food').then(
//         result=>callback(null,result),
//         err=>callback(err)
//       ) 
//     },
//   ];

//   // 실행 
//   async.series(tasks, function(err, results){
//     if(err){
//       res.send("error", {message:err});
//     }else{
//       res.render('youtubestacks', 
//       {
//         // category:'youtubestacks',
//         fashionList: results[0],
//         sneakersList: results[1],
//         popcultureList: results[2],
//         musicList: results[3],
//         foodList: results[4],
//       })
//     }
//   })
  
// });


// //개별 youtubestack 
// router.get('/youtubestacks/:category', function(req,res,next){
//   let category = req.params.category;
//   var tasks = [
//     function(callback){
//       db.getYoutubeStack(category).then(
//         result=>callback(null,result),
//         err=>callback(err)
//       ) 
//     } 
//   ];

//   // 실행 
//   async.series(tasks, function(err, results){
//     if(err){
//       res.send("error", {message:err});
//     }else{
//       res.render('youtubestacks-category', 
//       {
//         subCategory: category,
//         list: results[0],
        
//       })
//     }
//   })
  
// });



// // MORE
// router.get('/video', function(req,res,next){
//   db.getVideos('list').then(
//     result=>{
//       if( result.length > 0){
//         res.render('video', { category:'video', mainVideo: result[0], videos:result})
//       }else{
//         res.render('error', {message:'비디오 목록이 존재하지 않습니다.'} );  
//       }
//     },
//     error=>{
//       res.render('error', error );
//     }
//   )
  
// });
// router.get('/shop', function(req,res,next){
//   res.render('shop')
// });
// router.get('/events', function(req,res,next){
//   db.getEvents().then(
//     result=>{
//       res.render('events', { category:'events', events: result })
//     },
//     error=>{
//       res.render('error', error );
//     }
//   ) 
// });
// router.get('/events/:id', function(req,res,next){
//   let id = req.params.id;
  
//   db.getEvent(id).then(
//     result=>{
//       res.render('events-detail', { category:'events',  data: result })
//     },
//     error=>{
//       res.render('error', error );
//     }
//   ) 
// });

// // FOOTER 
// router.get('/contact', function(req,res,next){
//   res.render('contact')
// });
// router.get('/about', function(req,res,next){
//   res.render('about')
// });
// router.get('/terms_of_use', function(req,res,next){
//   res.render('terms_of_use')
// });
// router.get('/privacy', function(req,res,next){
//   res.render('privacy')
// });
// router.get('/e-mail_collect', function(req,res,next){
//   res.render('e-mail_collect')
// });

module.exports = router;
