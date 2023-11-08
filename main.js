const canvas=document.getElementById("myCanvas");
canvas.width=600;

const ctx = canvas.getContext("2d");
const ship=new Ship(300,300,30,50);


animate();

function animate() {
    ship.update();
    
    canvas.height=window.innerHeight;
    ship.draw(ctx);
    requestAnimationFrame(animate);
}