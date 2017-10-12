// JavaScript source code
function startGame() {
    init();
    myGameArea.start();
    myGameArea.pieces.push(new component(30, 30, "red", 30, 30));
    myGameArea.pieces.push(new component(30, 30, "red", 60, 30));
}

var myGameArea = {
    pieces: [],
    canvas: null,
    start: function () {
        this.context = this.canvas.getContext('2d');
        this.interval = setInterval(updateGameArea, 20);
        window.addEventListener('mousedown', function (e) {
            myGameArea.move = true;
            myGameArea.x = e.pageX;
            myGameArea.y = e.pageY;
        })
        window.addEventListener('mouseup', function (e) {
            myGameArea.move = false;
            myGameArea.x = null;
            myGameArea.y = null;
            myGameArea.newX = null;
            myGameArea.newY = null;
        })
        window.addEventListener('mousemove', function (e) {
            for (i = 0; i < myGameArea.pieces.length; ++i){
                if (myGameArea.move && myGameArea.pieces[i].clicked()) {
                    myGameArea.newX = e.pageX;
                    myGameArea.newY = e.pageY;
                } 
            }
        })
    },
    clear: function () {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
}

function init(){
    myGameArea.canvas = document.getElementById('canvas');
}

function component(width, height, color, x, y) {
    this.width = width;
    this.height = height;
    this.x = x;
    this.y = y;
    this.speedX = 0;
    this.speedY = 0;
    this.color = color;
    this.newPos = function () {
        this.x += this.speedX;
        this.y += this.speedY;
    }
    this.update = function () {
        ctx = myGameArea.context;
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
    this.clicked = function () {
        var myleft = this.x + (document.documentElement.clientWidth * 0.02);
        var myright = this.x + ((this.width) + document.documentElement.clientWidth * 0.02);
        var mytop = this.y + (document.documentElement.clientHeight * 0.02);
        var mybottom = this.y + ((this.height) + document.documentElement.clientHeight * 0.02);
        var clicked = false;
        if ((mybottom > myGameArea.y) && (mytop < myGameArea.y)
            && (myright > myGameArea.x) && (myleft < myGameArea.x)) {
            clicked = true;
        }
        return clicked;
    }
}

function updateGameArea() {
    myGameArea.clear();
    for (i = 0; i < myGameArea.pieces.length; ++i){
        if (myGameArea.x && myGameArea.y && myGameArea.newX && myGameArea.newY) {
            myGameArea.pieces[i].x -= myGameArea.x - myGameArea.newX;
            myGameArea.pieces[i].y -= myGameArea.y - myGameArea.newY;
            myGameArea.x = myGameArea.newX;
            myGameArea.y = myGameArea.newY;
        }
        if (myGameArea.pieces[i].clicked()) {
            myGameArea.pieces[i].color = "yellow";
            myGameArea.pieces[i].newPos();
            myGameArea.pieces[i].update();
        } else {
            myGameArea.pieces[i].color = "red";
        }
        myGameArea.pieces[i].newPos();
        myGameArea.pieces[i].update();
    }
}

function moveup() {
    myGameArea.pieces[1].speedY -= 1;
}

function movedown() {
    myGameArea.pieces[1].speedY += 1;
}

function moveleft() {
    myGameArea.pieces[1].speedX -= 1;
}

function moveright() {
    myGameArea.pieces[1].speedX += 1;
}
    
function stopMove() {
    myGameArea.pieces[1].speedX = 0;
    myGameArea.pieces[1].speedY = 0;
}