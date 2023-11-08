const canvas=document.getElementById("myCanvas");
canvas.width=200;

const ctx = canvas.getContext("2d");
const ship=new Ship(100,100,30,50);


animate();

function animate() {
    ship.update();
    
    canvas.height=window.innerHeight;
    ship.draw(ctx);
    requestAnimationFrame(animate);
}