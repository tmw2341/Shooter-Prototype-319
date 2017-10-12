function startGame() {
    init();
    myGameArea.start();
    myGameArea.pieces.push(new component(30, 30, "red", 30, 30, myGameArea.username, myGameArea.username + myGameArea.pieces.length));
    myGameArea.pieces.push(new component(30, 30, "red", 60, 30, myGameArea.username, myGameArea.username + myGameArea.pieces.length));
}

var myGameArea = {
    username: localStorage.getItem('username'),
    pieces: [],
    canvas: null,
    start: function () {
        this.context = this.canvas.getContext('2d');
        this.interval = setInterval(updateGameArea, 20);
        window.addEventListener('mousedown', function (e) {
            if (e.pageX > 0 && e.pageY > 0) {
                myGameArea.move = true;
                myGameArea.x = e.pageX;
                myGameArea.y = e.pageY;
            }
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

function component(width, height, color, x, y, username, id) {
    this.id = id;
    this.username = username;
    this.width = width;
    this.height = height;
    this.x = x;
    this.y = y;
    this.speedX = 0;
    this.speedY = 0;
    this.color = color;
    this.update = function () {
        ctx = myGameArea.context;
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
    this.clicked = function () {
        let myleft = this.x + myGameArea.canvas.getBoundingClientRect().left;
        let myright = this.x + ((this.width) + myGameArea.canvas.getBoundingClientRect().left);
        let mytop = this.y + myGameArea.canvas.getBoundingClientRect().top;
        let mybottom = this.y + ((this.height) + myGameArea.canvas.getBoundingClientRect().top);
        let clicked = false;
        if ((mybottom > myGameArea.y) && (mytop < myGameArea.y)
            && (myright > myGameArea.x) && (myleft < myGameArea.x)) {
            console.log(this.id + " has been clicked");
            clicked = true;
        }
        return clicked;
    }
}

function posDebug() {
    for (i = 0; i < myGameArea.pieces.length; ++i) {
        console.log(myGameArea.username + ": Box " + myGameArea.pieces[i].id + " is located at: " + myGameArea.pieces[i].x + " " + myGameArea.pieces[i].y);
    }
}

function updateGameArea() {
    myGameArea.clear();
    for (i = 0; i < myGameArea.pieces.length; ++i){
        if (myGameArea.pieces[i].clicked() && myGameArea.pieces[i].username == myGameArea.username) {
            myGameArea.pieces[i].color = "yellow";
            if (myGameArea.y < 0 || myGameArea.newY < 0 || myGameArea.x < 0 || myGameArea.newX < 0) {
                break;
            }
            if (Math.abs(myGameArea.y - myGameArea.newY) > 50 || Math.abs(myGameArea.x - myGameArea.newX) > 50) {
                break;
            }
            myGameArea.pieces[i].x -= myGameArea.x - myGameArea.newX;
            myGameArea.pieces[i].y -= myGameArea.y - myGameArea.newY;
            myGameArea.x = myGameArea.newX;
            myGameArea.y = myGameArea.newY;
        } else {
            myGameArea.pieces[i].color = "red";
        }
        myGameArea.pieces[i].update();
    }
}
