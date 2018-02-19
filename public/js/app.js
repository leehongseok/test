

// 로그인 확인 
$(document).ready(function(){
    var user = Parse.User.current();

    //로그인 여부 확인 
    if( user ){ 
        //로그인중
        $(".login_id").val(user.get('username'));
        $(".login_name").val(user.get('name'));
        $(".login_email").val(user.get('mail'));
        $(".login_facebook").val(user.get('facebook'));
        $(".login_instagram").val(user.get('instagram'));


        $(".isLogin").hide();
    }else{
        $(".isLogout").hide(); 
    }
 

   
})

// 회원가입
var userRegist = function(popup){
    let $id = $("#member_id");
    let $name = $("#member_name");
    let $email = $("#member_email");
    let $pw = $("#member_pw");
    let $pw_ok = $("#member_pw_ok");

    let id = $id.val();
    let name = $name.val();
    let email = $email.val();
    let pw = $pw.val();
    let pw_ok = $pw_ok.val();

    let terms_ok = $("#terms_ok").is(':checked');
    let privacy_ok = $("#privacy_ok").is(':checked');

    // 사전 체크  
    if( !id){
        alert("아이디를 입력하세요.");
        $id.focus();
        return;
    }else if( !name ){
        alert("이름을 입력하세요.");
        $name.focus();
        return;
    }else if( !email ){
        alert("이메일을 입력하세요.");
        $email.focus();
        return;
    }else if( !pw ){
        alert("비밀번호를 입력하세요.");
        $pw.focus();
        return;
    }else if( !pw_ok ){
        alert("비밀번호 확인을 입력하세요.");
        $pw_ok.focus();
        return;
    }else if( pw != pw_ok ){
        alert("비밀번호와 비밀번호 확인이 상이합니다. 다시 확인하여 주세요.");
        return;
    }else if( id.length < 4 ){
        alert("아이디는 최소 4자리 이상 입력하세요.");
        return;
    }else if( pw.length < 4 ){
        alert("비밀번호는 최소 4자리 이상 입력하세요.");
        return;
    }else if( !terms_ok && !popup){
        alert("서비스 이용약관에 동의하여 주세요.");
        return;
    }else if( !privacy_ok && !popup){
        alert("개인정보 취급방침에 동의하여 주세요.");
        return;
    }


    // 가입진행 
    var user = new Parse.User();
    user.set("username", id);
    user.set("password", pw);
    user.set("email", email);
    user.set("mail", email); //mail도 같이 저장 
    user.set("name", name);
 

    user.signUp(null, {
    success: function(user) {
        // Hooray! Let them use the app now.
        alert("가입이 완료되었습니다. 환영합니다!");
        
        if( popup ){
            location.reload();
        }else{
            location.href = "/";
        }
    },
    error: function(user, error) {
        // Show the error message somewhere and let the user try again.
        if(error.code == 125){
            alert("유효한 형태의 이메일이 아닙니다.");
        }else if(error.code == 200){
            alert("이메일을 입력하세요.");
        }else if(error.code == 201){
            alert("비밀번호를 입력하세요.");
        }else if(error.code == 202){
            alert("사용중인 아이디입니다.");
        }else if(error.code == 101){
            alert("일치하는 계정이 없습니다.");
        }else if(error.code == -1){
            alert("이메일 및 비밀번호를 입력하세요.");
        }else{
            alert(error.message);
        }
    }
    });
}

// 소셜 로그인 
var userLoginFacebook = function(popup){
    location.href = '/auth/login/facebook';
}
var userLoginKakao = function(popup){
    location.href = '/auth/login/kakao';
}
var userLoginNaver = function(popup){
    location.href = '/auth/login/naver';
}

// 로그인
var userLogin = function(popup){
    let $id = $("#member_id");
    let $pw = $("#member_pw");
    if(popup){
        //팝업일때만 로그인필드 변경
        $id = $("#login_member_id");
        $pw = $("#login_member_pw");
    }
    let id = $id.val();
    let pw = $pw.val();
    let isSave = $("#member_save").is(':checked');
    // alert(isSave);

    // 사전 체크  
    if( !id){
        alert("아이디를 입력하세요.");
        $id.focus();
        return;
    }else if( !pw ){
        alert("비밀번호를 입력하세요.");
        $pw.focus();
        return;
    }

    // 로그인 진행 
    Parse.User.logIn(id,pw).then(
        user=>{

            //탈퇴유저 체크 
            if(user.get('isRetired') ){
                alert("탈퇴한 회원입니다.");
                Parse.User.logOut();
                return;
            }
            //이용정지
            else if(user.get('isBlocked')){
                alert("이용이 제한된 회원입니다. 관리자에게 문의하여 주세요. \n" + user.get('blockMessage'));
                Parse.User.logOut();
                return;
            }
            //정상 
            else{
                if( isSave ){
                    window.localStorage.setItem('username', id);
                }else{
                    window.localStorage.setItem('username','');
                }

                alert("로그인 되었습니다.");
                
                //서버 로그인처리 
                $.post( "/ajax/login", { username:id, password: pw })
                .done(function( data ) {
                    console.log( "Data Loaded: " + JSON.stringify(data) );
                });

                if( popup ){
                    location.reload();
                }else{
                    location.href = "/";
                }
                
            }
        },
        error=>{
            if(error.code == 200){
             alert("이메일을 입력하세요.");
            }else if(error.code == 201){
              alert("비밀번호를 입력하세요.");
            }else if(error.code == 101){
             alert("일치하는 계정이 없습니다.");
            }else if(error.code == -1){
             alert("이메일 및 비밀번호를 입력하세요.");
            }else{
             alert(error.message);
            }
        }
    )
}


