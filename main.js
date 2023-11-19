const canvas=document.getElementById("myCanvas");
canvas.width=600;

const ctx = canvas.getContext("2d");
const road = new Road(canvas.width/2, canvas.width*0.9);
const ship=new Ship(road.getLaneCenter(2),100,30,50);



//// Utwórz nowy obiekt Image dla obrazu statku
//const shipImage = new Image();
//shipImage.src = 'nazwa_obrazu.jpg'; // Zmieñ 'nazwa_obrazu.jpg' na œcie¿kê do pliku obrazu

//const ship = new Ship(road.getLaneCenter(2), 100, 30, 50, shipImage); // Dodaj obraz statku do konstruktora Ship

//// Event handler dla za³adowania obrazu
//shipImage.onload = function () {
//    animate(); // Rozpocznij animacjê po za³adowaniu obrazu
//};

animate();

function animate() {
    ship.update(road.borders);
    
    canvas.height=window.innerHeight;

    ctx.save();
    ctx.translate(0, -ship.y+canvas.height*0.75);
    road.draw(ctx);
    ship.draw(ctx);

    ctx.restore();
    requestAnimationFrame(animate);
}