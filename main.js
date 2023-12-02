const canvas=document.getElementById("myCanvas");
canvas.width=600;

const ctx = canvas.getContext("2d");
const road = new Road(canvas.width/2, canvas.width*0.9);
const ship=new Ship(road.getLaneCenter(2),100,30,50, "AI");
const traffic = [
    new Ship(road.getLaneCenter(2),-100,30,50, "DUMMY", 2)
];

animate();

function animate() {
    for(let i=0;i<traffic.length;i++) {
        traffic[i].update(road.borders, []);
    }
    ship.update(road.borders, traffic);
    
    canvas.height=window.innerHeight;

    ctx.save();
    ctx.translate(0, -ship.y+canvas.height*0.75);
    road.draw(ctx);
    for(let i=0;i<traffic.length;i++) {
        traffic[i].draw(ctx, "red");
    }
    ship.draw(ctx, "#7C4700");

    ctx.restore();
    requestAnimationFrame(animate);
}