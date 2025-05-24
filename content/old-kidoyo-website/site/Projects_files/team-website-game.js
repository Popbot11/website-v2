var x = 500;
var y = 250;
var height;
var width;
var ry = 500;
var rx = 100;
var nx = 300;
var ny = 500;
var ex = 500;
var ey = 500;
var sy = 500;
var sx = 700;


function setup() {
    width = 1000;
    height = 500;
    var myCanvas = createCanvas (width, height);
    myCanvas.parent('p5proj');

}
function draw () {
    background (0); 
    fill (color ('lime'));
    rect (x, y, 20, 20);

    if (keyCode == 40) {y += 5};
    if (keyCode == 38) {y -= 5};
    if (keyCode == 37) {x -= 5};
    if (keyCode == 39) {x += 5};
    if (keyCode == 13) {x = 500
                        y = 250};


    if (x >= 1000) {x = 1};
    if (x <= 0) {x = 1000};
    if (y >= 500) {y = 1};
    if (y <= 0) {y = 500};
    
    if (y <= ry + 25 && y >= ry - 25 && x <= rx + 100 && x >= rx - 100) {
    	
        window.location = 'http://popbot1.oyosite.com/website/index.html'
    };
        if (y <= ny + 25 && y >= ny - 25 && x <= nx + 100 && x >= nx - 100) {
    	
        window.location = 'http://ticon.oyosite.com'
    };
        if (y <= ey + 25 && y >= ey - 25 && x <= ex + 100 && x >= ex - 100) {
    	
        window.location = 'http://emreiscool.oyosite.com/index.html'
    };
        if (y <= sy + 25 && y >= sy - 25 && x <= sx + 100 && x >= sx - 100) {
    	
        window.location = 'http://magnum.oyosite.com/'
    };

}

