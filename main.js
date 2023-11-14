const canvas=document.getElementById("myCanvas");
canvas.width=200;

const ctx = canvas.getContext("2d");
const road = new Road(canvas.width/2, canvas.width*0.9);
const ship=new Ship(road.getLaneCenter(1),100,30,50);


animate();

function animate() {
    ship.update();
    
    canvas.height=window.innerHeight;

    ctx.save();
    ctx.translate(0, -ship.y);
    road.draw(ctx);
    ship.draw(ctx);

    ctx.restore();
    requestAnimationFrame(animate);
}