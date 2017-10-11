// JavaScript source code
function startGame() {
    init();
    myGameArea.start();
    myGamePiece = new component(10, 10, "red", 30, 30);
}

var myGameArea = {
    canvas: null,
    start: function () {
        this.context = this.canvas.getContext('2d');
        this.interval = setInterval(updateGameArea, 20);
        window.addEventListener('mousedown', function (e) {
            myGameArea.move = true;
            myGameArea.x = e.pageX;
            myGameArea.y = 
        })

        window.addEventListener('mouseup', function (e) {
            window.removeEventListener('mousemove', e);
            myGameArea.move = false;
        })
        window.addEventListener('mousemove', function (e) {
            if (myGameArea.move) {
                myGameArea.x = e.pageX;
                myGameArea.y = e.pageY;
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
        var myleft = this.x;
        var myright = this.x + (this.width);
        var mytop = this.y;
        var mybottom = this.y + (this.height);
        var clicked = false;
        if ((mybottom > myGameArea.y) || (mytop < myGameArea.y)
            || (myright > myGameArea.x) || (myleft < myGameArea.x)) {
            clicked = true;
        }
        return clicked;
    }
}

function updateGameArea() {
    myGameArea.clear();
    if (myGameArea.x && myGameArea.y) {
        myGamePiece.x = myGameArea.x;
        myGamePiece.y = myGameArea.y;
    }
    if (myGamePiece.clicked) {
        myGamePiece.color = "yellow";
    }
    myGamePiece.newPos();
    myGamePiece.update();
}

function moveup() {
    myGamePiece.speedY -= 1;
}

function movedown() {
    myGamePiece.speedY += 1;
}

function moveleft() {
    myGamePiece.speedX -= 1;
}

function moveright() {
    myGamePiece.speedX += 1;
}
    
function stopMove() {
    myGamePiece.speedX = 0;
    myGamePiece.speedY = 0;
}