// 로그아웃
var userLogout = function(){
    if(confirm("로그아웃 하시겠습니까?")){
        Parse.User.logOut().then(
            success=>{
                location.href = "/logout";
            },
            e=>{location.href = "/logout";}
        );
        
    }
}

// 비밀번호 변경
var userChangepw = function(){
    var user = Parse.User.current();
    if(user){
        // social계정은 수정할 수 없다.
        if( user.get('loginType') != 'email'){
            alert("소셜 계정은 비밀번호를 수정할 수 없습니다.");
            return; 
        }
        // social계정은 수정할 수 없다.@

        let $old = $("#member_pw_old");
        let $pw = $("#member_pw");
        let $pw_ok = $("#member_pw_ok");
        let old = $old.val();
        let pw = $pw.val();
        let pw_ok = $pw_ok.val();
 
        // 사전 체크  
        if( !old){
            alert("현재 비밀번호를 입력하세요.");
            $old.focus();
            return;
        }else if( !pw ){
            alert("새 비밀번호를 입력하세요.");
            $pw.focus();
            return;
        }else if( !pw_ok ){
            alert("새 비밀번호 확인을 입력하세요.");
            $pw_ok.focus();
            return;
        }else if( pw != pw_ok ){
            alert("비밀번호와 비밀번호 확인이 상이합니다. 다시 확인하여 주세요.");
            return;
        }else if( pw.length < 4 ){
            alert("비밀번호는 최소 4자리 이상 입력하세요.");
            return;
        }
 
        //로그인해서 현재 비밀번호 확인 
        Parse.User.logIn( user.get('username'), old ).then(
            success=>{
                user.set('password', pw);
                user.save().then(
                    success=>{
                        alert("수정되었습니다.");
                        $old.val('');
                        $pw.val('');
                        $pw_ok.val('');
                    },
                    error=>{alert(e.message) }
                )
            },
            error=>{
                alert("현재 비밀번호를 확인하세요.");
            }
        )
        
    }else{
        alert("잘못된 접근입니다.");
        location.href= "/";
    }
}

// 회원탈퇴 
var userRetire = function(){
    var user = Parse.User.current();
    if(user){
        if(confirm("정말 탈퇴하시겠습니까? 탈퇴 후, 복구가 불가능합니다.")){
            Parse.Cloud.run("retireUser", {username: user.get('username') }, function(req,res){
                Parse.User.logOut().then(
                    success=>{
                        location.href = "/";
                    },
                    e=>{location.href = "/";}
                ); 
            })
            
        }
    }else{
        alert("잘못된 접근입니다.");
        location.href= "/";
    }
}

// 회원정보 수정 (성명, 이메일)
var userUpdate = function(){
    let $name = $("#member_name");
    let $email = $("#member_email");
    let $facebook = $("#member_facebook");
    let $instagram = $("#member_instagram");
    

    let name = $name.val();
    let email = $email.val();
    let facebook = $facebook.val();
    let instagram = $instagram.val();
    
    
    // 사전 체크  
    if( !name){
        alert("이름을 입력하세요.");
        $name.focus();
        return;
    }else if( !email ){
        alert("이메일을 입력하세요.");
        $email.focus();
        return;
    }

    // 수정 
    var user = Parse.User.current();
    user.set('name', name);
    user.set('email', email);
    user.set('mail', email);

    user.set('facebook', facebook);
    user.set('instagram', instagram);

    user.save().then(
        success=>{
            alert("수정되었습니다.");
        },
        (o,e)=>{
            alert(e.message);
        }
    )
}



