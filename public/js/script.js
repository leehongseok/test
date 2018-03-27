$(document).ready(function(){
	//Canvas stuff
	var canvas = $("#canvas")[0];
	var ctx = canvas.getContext("2d");
	var w = $("#canvas").width();
	var h = $("#canvas").height();
	
	// variables
	var cw = 10; //size of snake
	var d; //direction
	var food;
	var score;
	var speed = 50; //speed of snake
	
	//snake
	var snake_array; 
	
	function init(){
		d = "right"; //default direction
		create_snake();
		create_food(); 
		score = 0;
		
		if(typeof game_loop != "undefined") clearInterval(game_loop);
		game_loop = setInterval(paint, speed);
	}
	init();
	
	function create_snake(){
		var length = 20; //default length of snake
		snake_array = [];
		for(var i = length-1; i>=0; i--){
			//This will create a horizontal snake starting from the top left
			snake_array.push({x: i, y:0});
		}
	}
	
	function create_food(){
		food = {
			x: Math.round(Math.random()*(w-cw)/cw), 
			y: Math.round(Math.random()*(h-cw)/cw), 
		};
	}
	
	//snake paint
	function paint(){
		//canvas paint
		ctx.fillStyle = "white";
		ctx.fillRect(0, 0, w, h);
		ctx.strokeStyle = "black";
		ctx.strokeRect(0, 0, w, h);
		
		var nx = snake_array[0].x;
		var ny = snake_array[0].y;

		if(d == "right") nx++;
		else if(d == "left") nx--;
		else if(d == "up") ny--;
		else if(d == "down") ny++;
		
		if(nx == -1 || nx == w/cw || ny == -1 || ny == h/cw || check_collision(nx, ny, snake_array)){
			init(); // 초기화 함수 
			return;
		}  // 게임 over가 되는 경우의 수들 네모 왼,오른,위,아래 쪽으로 나갈시 , 꼬리 밟았을때 게임 over
		
		if(nx == food.x && ny == food.y){
			var tail = {x: nx, y: ny};
			score++;
			create_food();
		}  // 먹을경우 점수 + , 먹이 생성 
		else{
			var tail = snake_array.pop();
			tail.x = nx; tail.y = ny;
		}
		//The snake can now eat the food.
		
		snake_array.unshift(tail);
		
		for(var i = 0; i < snake_array.length; i++){
			var c = snake_array[i];
			paint_cell(c.x, c.y);
		}
		
		//food paint
		paint_cell(food.x, food.y);
		var score_text = "Score: " + score;
		ctx.fillText(score_text, 5, h-5);
	}
	
	//lets first create a generic function to paint cells
	function paint_cell(x, y){
		ctx.fillStyle = "black";
		ctx.fillRect(x*cw, y*cw, cw, cw);
		ctx.strokeStyle = "white";
		ctx.strokeRect(x*cw, y*cw, cw, cw);
	}
	
	function check_collision(x, y, array){
		for(var i = 0; i < array.length; i++){
			if(array[i].x == x && array[i].y == y)
			 return true;
		}
		return false;
	}
	
	//keyboard controls
	$(document).keydown(function(e){
		var key = e.which;
		if(key == "37" && d != "right") d = "left";
		else if(key == "38" && d != "down") d = "up";
		else if(key == "39" && d != "left") d = "right";
		else if(key == "40" && d != "up") d = "down";
	})	
})