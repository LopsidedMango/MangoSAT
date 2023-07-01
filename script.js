import { Circle, Polygon, PolygonCollisionClass} from './MangoSAT.js';

var key = 0;
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
canvas.height = 800;
canvas.width = 800;
var interactables = []
var CurrentBounds = []
//var circle1 = new Circle(100, 100, 0, 0, 'white', 20).DrawCircle(ctx);// create a new object e.g Circle(x, y, velocity_x, velocity_y, colour, radius).DrawCircle(ctx)

// Polygon([{x: 0, y: 50}, {x: 50, y:50}]), colour, angle (degrees), key)
var mypoly = new Polygon([{ x: 50, y: 50 },{ x: 100, y: 50 },{ x: 150, y: 80 },{ x: 120, y: 150 },], 'white', 0, (key += 1));
interactables.push(mypoly);

var mypoly2 = new Polygon([{ x: 350, y: 190 },{ x: 420, y: 80 },{ x: 160, y: 80 },{ x: 230, y: 150 },], 'blue', 0, (key += 1));
var mypoly3 = new Polygon([{ x: 400, y: 300 },{ x: 300, y: 400 },{ x: 230, y: 350},], 'green', 0, (key += 1));
// basically, generate the seperate axis for each object and then check them in another function?
interactables.push(mypoly2);
mypoly.DrawPolygon(ctx);
mypoly2.DrawPolygon(ctx);
mypoly3.DrawPolygon(ctx);
interactables.push(mypoly3);
new PolygonCollisionClass(interactables).PolygonDetectCollision()





function animate(currentTime) {

    const deltaTime = currentTime - lastFrameTime;
  
    // Only update and render if enough time has passed based on the frame rate
    if (deltaTime >= frameDelay) {

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // updates go here
    
        // Update the last frame time
        lastFrameTime = currentTime - (deltaTime % frameDelay);
  
    }
  
    requestAnimationFrame(animate);
}


animate(performance.now());



//CurrentBounds.push(circle1.CalculateCircleBounds());
