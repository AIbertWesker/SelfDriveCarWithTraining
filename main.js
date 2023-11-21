const canvas=document.getElementById("myCanvas");
canvas.width=600;

const ctx = canvas.getContext("2d");
const road = new Road(canvas.width/2, canvas.width*0.9);
const ship=new Ship(road.getLaneCenter(2),100,30,50, "KEYS");
const traffic = [
    new Ship(road.getLaneCenter(2),-100,30,50, "DUMMY", 2)
];


//// Utw�rz nowy obiekt Image dla obrazu statku
//const shipImage = new Image();
//shipImage.src = 'nazwa_obrazu.jpg'; // Zmie� 'nazwa_obrazu.jpg' na �cie�k� do pliku obrazu

//const ship = new Ship(road.getLaneCenter(2), 100, 30, 50, shipImage); // Dodaj obraz statku do konstruktora Ship

//// Event handler dla za�adowania obrazu
//shipImage.onload = function () {
//    animate(); // Rozpocznij animacj� po za�adowaniu obrazu
//};

animate();

function animate() {
    for(let i=0;i<traffic.length;i++) {
        traffic[i].update(road.borders);
    }
    ship.update(road.borders);
    
    canvas.height=window.innerHeight;

    ctx.save();
    ctx.translate(0, -ship.y+canvas.height*0.75);
    road.draw(ctx);
    for(let i=0;i<traffic.length;i++) {
        traffic[i].draw(ctx);
    }
    ship.draw(ctx);

    ctx.restore();
    requestAnimationFrame(animate);
}