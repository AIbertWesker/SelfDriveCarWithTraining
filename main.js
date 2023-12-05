const canvas=document.getElementById("myCanvas");
canvas.width=600;

const ctx = canvas.getContext("2d");
const road = new Road(canvas.width/2, canvas.width*0.9);

//const ship = new Ship(road.getLaneCenter(2), 100, 30, 50, "AI");
const N = 300;
const ships = generateShips(N);
let bestOne = ships[0];
if (localStorage.getItem("bestBrain")) {
    bestOne.brain = JSON.parse(
        localStorage.getItem("bestBrain")
    );
}

const traffic = [
    new Ship(road.getLaneCenter(2),-100,30,50, "DUMMY", 2),
    new Ship(road.getLaneCenter(1),-200,30,50, "DUMMY", 2),
    new Ship(road.getLaneCenter(0),-200,30,50, "DUMMY", 2),
    new Ship(road.getLaneCenter(4),-200,30,50, "DUMMY", 2),
    new Ship(road.getLaneCenter(3),-250,30,50, "DUMMY", 2)
];

animate();

function save() {
    localStorage.setItem("bestBrain",
        JSON.stringify(bestOne.brain));
}

function generateShips(N) {
    const ships = [];
    for (let i = 1; i <= N; i++) {
        ships.push(new Ship(road.getLaneCenter(2), 100, 30, 50, "AI"));
    }
    return ships;
}

function animate() {
    for(let i=0;i<traffic.length;i++) {
        traffic[i].update(road.borders, []);
    }

    for (let i = 0; i < ships.length; i++) {
        ships[i].update(road.borders, traffic);
    }
    //ship.update(road.borders, traffic);

    bestOne = ships.find(
        e => e.y == Math.min(
            ...ships.map(e => e.y)
        ));

    canvas.height=window.innerHeight;

    ctx.save();
    ctx.translate(0, -bestOne.y+canvas.height*0.75);
    road.draw(ctx);
    for(let i=0;i<traffic.length;i++) {
        traffic[i].draw(ctx, "red");
    }
    ctx.globalAlpha = 0.2;
    for (let i = 0; i < ships.length; i++) {
        ships[i].draw(ctx, "#7C4700");
    }
    ctx.globalAlpha = 1;
    bestOne.draw(ctx, "#7C4700",true);
    //ship.draw(ctx, "#7C4700");
    ctx.restore();
    requestAnimationFrame(animate);
}