// 아이디 찾기 (이름,이메일)
var findID = function(){
    let $name = $("#member_name");
    let $email = $("#member_email");
    let name = $name.val();
    let email = $email.val();
    
    // 사전 체크  
    if( !name){
        alert("이름을 입력하세요.");
        $name.focus();
        return;
    }else if( !email ){
        alert("이메일을 입력하세요.");
        $email.focus();
        return;
    }

    //   진행 
    var query = new Parse.Query(Parse.User);
    query.equalTo('name', name);
    query.equalTo('email', email);
    query.first().then(
        result=>{
            if( result ){
                alert("아이디는 " + result.get('username') + "입니다.");
                $name.val('');
                $email.val('');
            }else{
                alert("일치하는 정보가 없습니다.");
            }

        },
        error=>{
            alert("오류: "+  error.message);
        }
    )
}

// 비밀번호 찾기 (아이디,이름)
var findPW = function(){
    let $id = $("#member_id");
    let $name = $("#member_name2");
    let id = $id.val();
    let name = $name.val();
    // alert(isSave);

    // 사전 체크  
    if( !id){
        alert("아이디를 입력하세요.");
        $id.focus();
        return;
    }else if( !name ){
        alert("이름을 입력하세요.");
        $name.focus();
        return;
    }

    //  진행 
    var query = new Parse.Query(Parse.User);
    query.equalTo('username', id);
    query.equalTo('name', name);
    query.first().then(
        result=>{
            // alert(JSON.stringify(result));
            if( result ){
                //재발송 메일 발송하기
                let mail = result.get("mail");

                Parse.User.requestPasswordReset( mail, {
                    success: function() {
                        alert("가입하신 " + result.get('mail') + " 메일로\n비밀번호 재설정 메일을 보냈습니다.");
                        $id.val('');
                        $name.val(''); 
                    },
                    error: function(error) {
                      alert("Error: " + error.code + " " + error.message);
                    }
                  });
               
            }else{
                alert("일치하는 정보가 없습니다.");
            }

        },
        error=>{
            alert("오류: "+  error.message);
        }
    )
}


////////////////////////////////////////////////////////////
// STS 관련 

// 내글 목록 페이지 
var userSTS = function(){
    var user = Parse.User.current();
    if( user ){
        location.href='/profile-board/' + user.id;
    }else{
        alert("잘못된 접근입니다.");
        location.href= "/";
    }
    
}
var userSearch = function(str){
    location.href = '/search?q=' + encodeURIComponent( str );
}


