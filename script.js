import { Circle, Polygon, PolygonCollisionClass} from './MangoSAT.js';

var key = 0;
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
canvas.height = 800;
canvas.width = 800;
var interactables = []



// 100 pixels = 1m
const gravity = 9.81// pixels per second ^ 2

//var circle1 = new Circle(100, 100, 0, 0, 'white', 20).DrawCircle(ctx);// create a new object e.g Circle(x, y, velocity_x, velocity_y, colour, radius).DrawCircle(ctx)

// Polygon([{x: 0, y: 50}, {x: 50, y:50}]), colour, angle (degrees), key, velox, veloy, mass)

var mypoly2 = new Polygon([{ x: 350, y: 190 },{ x: 420, y: 80 },{ x: 130, y: 80 },{ x: 120, y: 150 },], 'blue', 0, (key += 1), 0, 0, 3, gravity);
var mypoly3 = new Polygon([{ x: 20, y: 190 },{ x: 30, y: 80 },{ x: 40, y: 80 },{ x: 50, y: 150 },], 'green', 0, (key += 1), 0, 0, 3, gravity);
var mypoly4 = new Polygon([{ x: 500, y: 300 },{ x: 500, y: 400 },{ x: 350, y: 350}, { x: 220, y: 230 }], 'pink', 0, (key += 1), 0, 0, 1, 0);
// basically, generate the seperate axis for each object and then check them in another function?
interactables.push(mypoly2);
interactables.push(mypoly3);
mypoly2.DrawPolygon(ctx);
mypoly3.DrawPolygon(ctx);
mypoly4.DrawPolygon(ctx);

interactables.push(mypoly4);




const targetFrameRate = 60; // Desired frame rate (e.g., 60 frames per second)
const frameDelay = 1000 / targetFrameRate; // Delay between frames in milliseconds
let lastFrameTime = 0;




function animate(currentTime) {
  const deltaTime = currentTime - lastFrameTime;

  // Only update and render if enough time has passed based on the frame rate
  if (deltaTime >= frameDelay) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    new PolygonCollisionClass(interactables, (deltaTime / 1000)).PolygonDetectCollision()
    for (var iter of interactables){
        iter.DrawPolygon(ctx);
    }
    
    

    // Update the last frame time
    lastFrameTime = currentTime - (deltaTime % frameDelay);

  }

  requestAnimationFrame(animate);
}








// animate

animate(performance.now());


// function animate(currentTime) {

//     const deltaTime = currentTime - lastFrameTime;
  
//     // Only update and render if enough time has passed based on the frame rate
//     if (deltaTime >= frameDelay) {

//         ctx.clearRect(0, 0, canvas.width, canvas.height);

//         // updates go here
    
//         // Update the last frame time
//         lastFrameTime = currentTime - (deltaTime % frameDelay);
  
//     }
  
//     requestAnimationFrame(animate);
// }


// animate(performance.now());



//CurrentBounds.push(circle1.CalculateCircleBounds());
