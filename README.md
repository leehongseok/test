
[실행]
nodemon bin/www  
http://localhost:8080 으로 접속 
*nodemon을 쓰면 파일이 바뀔때마다 자동으로 node재시작됨 
*설치방법: npm install -g nodemon


*부가설명
layout/base.hbs => 항상 기본으로 사용됨 
(base.hbs 안에보면 {{{body}}} <-요게 있는데 여기에 view가 들어갑니다.


partials/*.hbs => 컴퍼넌트로 사용됨
{{ > latest-item }} 이렇게하면 html이 들어갑니다. 

*scss
public/css/style.scss 파일에 작업하시면 됩니다.