// STS 등록 
var writeSTS = function(id){
    var user = Parse.User.current();
 
    if(user){
        //summernote content
        $('textarea[name="summernote-content"]').html($('.summernote').summernote('code'));
        

        let $title = $("#sts_title");
        let $content = $("#sts_content");
        let $tags = $("#sts_tags");
        let $reference = $("#sts_reference");
        let $file = $("#sts_file").prop('files')[0];
        let title = $title.val();
        let content = $content.val(); //summernote 
        let tags = $tags.val();
        let reference = $reference.val();
        // alert(isSave);
 

        // 사전 체크  
        if( !title){
            alert("제목을 입력하세요.");
            $title.focus();
            return;
        }else if( !content ){
            alert("내용을 입력하세요.");
            $content.focus();
            return;
        }

        //hashtag정리 
        var tagsArr = [];
        if( tags ){
            tags = tags.replace(/ /gi, ""); // 공백없애기 
            tags = tags.replace(/#/gi, ""); // #없애기

            //array변환 
            let tempTags = tags.split(',');
            for(var i=0; i < tempTags.length; i++){
                let item = tempTags[i];
                if( item ){
                    tagsArr.push(item);
                }
            }

            //최종 태그값 
            tags = tagsArr.join(',');  
        }



        //저장할 데이터
        var saveData = {
            id:id,
            user:user,
            title:title,
            content:content,
            tags:tags,
            reference:reference,
        }
        console.log(saveData);


        //파일체크
        var fileUpload = $file;

        if($file){
            var parseFile = new Parse.File( 'sts.png', fileUpload);
            parseFile.save().then(function() {//you need to call after save the file
                var mainImg = parseFile._url;
                console.log("url: " + mainImg );

                saveData.mainImg = mainImg;
                writeProcess( saveData );
            });
        }else{ 
            writeProcess( saveData );
        }
     


 
    }else{
        alert("잘못된 접근입니다.");
        location.href= "/";
    }    
}

var writeProcess = function( data ){
      // 등록하기 
      var Board = Parse.Object.extend("Board");
      var board = new Board();
      

      if( data.id){
          //기존글 수정  
          board.set('objectId', data.id);
      }else{
          //새글 등록 
          board.set('category','sts');
          board.set('user',  data.user);  //user pointer 
          board.set('editor',  data.user); //user pointer 
          board.set('inputDt', moment().toDate()); // 입력날짜 
      }

      // 이미지수정 
      if( data.mainImg ){
          board.set('mainImg', data.mainImg);
      }
      
      // 기본데이터 
      board.set("title",  data.title );
      board.set("content",  data.content );
      board.set("tags", data.tags );
      board.set("reference", data.reference );

      // 수정시, 항상 승인 요청 (관리자수정시 skip)
      var user = Parse.User.current();
      if(user){
          if(user.get('userType') == 'admin'){
            //관리자는 통과  
          }else{ 
            //일반유저는 승인후, 게시 
            alert("게시글은 관리자의 승인후 게시됩니다. \n승인전까지, [My page > 나의 글]에서 조회가능합니다.");
            board.set("isOpen", false );
          }
      }
      

      board.save().then(
          success=>{ 
              if( data.id){      
                  // 수정은 해당 카테고리로 이동한다. 
                  var q = new Parse.Query('Board');            
                  q.get(data.id).then(
                      obj=>{
                        location.href = "/article/" + obj.get('category') + "/" +  obj.id;
                      }
                  )
              }else{
                  // sts는 반드시 새글 
                  location.href = "/sts/";
              }
              
          },
          error=>{ alert(e.message); }
      )
}

var cancelSTS = function(){
    if(confirm("작성중인 내용이 지워집니다. 취소하시겠습니가?")){
        // location.href='/sts';
        history.back(); //이전 페이지로 이동하기 
    }
}

 

// STS 삭제
var deleteSTS = function(category, id){
    if(confirm("삭제하시겠습니까?")){
        //삭제처리 
        var query = new Parse.Query('Board');
        query.get(id).then(
            obj=>{ 

                obj.destroy().then(
                    success=>{
                        alert("삭제되었습니다.");
                        location.href= '/' + category;
                    },
                    error=>{ alert(error.message )}
                )
            },
            error=>{ alert(error.message )}
        )
    }
}

////////////////////////////////////////////////////////////
// 댓글 
var writeComment = function(pid, id ){ 
    var user = Parse.User.current();
 
    if(user){ 
        let $content = $("#comment_content-" + pid); 
        let $file = $("#comment_file-" + pid ).prop('files')[0];
        let content = $content.val(); 
        
        // 사전 체크  
        if( !content){
            alert("내용을 입력하세요.");
            $content.focus();
            return;
        }else if( pid == ''){
            alert("잘못된 경로로 접속하였습니다.");
            location.href=  "/";
            return;
        }

        
        //저장할 데이터
        var saveData = {
            id:id, 
            pid:pid, //게시물 pid 
            user: user,
            content:content,
        }
        //파일체크 
        var fileUpload = $file;

        if($file){
            var parseFile = new Parse.File( 'comment.png', fileUpload);
            parseFile.save().then(function() {//you need to call after save the file
                var mainImg = parseFile._url;
                console.log("url: " + mainImg );

                saveData.mainImg = mainImg;
                writeCommentProcess( saveData );
            });
        }else{ 
            writeCommentProcess( saveData );
        }
     


 
    }else{
        openLoginModal();
    }    
}

var writeCommentProcess = function( data ){
      //alert(JSON.stringify(data));

      // 등록하기 
      var Comment = Parse.Object.extend("Comment");
      var comment = new Comment();
      

      if( data.id){
          //기존글 수정  
          comment.set('objectId', data.id);
      }else{
          //새글 등록 
          comment.set('pid', data.pid ); //부모글 
          comment.set('user',  data.user);  //user pointer 
          comment.set('like', 0);
          comment.set('childCount', 0);
      }

      // 이미지수정 
      if( data.mainImg ){
         comment.set('mainImg', data.mainImg);
      }
      // 이미지 삭제
      if( data.isDeleteImg ){
          comment.unset('mainImg');
      }
      
      // 기본데이터 
      comment.set("content",  data.content );
       
 
      comment.save().then(
          success=>{ 
            let $content = $("#comment_content-" + data.pid); 
            $content.val('');
            imageClear(); //미리보기 초기화 

            //등록완료시 childCount 체크하기 
            var q = new Parse.Query('Comment');
            q.equalTo('pid', data.pid);
            q.count().then(
                cnt=>{
                    console.log("comment childCount: " + cnt);

                    //부모객체 업데이트
                    var c = new Parse.Query('Comment');
                    c.get(data.pid).then(
                        obj=>{
                            obj.set('childCount', cnt);
                            obj.save();
                        }
                    )
                }
            )

            if( data.id){
                //기존글 수정  
                alert("수정되었습니다.");
                addCommentHTML(data.pid, success, false); //새글은 3번째 파라미터 isNew 
            
            }else{
                //새글 등록 
                alert("등록되었습니다.");
                addCommentHTML(data.pid, success, true); //새글은 3번째 파라미터 isNew 
            
            }
            //  location.href = "/article/sts/" +  data.pid; //본 게시물 목록  


            //댓글의 경우, 입력창 숨김
            if( data.pid == rootPid){
                //root 댓글창은 남겨움 
            }else{
                // 코멘트창은 닫아줌 
                $("#comment-form-"+data.pid).hide();
            }
          },
          error=>{ alert(e.message); }
      )
}


var editComment = function(pid, id){
    $(".comment-form-edit").hide(); //다른 수정창은 모두 닫기 
    $("#comment-form-edit-"+ id).toggle();
    
    previewImage();
}
var editReply = function( pid, id ){
    var $content =  $("#comment-form-edit-"+ id + "  textarea");
    var content = $content.val();
    console.log(content);

    

    //id, content, mainImg 3개 수정 
    let $file = $("#comment_file-" + id ).prop('files')[0];

    if( content == ''){
        alert('내용을 입력하세요.');
        $content.focus();
        return;
    }else{
        $("#comment-form-edit-"+ id).hide();
    }


    //수정할 데이터
    var saveData = {
        id:id, 
        pid:pid,
        content:content,
    }
    //파일체크 
    var fileUpload = $file;

    if($file){
        var parseFile = new Parse.File( 'comment.png', fileUpload);
        parseFile.save().then(function() {//you need to call after save the file
            var mainImg = parseFile._url;
            console.log("url: " + mainImg );

            saveData.mainImg = mainImg;
            writeCommentProcess( saveData );
        });
    }else{ 
        //파일첨부안했지만, 기존 이미지 삭제할 경우
        if( $("#comment-form-upload-delete-" + id ).val() == 1 ){
            console.log("삭제요망");
            saveData.isDeleteImg = true; //삭제 flag 
        }
        writeCommentProcess( saveData );
    }

    console.log(saveData);
}

var deleteComment = function(pid, id){
    if(confirm("삭제하시겠습니까?")){
        //삭제처리 
        var query = new Parse.Query('Comment');
        query.get(id).then(
            obj=>{ 

                obj.destroy().then(
                    success=>{
                        alert("삭제되었습니다.");

                        //해당글 삭제 
                        $('#comment-list-'+pid+'-'+id).remove();

                    },
                    error=>{ alert(error.message )}
                )
            },
            error=>{ alert(error.message )}
        )
    }
}


//댓글 목록  
var commentNo = 0;
var commentListEl = null;
var commentMoreEl = null;
var commentPid;
var rootPid;
var commentOrderby;
var commentSize= 5;
var commentTotalCount = 0;
var initCommentList = function(pid, orderby ){
    //초기화 
    commentListEl = $("#comment-list-" + pid);
    commentMoreEl = $("#comment-more-" + pid);
    commentListEl.empty(); //전부초기화 
    commentMoreEl.show();
    rootPid = commentPid = pid;
    commentOrderby = orderby;
    console.log("initCommentList: " + pid + ' - ' + orderby );
 
    
    //목록호출
    loadCommentList(1);
} 
var moreCommentList = function(){
    loadCommentList(++commentNo);
}
var loadCommentList = function(no){
    commentNo = no;
    var query = new Parse.Query('Comment');
    query.equalTo('pid', commentPid)
    query.include('user');
   

    if( commentOrderby == 'latest'){
        query.descending('createdAt');
    }else if( commentOrderby == 'oldest'){
        query.ascending('createdAt');
    }else{
        query.descending('like, createdAt');
    }


    query.limit( commentSize );
    query.skip( commentSize * ( no - 1));


    query.count().then(
        count=>{
          commentTotalCount = count;
          $("#comment-count-" + commentPid ).html( "(" + commentTotalCount +")" );

          //목록 
          query.find().then(
            result=>{
                console.log('result', result);
                //리스트추가 
                for(let item of result){
                    addCommentHTML(commentPid, item);
                }
    
                //more check
                if( result.length < commentSize ){
                    commentMoreEl.hide();
                }
            },
            error=>{
                alert(error.message);
            }
        )
        },
        error=>{
            alert(error.message);
        }
    )
     

   
}
var addCommentHTML = function(pid, item, isNew ){

    var user = Parse.User.current() || {};
    var listEl = $("#comment-list-" + pid);
    var moreEl = $("#comment-more-" + pid);

    let data = JSON.parse(JSON.stringify(item));
    let dateFormat = moment( item.createdAt ).format('ll');
    console.log("addCommentHTML : "+  pid + " - " + data.content)
    var html = `<div id="comment-list-`+ pid +`-` + data.objectId + `" class="comment_list">`;
                             
    //rootPid와 pid가 같으면 원글이다 
    if( rootPid == pid ){
        html+= `<div class="comment_list_text ">
            <div>
                <p>`;
    }else{
        html+= `<div class="comment_list_text reply">
            <div>
                <p>`;
    }

    //rootPid와 pid가 같으면 원글이다 
    if( rootPid == pid ){
            html +=        `<b>`+ data.user.name +`</b>`;
    }else{
        html +=        `<img src="images/reply.svg" style="height:12px;margin-left:15px;margin-right:10px;"><b>`+ data.user.name +`</b>`;
    }

            html +=         `<span class="sub_writer">·&nbsp;`+ dateFormat +`</span>
                        </p>`;
    // 이미지 추가 
    if( data.mainImg ){
            html+=      `<p><span class="ment_txt"><a href="`+data.mainImg +`" alt="이미지"><img src="`+data.mainImg +`"></a></span></p>`;
    }

    
    //rootPid와 pid가 같으면 원글이다 
    if( rootPid == pid ){
            html+=      `<p><span class="ment_txt">`+ data.content +`</span></p>`;
    }else{
        html+=      `<p style="padding-left:40px"><span class="ment_txt">`+ data.content +`</span></p>`;
    }
    
    html += "<p>";

    // 본인글 or 관리자  
    if( data.user.objectId == user.id || user.get('userType') == 'admin' ){
            html +=     `<!--본인글 --> 
                            <span class="sub_writer" onclick="editComment('`+ pid+`','`+ data.objectId +`')">수정</span> ·
                        <!--본인글 @-->
                        `;
                            
                        
    } 

    // 댓글 삭제는 관리자만 
    if( user.get('userType') == 'admin' ){
        html += `<span class="sub_writer" onclick="deleteComment('`+ pid+`','`+ data.objectId +`')">삭제</span> ·`;
    }

        html +=         `<span class="sub_writer comment_reply3" onclick="showReplyList('`+ data.objectId +`', '`+ data.childCount+`')">댓글(`+ ( data.childCount || 0 )+`)</span>
                        
                    <!--작성버튼 -->
                    <span id="comment-form-add-`+data.objectId+`" style="display:none">·
                        <span class="sub_writer comment_reply3" onclick="showReplyForm('`+ data.objectId +`')">댓글 쓰기</span>
                    </span>
                    <!--작성버튼 @-->`;

    if( data.like > 0){
        html +=     `<!--좋아요 -->
                        <span onclick="likeUp('`+data.objectId+`')">
                        ·&nbsp;<i class="sub_writer"><span id="like-`+data.objectId+`">`+ ( data.like || 0 ) + `</span>Likes &nbsp;</i>
                            <span class="sub_writer ment_good"></span>
                        </span>
                    <!-- 좋아요 @-->
                    `;
    }else{
        html +=     `<!--좋아요 -->
                        <span onclick="likeUp('`+data.objectId+`')">
                        ·&nbsp;<i class="sub_writer"><span id="like-`+data.objectId+`">`+  ( data.like || 0 ) + `</span>Like &nbsp;</i>
                            <span class="sub_writer ment_good"></span>
                        </span>
                    <!-- 좋아요 @-->
                    `;
    }
                    
    
    html +=         `</p>`;
     
    html    +=      `</div>
                    
                    <!-- 댓글 수정폼 -->
                    <div class="comment_write comment-form-edit" id='comment-form-edit-`+  data.objectId +`' style="padding-top:15px;display:none;"> 
                        <textarea id="comment_content-edit-`+  data.objectId +`" placeholder="수정하실 내용을 적어주세요.">`+ data.content +`</textarea>
                        <div class="filebox preview-image">  
                        `;

    if( data.mainImg ){
        html +=         `<!--기존 이미지 삭제 -->
                            <div id="comment-form-upload-`+ data.objectId+`" style="z-index:-1">
                                <input type="hidden" id="comment-form-upload-delete-`+ data.objectId +`" value="0">
                                <div class="upload-thumb-wrap" >
                                    <img src="`+ data.mainImg + `" class="upload-thumb" width="45" height="30">
                                </div>
                                <button onclick="uploadDelete('`+ data.objectId+`');return false;">delete</button>
                            </div>
                            <!--기존 이미지 삭제 @-->`;
    }

    html +=                 `<input class="upload-name" value="파일선택" disabled="disabled" > 
                            <label for="comment_file-`+  data.objectId +`" class="comment_pic_up"></label>
                            <input type="file" id="comment_file-`+  data.objectId +`" class="upload-hidden" accept="image/*" capture="camera"/>
                                        
                            <div class="write_btn" onclick="editReply('`+ pid +`','`+ data.objectId +`')">수정</div>
                        </div>
                    </div> 
                    <!-- 댓글 수정폼 @-->

                    <!-- 댓글 작성폼 -->
                    <div class="comment_write" id='comment-form-`+  data.objectId +`' style="padding-top:15px;display:none;"> 
                        <textarea id="comment_content-`+  data.objectId +`" placeholder="댓글을 적어주세요."></textarea>
                        <div class="filebox preview-image">  
                            <input class="upload-name" value="파일선택" disabled="disabled" > 
                            <label for="comment_file-write-`+  data.objectId +`" class="comment_pic_up"></label>
                            <input type="file" id="comment_file-write-`+  data.objectId +`" class="upload-hidden" accept="image/*" capture="camera"/>

                            <div class="write_btn" onclick="writeReply('`+ data.objectId +`')">댓글</div>
                        </div>
                    </div> 
                    <!--댓글 작성폼 @-->

                    
                    <!--코멘트 목록-->
                    <div id="comment-list-`+ data.objectId+`" style="clear:both">
                    </div>
                    <!--코멘트 목록@-->

                   

                </div> 

            </div>`;

    if( isNew ){
        //새글이면 맨위에 붙인다. 
        listEl.prepend(html);
    }else{
        // 목록 호출시, 이미 같은 node가 있는지 없는지 체크하기 
        var $existItem = $("#comment-list-"+ data.pid + "-"+ data.objectId );
        if( $existItem.html() ){
            $existItem.replaceWith(html); // 이건 수정시 
        }else{
            listEl.append(html); //이건 리스트 붙일때 
        }
        
    }
    $('.ment_txt a').lightBox();
    //카운터 올리기
    if(isNew){
        commentTotalCount++;
        $("#comment-count-" + pid ).html( "(" + commentTotalCount +")" );
    }
    
}

// 첨부이미지 클리어 
var imageClear = function(){
    let $file = $("#comment_file"); 
    $('.upload-display').remove(); //미리보기 삭제 
    $file.val('');
}

//대댓글
var showReplyForm  =function(pid){
    //보여주기
    $form = $("#comment-form-"+pid);

    $form.toggle(); 

    //목록 호출
}
var showReplyList = function(pid, childCount){
    //보여주기
    if( childCount > 0){
        $("#comment-form-add-"+pid).show();
    }else{
        $("#comment-form-"+pid).show();
    }
    
    $("#comment-list-"+pid).show();

    previewImage();
    
    // 불러온 목록이 없을때만 코멘트 추가 
    let len = ($("#comment-list-"+pid).children().length);
    if(len == 0){
        //목록 호출 
        var query = new Parse.Query('Comment');
        query.equalTo('pid', pid)
        query.include('user');
        query.ascending('createdAt');
        query.find().then(
            result=>{
                for(let item of result){
                    addCommentHTML(pid, item, false); 
                }
            },
            error=>{
                alert(error.message); 
            }
        )
    }

}
var writeReply = function(pid){
    var user = Parse.User.current();
    if(user){
        var contentEl = $("#comment_content-"+pid);
        var content = contentEl.val();
        let $file = $("#comment_file-write-" + pid ).prop('files')[0];

        if( content == ''){
            alert("댓글 내용을 입력하세요.");
            contentEl.focus();
            return
        } 

        //저장할 데이터
        var saveData = {
            id:null, 
            pid:pid, //게시물 pid 
            user: user,
            content:content,
        }

         //파일체크 
         var fileUpload = $file;

         if($file){
             var parseFile = new Parse.File( 'reply.png', fileUpload);
             parseFile.save().then(function() {//you need to call after save the file
                 var mainImg = parseFile._url;
                 console.log("url: " + mainImg );
 
                 saveData.mainImg = mainImg;
                 writeCommentProcess( saveData );
             });
         }else{ 
             writeCommentProcess( saveData );
         }
 
         console.log(saveData);
 
        
    }else{
        openLoginModal();
    }
}

var likeUp = function( commentId ){
    //like여부 체크후, 안했으면 +1 
    var user = Parse.User.current();
    if(user){
        var query = new Parse.Query('Like');
        query.equalTo('user', user);
        query.equalTo('commentId', commentId);
        query.count().then(
            count=>{
                if(count > 0 ){
                    alert("이미 좋아요 하셨습니다.");
                }else{
                    //신규추가 
                    var Like = Parse.Object.extend("Like");
                    var like = new Like();
                    like.set('user', user);
                    like.set('commentId', commentId);
                    like.save().then(
                        success=>{ 
                            //본인의 like 카운트 업데이트  
                            var q = new Parse.Query('Comment');
                            q.get( commentId ).then(
                                obj=>{
                                    // alert(JSON.stringify(obj));
                                    obj.increment('like');
                                    obj.save();
                                },
                                (o,e)=>{
                                    alert(e.message);
                                }
                            )

                            //html 숫자올리기 
                            var countEl = $("#like-" + commentId);
                            var count = countEl.text() || 0; 
                            countEl.text( Number(count) + 1 );
                        },
                        (o,e)=>{
                            alert(e.message);
                        }
                    )

                }
            }   
        )

        
    }else{
        openLoginModal();
    }

}

var openLoginModal = function(){
    alert("로그인이 필요합니다.");
    //로그인창 띄우기 
    $(".login_list").fadeIn(); 
    $(".login_list").addClass("black");
}
////////////////////////////////////////////////////////////
// 최신글 더보기 
var currentNo = 2;
var more = function(category){
    console.log(category);
    let moreList = $("#more-list");
    let moreBtn = $("#more-btn");

    if(!category){
        category="main";
    }
    //로딩 
    $.get("/more/"+ category +"/" + currentNo++, function(result){
        if(result){
            moreList.append(result)
        }else{
            moreBtn.hide();
        } 
    }) 
}

//검색 더보기 
var moreSearch = function(q){
    if(!q){
        alert("검색어가 없습니다.");
        return;
    }
    console.log(q);
    let moreList = $("#more-list");
    let moreBtn = $("#more-btn");
 
    //로딩 
    $.get("/search/more/" + ( currentNo++ ) + "?q=" + encodeURIComponent(q), function(result){
        if(result){
            moreList.append(result)
        }else{
            moreBtn.hide();
        } 
    }) 
}


//Video 더보기 
var moreVideo = function(q){ 
    let moreList = $("#more-list");
    let moreBtn = $("#more-btn");
 
    //로딩 
    $.get("/video/more/" + ( currentNo++ ), function(result){
        if(result){
            moreList.append(result)
        }else{
            moreBtn.hide();
        } 
    }) 
}

// 내가 쓴글 더보기 
var moreMySTS = function( user_id ){
    let moreList = $("#more-list");
    let moreBtn = $("#more-btn");
 
    //로딩 
    $.get("/sts/more/" + user_id + "/"+ ( currentNo++ ), function(result){
        if(result){
            moreList.append(result)
        }else{
            moreBtn.hide();
        } 
    }) 
}

// 뉴스레터 
var sendNewsletter = function(){
    let emailEl = $("#newsletter_email");
    let email = emailEl.val();


    if( validateEmail(email)){
        //등록 
        var query = new Parse.Query('Newsletter');
        query.equalTo('email', email);
        query.count().then(
            cnt=>{
                if(cnt>0){
                    alert("이미 등록된 이메일입니다.");

                }else{
                    if(confirm("등록하시겠습니까?")){
                        var Newsletter = Parse.Object.extend('Newsletter');
                        var newsletter = new Newsletter();
                        newsletter.set('email', email);
                        newsletter.save().then(
                            result=>{
                                alert("등록되었습니다.");
                                emailEl.val('');
                            },
                            (o,e)=>{
                                alert(e.message);
                            }
                        )
                    }
                }
            },
            error=>{
                alert(e.message);
            }
        )
    }else{
        alert("유효한 이메일 형태가 아닙니다.");
    }
}

function validateEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email.toLowerCase());
}


