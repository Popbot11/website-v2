//for herp.html

var x = 1140;
var y = 200;
var ww;
var wh;
var ex = 100;
var ey = 200;
var fx = 100;
var fy = 200;
var gx = 100;
var gy = 200;
var hits = 10;
var wx = 1000;
var wy = 0;
var bx = x;
var by = y;

function setup (){
    ww=1300;
    wh=400;
    createCanvas (ww, wh);
    fill ('purple')
    ey = Math.random()* 400;
    fy = Math.random()* 400;
    gy = Math.random()* 400;
}

function draw (){
    background (0);    
    rect(x, y, 20, 20);
    fill ('green')


    rect(ex, ey, 25, 25);
    ex += 20;
    fill ("red")
    rect(fx, fy, 25, 25);
    fx += 10;
    fill ('orange')
    rect(gx, gy, 25, 25);
    gx += 5;   
    fill ('yellow')
    rect (wx, wy, 20, 400);
    fill ('blue')

    //bullet

    rect (bx + 10, by + 10, 5, 5)
    fill ('lime')
    if (keyCode == 32) {for (i = 0;i < 5;i++){bx -= 5};};
    if (keyCode == 82) {bx = x
                        by = y}


    if (ex >= 1320) {ex = 50};
    if (fx >= 1320) {fx = 50};
    if (gx >= 1320) {gx = 50};

    if (ex == 50) {ey = Math.random()* 400};
    if (fx == 50) {fy = Math.random()* 400};
    if (gx == 50) {gy = Math.random()* 400};

    if (y == 0 && keyCode == UP_ARROW) {y = 380;
                                       by = 380;};
    if (y == 400 && keyCode == DOWN_ARROW) {y = 0;
                                           by = 0;};
    if (x >= 1300 && keyCode == RIGHT_ARROW) {x = 1020;
                                             bx = 1020;};
    if (x <= 1000 && keyCode == LEFT_ARROW) {x = 1280;
                                            bx = 1280;};


    if (hits >= 15) {ex = -500
    fx = -500
    gx = -500
    background (100)
    x = -500
    hits += 15};  
    

    
    if (ey <= by + 5 && ey >= by - 5 && ex <= bx + 5 && ex >= bx - 5) {console.log('here');ex = 25
    ex = -1100000000000000000000};
    if (fy <= by + 5 && fy >= by - 5 && fx <= bx + 5 && fx >= bx - 5) {console.log('here');fx = 25
    fx = -1100000000000000000000};
    if (gy <= by + 5 && gy >= by - 5 && gx <= bx + 5 && gx >= bx - 5) {console.log('here');gx = 25
    gx = -1100000000000000000000};
    
    if (ex == -500) {ex = -500};
    if (fx == -500) {fx = -500};
    if (gx == -500) {gx = -500};
    

    if (ey <= y + 25 && ey >= y - 25 && ex <= x + 25 && ex >= x - 25) {console.log('here');ex = 25
    hits += 1
    ey = Math.random()* 400};
    if (fy <= y + 25 && fy >= y - 25 && fx <= x + 25 && fx >= x - 25) {console.log('here');fx = 25
    hits += 1
    fy = Math.random()* 400};
    if (gy <= y + 25 && gy >= y - 25 && gx <= x + 25 && gx >= x - 25) {console.log('here');gx = 25
    hits += 1
    gy = Math.random()* 400};
    
	
        
        
        
        
}




function keyPressed () {
    if (keyCode == UP_ARROW) {y -= 20
    by -= 20};
    if (keyCode == LEFT_ARROW) {x -= 25
    bx -= 25};
    if (keyCode == DOWN_ARROW) {y += 20
    by += 20};
    if (keyCode == RIGHT_ARROW) {x += 25
    bx += 25}; 
    // e
    if (keyCode == 69) {ex = -500
    					fx = -500
    					gx = -500
   					 	ex = -500
  					    background (100)
  					    x = -500
    					hits = 15};
    // q
    if (keyCode == 81)  { x = 1140;
                         y = 200;
                         ex = 100;
                         ey = 200;
                         fx = 100;
                         fy = 200;
                         gx = 100;
                         gy = 200;
                         hits = 10;
                        background (0);};}




