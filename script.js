// Logic for spacing out containers
// the purpose of the container class is to dynamically render out
class container {
    constructor(name, width, height, floatx, x, y) {
        // id of the html element that these things will be applied to 
        this.name = name.toLowerCase();
        
        // width and height of the div element
        this.width = width;
        this.height = height;

        // floatx is either "right" or "left"
        this.floatx = floatx;
        
        // absolute x and y pos.
        // if floatx is left, x is relative to the left side of the screen. 
        // if floatx is right, x is relative to the right side of the screen
        this.x = x;
        this.y = y;
    }

    get rightEdge() {
        if (floatx == "left") {
            return this.x + this.width;
        } else if (floatx == "right") {
            return this.x;
        }
    }

    get leftEdge() {
        if (floatx == "left") {
            return this.x;
        } else if (floatx == "right") {
            return this.x + this.width;
        }
    }
}


// augghh is this a good implementation? we'll see!!
let containers = [
    new container("title", 300, 20, "right", 5, 5),

];