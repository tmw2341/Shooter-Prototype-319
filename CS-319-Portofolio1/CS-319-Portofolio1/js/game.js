function startGame() {
    init();
    myGameArea.start();
    myGameArea.newPiece();
    myGameArea.spawnPoint = new spawnPoint(90, 90, "blue", 15, 15, myGameArea.username, myGameArea.username + "spawn");
    myGameArea.pieces.push(new component(30, 30, "green", 150, 150, "Steve", "Steve" + myGameArea.pieces.length));
}

function spawnPoint(width, height, color, x, y, owner, id) {
    this.id = id;
    this.owner = owner;
    this.width = width;
    this.height = height;
    this.x = x;
    this.y = y;
    this.color = color;
    this.updateSpawn = function () {
        ctx = myGameArea.context;
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
}

var myGameArea = {
    username: localStorage.getItem('username'),
    pieces: [],
    spawnPoint,
    numPiece: 0,
    color: null,
    canvas: null,
    start: function () {
        this.context = this.canvas.getContext('2d');
        this.color = "red";
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
            for (let i = 0; i < myGameArea.pieces.length; ++i){
                if (myGameArea.move && myGameArea.pieces[i].clicked()) {
                    myGameArea.newX = e.pageX;
                    myGameArea.newY = e.pageY;
                }
            }
        })
    },
    clear: function () {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    },
    boundaryCheck: function () {
        for (let i = 0; i < myGameArea.pieces.length; i++) {
            if (myGameArea.pieces[i].x <= 0) {
                myGameArea.pieces[i].x = 1;
            }
            if (myGameArea.pieces[i].x + myGameArea.pieces[i].width >= myGameArea.canvas.width) {
                myGameArea.pieces[i].x = myGameArea.canvas.width - 1 - + myGameArea.pieces[i].width;
            }
            if (myGameArea.pieces[i].y <= 0) {
                myGameArea.pieces[i].y = 1;
            }
            if (myGameArea.pieces[i].y + myGameArea.pieces[i].height >= myGameArea.canvas.height) {
                myGameArea.pieces[i].y = myGameArea.canvas.height - 1 - + myGameArea.pieces[i].height;
            }
        }
    },
    newPiece: function () {
        let newComp = new component(30, 30, this.color, 45, 45, this.username, this.username + this.numPiece);
        for (let i = 0; i < myGameArea.pieces.length; i++) {
            if (newComp.collision(myGameArea.pieces[i])) {
                return;
            }
        }
        ++this.numPiece;
        myGameArea.pieces.push(newComp);
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
    this.defaultColor = color;
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
    this.collide = function () {
        for (let i = 0; i < myGameArea.pieces.length; i++) {
            if (myGameArea.pieces[i] != this) {
                if (this.collision(myGameArea.pieces[i])) {
                    if (myGameArea.pieces[i].username != this.username) {
                        myGameArea.pieces[i].delete();
                        this.delete();
                    } else {
                        let myleft = this.x;
                        let myright = this.x + (this.width);
                        let mytop = this.y;
                        let mybottom = this.y + (this.height);
                        let otherleft = myGameArea.pieces[i].x;
                        let otherright = myGameArea.pieces[i].x + (myGameArea.pieces[i].width);
                        let othertop = myGameArea.pieces[i].y;
                        let otherbottom = myGameArea.pieces[i].y + (myGameArea.pieces[i].height);
                        console.log("There is a collision.");
                        if (mybottom - othertop < 30) {
                            this.y = this.y - 5;
                        }
                        if (mytop - otherbottom > -30) {
                            this.y = this.y + 5;
                        }
                        if (myright - otherleft < 30) {
                            this.x = this.x - 5;
                        }
                        if (myleft - otherright > -30) {
                            this.x = this.x + 5;
                        }
                        this.update();
                        return true;
                    }
                }
            }
        }
        return false;
    }
    this.collision = function (otherobj) {
        let myleft = this.x;
        let myright = this.x + (this.width);
        let mytop = this.y;
        let mybottom = this.y + (this.height);
        let otherleft = otherobj.x;
        let otherright = otherobj.x + (otherobj.width);
        let othertop = otherobj.y;
        let otherbottom = otherobj.y + (otherobj.height);
        let crash = true;
        if ((mybottom < othertop) || (mytop > otherbottom) || (myright < otherleft) || (myleft > otherright)) {
            crash = false;
        }
        return crash;
    }
    this.delete = function () {
        for (let i = 0; i < myGameArea.pieces.length; i++) {
            if (myGameArea.pieces[i].x == this.x && myGameArea.pieces[i].y == this.y ) {
                myGameArea.pieces.splice(i, 1);
            }
        }
    }
}

function posDebug() {
    for (let i = 0; i < myGameArea.pieces.length; ++i) {
        console.log(myGameArea.username + ": Box " + myGameArea.pieces[i].id + " is located at: " + myGameArea.pieces[i].x + " " + myGameArea.pieces[i].y);
    }
}

function updateGameArea() {
    myGameArea.clear();
    myGameArea.spawnPoint.updateSpawn();
    for (let i = 0; i < myGameArea.pieces.length; ++i){
        if (myGameArea.pieces[i].clicked() && !myGameArea.pieces[i].collide() && myGameArea.pieces[i].username == myGameArea.username) {
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
            myGameArea.pieces[i].collide();
            myGameArea.boundaryCheck();
        } else {
            myGameArea.pieces[i].color = myGameArea.pieces[i].defaultColor;
        }
        myGameArea.pieces[i].update();
    }
}
