const canvas=document.getElementById("myCanvas");
canvas.width=600;

const ctx = canvas.getContext("2d");
const road = new Road(canvas.width/2, canvas.width*0.5);

//const ship = new Ship(road.getLaneCenter(2), 100, 30, 50, "AI");
const N = 100;
const ships = generateShips(N);
let bestOne = ships[0];
if (localStorage.getItem("bestBrain")) {
    for(let i=0; i < ships.length; i++) {
        ships[i].brain = JSON.parse(
            localStorage.getItem("bestBrain")
        );
        if(i!=0) {
            NeuralNetwork.mutate(ships[i].brain, 0.2);
        }
    }
   
}

const traffic = [
    new Ship(road.getLaneCenter(2),-100,30,50, "DUMMY", 2),
    new Ship(road.getLaneCenter(1),-400,30,50, "DUMMY", 2),
    new Ship(road.getLaneCenter(0),-400,30,50, "DUMMY", 2),
    new Ship(road.getLaneCenter(4),-700,30,50, "DUMMY", 2),
    new Ship(road.getLaneCenter(3),-700,30,50, "DUMMY", 2),
    new Ship(road.getLaneCenter(4),-1000,30,50, "DUMMY", 2),
    new Ship(road.getLaneCenter(2),-1000,30,50, "DUMMY", 2),
    new Ship(road.getLaneCenter(1),-1300,30,50, "DUMMY", 2),
    new Ship(road.getLaneCenter(3),-1300,30,50, "DUMMY", 2),
    new Ship(road.getLaneCenter(4),-1300,30,50, "DUMMY", 2),
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