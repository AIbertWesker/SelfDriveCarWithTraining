const canvas=document.getElementById("myCanvas");
canvas.height=window.innerHeight;
canvas.width=200;

const ctx = canvas.getContext("2d");
const ship=new Ship(100,100,30,50);
ship.draw(ctx);
