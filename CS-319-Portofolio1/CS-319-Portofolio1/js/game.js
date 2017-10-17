function startGame() {
    init();
    myGameArea.start();
    myGameArea.newUser(localStorage.getItem('username'));
    myGameArea.newUser("Steve");
    myGameArea.newPiece();
    tmp = new component(30, 30, "green", 150, 150, "Steve", "Steve0");
    myGameArea.pieces.push(tmp);
    newPieceServer(tmp);
};

function updatePieces(){
    $.ajax({
        url: "http://localhost:5000/pull",
        crossDomain:true,
        async:true
    }).then(function(data) {
        myGameArea.updatePieces(data['results']);
    });
};

function newPieceServer(piece) {
    console.log("new piece called");
    console.log(piece);
    $.ajax({
        type: "POST",
        url: "http://localhost:5000/new_unit",
        data: piece,
        crossDomain:true,
        async:true
    }).then(function(data) {
        console.log(data);
    });
};

function updatePiecePos(piece) {
    console.log("update piece called");
    console.log(piece);
    $.ajax({
        type: "POST",
        url: "http://localhost:5000/push",
        data: piece,
        crossDomain:true,
        async:true
    }).then(function(data) {
        // No action required for this
    });
};

function spawnPoint(width, height, color, x, y, owner, id) {
    this.id = id;
    this.owner = owner;
    this.width = width;
    this.height = height;
    this.x = x;
    this.y = y;
    this.color = color;
    this.updateSpawn = function () {
        //TODO Add server update
        ctx = myGameArea.context;
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
};

var myGameArea = {
    username: localStorage.getItem('username'),
    users: [],
    pieces: [],
    spawnPoints: [],
    numPiece: 0,
    projNum: 0,
    color: null,
    canvas: null,
    updatePieces: function(newval) {
        // this.pieces = newval;
        for(i=0; i < newval.length; i++) {
            this.pieces[i].x = newval[i].x
            this.pieces[i].y = newval[i].y
        }
    },
    start: function () {
        this.context = this.canvas.getContext('2d');
        this.color = "red";
        this.interval = setInterval(updateGameArea, 20);
        this.interval2 = setInterval(updatePieces, 1000);
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
        let locationX;
        let locationY;
        for (let i = 0; i < myGameArea.spawnPoints.length; i++) {
            if (myGameArea.spawnPoints[i].owner == myGameArea.username) {
                locationX = myGameArea.spawnPoints[i].x + 30;
                locationY = myGameArea.spawnPoints[i].y + 30;
            }
        }
        let newComp = new component(30, 30, this.color, locationX, locationY, this.username, this.username + this.numPiece);
        for (let i = 0; i < myGameArea.pieces.length; i++) {
            if (newComp.collision(myGameArea.pieces[i])) {
                return;
            }
        }
        ++this.numPiece;
        console.log(newComp);
        newPieceServer(newComp);
        myGameArea.pieces.push(newComp);
    },
    fire: function () {
        for (let i = 0; i < myGameArea.pieces.length; i++) {
            if (myGameArea.pieces[i].type == "piece" && myGameArea.pieces[i].username == this.username) {
                myGameArea.pieces[i].newProjectile();
            }
        }
    },
    newUser: function (name) {
        if (myGameArea.users.indexOf(name) == -1) {
            let index = myGameArea.users.length;
            let newSpawn;
            switch (index) {
                case 0:
                    newSpawn = new spawnPoint(90, 90, "blue", 15, 15, name, name + "spawn");
                    break;
                case 1:
                    newSpawn = new spawnPoint(90, 90, "blue", 395, 395, name, name + "spawn");
                    break;
                case 2:
                    newSpawn = new spawnPoint(90, 90, "blue", 395, 15, name, name + "spawn");
                    break;
                case 3:
                    newSpawn = new spawnPoint(90, 90, "blue", 15, 395, name, name + "spawn");
                    break;
                case 4:
                    newSpawn = new spawnPoint(90, 90, "blue", 205, 205, name, name + "spawn");
                    break;
            }
            myGameArea.users.push(name);
            myGameArea.spawnPoints.push(newSpawn);
        } else {
            console.log("User: " + name + " already exists.")
        }
    }
};

function init(){
    myGameArea.canvas = document.getElementById('canvas');
};

function component(width, height, color, x, y, username, id) {
    this.id = id;
    this.username = username;
    this.type = "piece";
    this.width = width;
    this.height = height;
    this.prevX = x;
    this.prevY = y;
    this.x = x;
    this.y = y;
    this.speedX = 0;
    this.speedY = 0;
    this.defaultColor = color;
    this.color = color;
    this.clickCounter = 0;
    this.newProjectile = function () {
        let selectedPiece;
        console.log("Pew!!");
        for (let i = 0; i < myGameArea.pieces.length; i++) {
            if (myGameArea.pieces[i].type == "piece") {
                if (myGameArea.pieces[i].username != this.username && myGameArea.pieces[i].username != undefined) {
                    let randomBoolean = Math.random() >= 0.5;
                    if (randomBoolean) {
                        selectedPiece = myGameArea.pieces[i];
                        break;
                    }
                }
            }
        }
        if (selectedPiece != undefined) {
            ++myGameArea.projNum;
            let toAdd = new projectile(this.x + (this.width / 2), this.y + (this.height / 2), this.username, this.username + "proj" + myGameArea.projNum, selectedPiece.x + (selectedPiece.width / 2), selectedPiece.y + (selectedPiece.height / 2))
            newPieceServer(toAdd);
            myGameArea.pieces.push(toAdd);
        }
    };

    this.update = function () {
        //TODO Server code
        if (isNaN(this.x) && isNaN(this.y)) {
            this.x = this.prevX;
            this.y = this.prevY;
        }
        ctx = myGameArea.context;
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
    };

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
        this.clickCounter++;
        if (this.clickCounter % 3 == 0) {
            //TODO Add unit update here.
        }
        return clicked;
    };

    this.collide = function () {
        for (let i = 0; i < myGameArea.pieces.length; i++) {
            if (myGameArea.pieces[i] != this) {
                if (this.collision(myGameArea.pieces[i]) && myGameArea.pieces[i].type != "projectile") {
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
    };

    this.collision = function (otherobj) {
        try {
            if(otherobj == null) { throw error()}
        } catch(err) {
            console.log(err.message);
            return false;
        }

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
    };

    this.delete = function () {
        for (let i = 0; i < myGameArea.pieces.length; i++) {
            if (myGameArea.pieces[i].x == this.x && myGameArea.pieces[i].y == this.y ) {
                myGameArea.pieces.splice(i, 1);
                //TODO Add delete server code
            }
        }
    };
}

function projectile(x, y, username, id, targetX, targetY) {
    this.x = x;
    this.y = y;
    this.width = 10;
    this.height = 10;
    this.username = username;
    this.id = id;
    this.defaultColor = "black";
    this.color = "black";
    this.type = 'projectile';
    this.targetX = targetX;
    this.targetY = targetY;
    this.speedX = (targetX - x)/ 100;
    this.speedY = (targetY - y)/ 100;
    this.update = function () {
        //Add server Code
        ctx = myGameArea.context;
        ctx.fillStyle = this.color;
        this.newPos();
        ctx.fillRect(this.x, this.y, this.width, this.height);
    };

    this.newPos = function () {
        this.x += this.speedX;
        this.y += this.speedY;
        if (this.x < 0 || this.x > myGameArea.canvas.width || this.y < 0 || this.y > myGameArea.canvas.height) {
            this.delete();
            //TODO Delete from server
        } else {
            updatePiecePos(this);
        }
    };

    this.collide = function () {
        for (let i = 0; i < myGameArea.pieces.length; i++) {
            if (myGameArea.pieces[i] != this && myGameArea.pieces[i].type == "piece") {
                if (this.collision(myGameArea.pieces[i])) {
                    if (myGameArea.pieces[i].username != this.username) {
                        myGameArea.pieces[i].delete();
                        this.delete();
                    } else {
                        console.log("There is a collision.");
                        this.update();
                        return true;
                    }
                }
            }
        }
        return false;
    };

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
        console.log("Collision Checked.")
        if ((mybottom < othertop) || (mytop > otherbottom) || (myright < otherleft) || (myleft > otherright)) {
            crash = false;
        }
        return crash;
    };

    this.clicked = function () {
        return false;
    };

    this.delete = function () {
        for (let i = 0; i < myGameArea.pieces.length; i++) {
            if (myGameArea.pieces[i] == this) {
                myGameArea.pieces.splice(i, 1);
                //TODO Add delete server code
            }
        }
    };
}

function posDebug() {
    for (let i = 0; i < myGameArea.pieces.length; ++i) {
        console.log(myGameArea.username + ": Box " + myGameArea.pieces[i].username + " is located at: " + myGameArea.pieces[i].x + " " + myGameArea.pieces[i].y);
    }
};

function updateGameArea() {
    myGameArea.clear();
    for (let j = 0; j < myGameArea.spawnPoints.length; j++) {
        myGameArea.spawnPoints[j].updateSpawn();
    }
    for (let i = 0; i < myGameArea.pieces.length; ++i) {
            if (myGameArea.pieces[i].clicked() && !myGameArea.pieces[i].collide() && myGameArea.pieces[i].username == myGameArea.username) {
                myGameArea.pieces[i].color = "yellow";
                if (myGameArea.y < 0 || myGameArea.newY < 0 || myGameArea.x < 0 || myGameArea.newX < 0) {
                    break;
                }
                if (Math.abs(myGameArea.y - myGameArea.newY) > 50 || Math.abs(myGameArea.x - myGameArea.newX) > 50) {
                    break;
                }
                myGameArea.pieces[i].prevX = myGameArea.pieces[i].x;
                myGameArea.pieces[i].prevY = myGameArea.pieces[i].y;
                myGameArea.pieces[i].x -= myGameArea.x - myGameArea.newX;
                myGameArea.pieces[i].y -= myGameArea.y - myGameArea.newY;
                myGameArea.x = myGameArea.newX;
                myGameArea.y = myGameArea.newY;
                myGameArea.pieces[i].collide();
                myGameArea.boundaryCheck();
            } else {
                myGameArea.pieces[i].collide();
                myGameArea.pieces[i].color = myGameArea.pieces[i].defaultColor;
            }
            myGameArea.pieces[i].update();
        }
}
