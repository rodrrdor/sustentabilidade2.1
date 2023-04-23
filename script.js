const cnv = document.getElementById("canvas");
const ctx = cnv.getContext("2d");
const FPS = 60;
var trashes = [], colors = ["red", "blue", "yellow", "green"], mouse;
var score = 0, mistakes = 0, totalTrash = 1, trashTotal = 1;
var trashCans = new Image(), car = new Image();
var carX = window.innerWidth, run = false;
var timer = 600;

class Trash {
    constructor() {
        this.x = Math.random() * window.innerWidth / 1.1 + window.innerWidth / 20;
        this.y = Math.random() * window.innerHeight / 4 + window.innerHeight / 1.5;
        this.r = window.innerWidth / 32;
        this.color = Math.ceil(Math.random() * 4) - 1;
        this.touched = false;
        this.pressed = false;
    }

    updateTrash() {
        let index = trashes.indexOf(this);
        if (this.x > (cnv.width / 4) && this.x < (cnv.width / 1.35) && this.y > (cnv.height / 5) && this.y < (cnv.height / 1.8) && !this.pressed) {
            if (this.x < (cnv.width / 2.7)) {
                if (this.color == 0) {win();} else {lose();}
            } else if (this.x < (cnv.width / 2)) {
                if (this.color == 1) {win();} else {lose();}
            } else if (this.x < (cnv.width / 1.6)) {
                if (this.color == 2) {win();} else {lose();}
            } else {
                if (this.color == 3) {win();} else {lose();}
            }
        }

        function win() {
            score++;
            timer += 60
            trashes.splice(index, 1);
        }

        function lose() {
            mistakes++;
            timer -= 60
            trashes.splice(index, 1);
        }

        if (score + mistakes == trashTotal) {run = true; timer += 60}
    }

    drawTrash() {
        ctx.strokeStyle = colors[this.color];
        ctx.fillStyle = colors[this.color];
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.r, 0, 2 * Math.PI);
        ctx.fill();
        ctx.stroke();
    }
}

(function init() {
    for (let trash = 0; trash < totalTrash; trash++) {
        trashes.push(new Trash());
    }

    trashCans.src = "images/trashcans.png";
    car.src = "images/car.png";

    addEventListener("mousemove", (e) => {
        mouse = {x: e.clientX, y: e.clientY};
        for (trash in trashes) {
            let hipo = trashes[trash].r - Math.sqrt((mouse.x - trashes[trash].x) * (mouse.x - trashes[trash].x)  + (mouse.y - trashes[trash].y) * (mouse.y - trashes[trash].y));
            if (hipo > 0) {trashes[trash].touched = true;}
            if (hipo < 0) {trashes[trash].touched = false;}
            if (trashes[trash].pressed) {
                trashes[trash].x = e.clientX;
                trashes[trash].y = e.clientY;
            }
        }
    });

    addEventListener("mousedown", (e) => {
        for (trash in trashes.reverse()) {
            if (trashes[trash].touched) {
                trashes[trash].x = e.clientX;
                trashes[trash].y = e.clientY;
                trashes[trash].pressed = true;
                break;
            }
        }
        cnv.requestFullscreen();
    });

    addEventListener("mouseup", () => {
        for (trash in trashes) {
            trashes[trash].pressed = false;
        }
    });
    setInterval(main, 1000 / FPS);
}());

function main() {
    cnv.width = window.innerWidth;
    cnv.height = window.innerHeight;
    udpate();
    draw();
}

function udpate() {
    for (trash in trashes) {
        trashes[trash].updateTrash();
    }
    
    if (run) {
        carX -= cnv.width / 10;
        if (carX <= 0 - cnv.width / 1.3) {
            run = false;
            carX = cnv.width;
            totalTrash++;
            trashTotal += totalTrash;
            for (let trash = 0; trash < totalTrash; trash++) {
                trashes.push(new Trash());
            }
        }
    }
}

function draw() {
    ctx.fillStyle = "#20a0ff";
    ctx.fillRect(0, 0, cnv.width, cnv.height);

    ctx.fillStyle = "black";
    ctx.fillRect(0, cnv.height / 1.8, cnv.width, cnv.height / 2);
    ctx.fillStyle = "gray";
    ctx.fillRect(0, cnv.height / 1.9, cnv.width, cnv.height / 15);

    ctx.fillStyle = "white";
    for (let index = 5; index < Math.round(cnv.width); index += cnv.width / 10) {
        ctx.fillRect(index, cnv.height / 1.3, cnv.width / 20, cnv.height / 30);
    }

    ctx.drawImage(trashCans, cnv.width / 4, cnv.height / 5, cnv.width / 2, cnv.height / 2.75);
    
    for (trash in trashes) {
        trashes[trash].drawTrash();
    }

    ctx.drawImage(car, carX, cnv.height / 1.65, cnv.width / 1.3, cnv.height / 2.75);

    ctx.fillStyle = "black";
    ctx.textAlign = "center";
    ctx.font = "40px Comic Sans MS";
    ctx.fillText("PONTUAÇÃO: " + score, cnv.width / 2, 40);
    ctx.fillText("ERROS: " + mistakes, cnv.width / 2, 80);
    ctx.textAlign = "left";
    (timer > 0) ? ctx.fillText("TEMPO: " + ((timer--) / 60).toFixed(2), cnv.width / 2 - 120, 120) : reset();
}

function reset() {
    trashes = [];
    score = 0; mistakes = 0; 
    totalTrash = 1; trashTotal = 1;
    timer = 600;

    for (let trash = 0; trash < totalTrash; trash++) {
        trashes.push(new Trash());
    }
}