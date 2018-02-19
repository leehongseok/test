jQuery(document).ready(function(){
 /*   var slide=$('.slider_img>div'); // 슬라이드 이미지
	var btn1=$('.btn>span');
	var currentt=0; // 현재 보이는 이미지
    var setIntervalId; // clearInterval을 쓰기 위해 변수명이 필요함
    var leftBtn=$('.prev_btn');
	var rightBtn=$('.next_btn');
	

	   btn1.on({click:function(){
      var tg2=$(this);
      var i2=tg2.index();
      
      btn1.removeClass('on1');
      tg2.addClass('on1');
      
      move03(i2);
      }
   });
   
    $('.slider_img').on({
      mouseover:function(){
         clearInterval(setIntervalId02);
      },mouseout:function(){
         timer03();
      }
   }); 
   
   timer03();
   function timer03(){
      setIntervalId02=setInterval(function(){
         var n2=currentt+1;
		 if(n2==3){
            n2=0;
         }
         btn1.eq(n2).trigger('click');
      },2000);
   }
   
   function move03(i2){
      if(currentt ==i2) return;
      
      var currentEl0=slide.eq(currentt);
      var nextEl0=slide.eq(i2);
      
      currentEl0.css('left','0').stop().animate({left:'-100%'});
      nextEl0.css('left','100%').stop().animate({left:0});
      
      currentt=i2;
   };
    rightBtn.click(function(){
        i2=currentt+1;
        if(i2 == slide.size()) {currentt=2;i=0;}
        move03(i2);
    });	
    leftBtn.click(function(){
        i2=currentt-1;
        if(i2<0){currentt=0; i=2;}
        move03(i2);
    });	*/
    $(".slider_img").slick({
        dots: true,
        infinite: true,
        variableWidth: true
      });
    $('.bg-back-opacity').click(function(){
        $('.bg-back-opacity').css('display','none');
        $('.bg-back-pw').css('display','none');
    });
    $('.tr-th2').click(function(){
        $('.bg-back-pw').css('display','block');
        $('.bg-back-opacity').css('display','block');
    });


    $('.login-li').click(function(){
        $('.bg-back-login').css('display','block');
        $('.bg-back-opacity').css('display','block');
    });
    $('.bg-back-opacity').click(function(){
        $('.bg-back-opacity').css('display','none');
        $('.bg-back-login').css('display','none');
    });
    $('.nav-login').click(function(){
        $('.bg-back-login').css('display','block');
        $('.bg-back-opacity').css('display','block');
    });
    $('.search').click(function(){
        $('.searchmenu').css('display','block').animate({top:0},500);
    });
    $('.searchmenu-center-searchbar-btn').click(function(){
        $('.searchmenu').css('display','none').animate({top:'-150px'},500);
    });
    $('.nav-center>ul>li').hover(function(){
        $(this).find('p').addClass('border-bottom');
        $(this).find('div').css('display','block');
    },function(){
        $(this).find('p').removeClass('border-bottom');
        $(this).find('div').css('display','none');
    });

    var mySlider=$('.section1-bx-content ul').bxSlider({
		mode:"horizontal",
		speed:500,
		pager:false,
		movelides:1,
		slideWidth:500,
		minSlides:3,
		maxSlides:3,
		slideMargin:10,
		auto:true,
		autoHover:true,
		controls:false
	});
	$('.section1-bx-left').on('click',function(){
		mySlider.goToPrevSlide();
		return false;
	});
	$('.section1-bx-right').on('click',function(){
		mySlider.goToNextSlide();
		return false;
    });
    var navlilist=$('.nav>div>ul>li');
    $('.nav>div>ul>li').on('click',function(){
        var tgs= $(this);
        var numbers=tgs.index();
        navlilist.removeClass('onn');
        tgs.addClass('onn');
    });
    $('.header_top-rightmenu-m-top-menu').click(function(){
        $('.nav').addClass('display-block');
        $('.header_top-rightmenu-m-top-menu').addClass('display-none');
        $('.header_top-rightmenu-m-top-menu2').addClass('display-block');
    });
    $('.header_top-rightmenu-m-top-menu2').click(function(){
        $('.nav').removeClass('display-block');
        $('.header_top-rightmenu-m-top-menu2').removeClass('display-block');
        $('.header_top-rightmenu-m-top-menu').removeClass('display-none');
    });
    $(".main-left-ul").mCustomScrollbar({
        //setWidth: false,				//내용의 너비
        //setHeight: false,				//내용의 높이
        axis:"x",						//세로
        theme: "minimal-dark",
        horizontalScroll:true,			//가로
        mouseWheelPixels : 300,			//마우스휠 속도
        alwaysShowScrollbar: 0,
        scrollbarPosition: "inside",
        autoHideScrollbar: true,
        contentTouchScroll: true,		//터치슬라이드활성화
        advanced:{autoExpandHorizontalScroll:true},
        mouseWheel:{ axis: "x" },	//마우스 휠 스크롤 축
    });


});