// 이미지 미리보기 
var uploadDelete = function( id ){ 
    $("#comment-form-upload-"+ id).hide();
    $("#comment-form-upload-delete-"+id).val(1); //업로드 이미지 삭제 flag 1
}
var previewImage = function(){
    /** input-파일썸네일 이미지 스크립트 **/ 
    var fileTarget = $('.filebox .upload-hidden');

    fileTarget.on('change', function(){
        if(window.FileReader){
            // 파일명 추출
            var filename = $(this)[0].files[0].name;
        } 

        else {
            // Old IE 파일명 추출
            var filename = $(this).val().split('/').pop().split('\\').pop();
        };

        $(this).siblings('.upload-name').val(filename);
    });

    //preview image 
    var imgTarget = $('.preview-image .upload-hidden');

    imgTarget.on('change', function(){
        var parent = $(this).parent();
        parent.children('.upload-display').remove();

        if(window.FileReader){
            //image 파일만
            if (!$(this)[0].files[0].type.match(/image\//)) return;
            
            var reader = new FileReader();
            reader.onload = function(e){
                var src = e.target.result;
                parent.append('<div class="upload-display"><div class="upload-thumb-wrap"><img src="'+src+'" class="upload-thumb"></div><button onclick="imageClear();return false;">delete</button></div>');
            }
            reader.readAsDataURL($(this)[0].files[0]);
        }

        else {
            $(this)[0].select();
            $(this)[0].blur();
            var imgSrc = document.selection.createRange().text;
            parent.append('<div class="upload-display"><div class="upload-thumb-wrap"><img class="upload-thumb"></div><button onclick="imageClear();return false;">delete</button>f</div>');

            var img = $(this).siblings('.upload-display').find('img');
            img[0].style.filter = "progid:DXImageTransform.Microsoft.AlphaImageLoader(enable='true',sizingMethod='scale',src=\""+imgSrc+"\")";        
        }
    });
    
}