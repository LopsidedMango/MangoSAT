// create using MangoSAT.Circle(ctx, position, radius)


//circle

export class Circle{
    constructor(x, y, velocity_x, velocity_y, colour, radius){
        // variables
        try {
            this.x = x || 0;
            this.y = y || 0;
            this.cx = (this.x + (radius / 2))
            this.cy = (this.cy + (radius /2))
            this.velocity_x = velocity_x;
            this.velocity_y = velocity_y;
            this.colour = colour;
            this.radius = radius;
        } catch(error){
            console.log("Error in circle:", error.message);
        }
        

    }
    DrawCircle(ctx){
        // draw shape
        try {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
            ctx.strokeStyle = this.colour;
            ctx.stroke();
            ctx.fillStyle = this.colour;
            ctx.fill();
            ctx.closePath();
            return this
        }catch(error){
            console.log("Error in DrawCircle:", error.message)
        }
        
    }

    CalculateCircleBounds(){
        var top = this.y;
        var bottom = (this.y + (this.radius * 2));
        var left = this.x;
        var right = this.x + (this.radius * 2);
        return [left, ]
        
    }


}


// polygon

export class Polygon {
    constructor(vertices, colour, angle, key) {
        this.number = vertices.length || 0;
        this.vertices = vertices;
        this.colour = colour;
        this.angle = (angle * (Math.PI / 180));
        this.key = key;

        // calculate COM

        var sumx = 0;
        var sumy = 0;
        for (let i = 0; i < this.number; i++) {
            sumx = sumx + this.vertices[i].x;
            sumy = sumy + this.vertices[i].y;
        }
        this.cx = (sumx  / this.number);
        this.cy = (sumy / this.number);


    }
    // draw polygon
    DrawPolygon(ctx) {
        // for the sake of speed, COM is calculated here as well
        try {

            // save canvas
            ctx.save();
            // translate
            ctx.translate(this.cx, this.cy);
            ctx.rotate(this.angle);
            ctx.translate(-this.cx, -this.cy);
            // draw
            ctx.beginPath();
            ctx.moveTo(this.vertices[0].x, this.vertices[0].y);
            for (let i = 1; i < this.number; i++) {
                ctx.lineTo(this.vertices[i].x, this.vertices[i].y);
            }

            //finish draw
            ctx.closePath();
            ctx.restore();
            ctx.strokeStyle = this.colour;
            ctx.fillStyle = this.colour;
            ctx.fill();

        } catch (error) {
            console.log("Error in DrawPolygon:", error.message);
        }
    }
}

// assume collision is true
// loop



export class PolygonCollisionClass{

    constructor(interactables){
        this.interactables = interactables;
    }

    PolygonDetectCollision(){
        
        const valid_axis = new Map(); // store like {1:[5, 3, 3]} {key: [axis1, axis2]}
        // axis loop
        for (let ax_num = 0; ax_num < (this.interactables.length); ax_num++){
            const current_key = this.interactables[ax_num].key;
            var temp_axis = [];
            for (let edge_num = 0; edge_num < (this.interactables[ax_num].vertices.length); edge_num++){
                var axis = this.CalculateEdgeAxis(this.interactables[ax_num].vertices, edge_num);
                temp_axis.push(axis);
            }
            valid_axis.set(current_key, temp_axis);
        };
       

        // for each axis map the values and then check
        const axis_array = Array.from(valid_axis.values());
      
        const projected = new Map();

       
        for (let each_shape_axis = 0; each_shape_axis < (axis_array.length); each_shape_axis++){
            for (let each_axis = 0; each_axis < (axis_array[each_shape_axis].length); each_axis++){
                const key_min_max = new Map();
                for (let shape_check =0; shape_check < (this.interactables.length); shape_check++){
                    key_min_max.set(this.interactables[shape_check].key, this.ProjectPolygon(this.interactables[shape_check].vertices, axis_array[each_shape_axis][each_axis]))
                }
                projected.set(axis_array[each_shape_axis][each_axis], key_min_max);
            }
        }
        
        //alright
       
        
        // now check for collisions
        const final_collide = []
        for (const [key, value] of projected){
            const what_returned = this.ProjectedCollision(value);
            for (let q =0; q < what_returned.length; q++){
                var found = false;
                for (let checker = 0; checker < final_collide.length; checker++){
                    if ((final_collide[checker][0] == what_returned[q][0]) && (final_collide[checker][1] == what_returned[q][1])){
                        found = true;
                        
               
                    }
                }
                if (found == false){
                    final_collide.push(what_returned[q]);
                }
            }

        }
  

        
        console.log('Objects that are not colliding:', final_collide)

        //const uniqueArray = Array.from(new Set(final_collide.map(JSON.stringify)), JSON.parse);
        //console.log(uniqueArray);
    } 
    // porjected = [axis: [key: [min, max], key : [min, max]]]
    CalculateEdgeAxis(vertices, index){
        // here i am going to calulate the edge as a graph basicallsy
        const point1  = vertices[index];
        const point2 = vertices[((index + 1) % vertices.length)];
        const edge = {x: (point2.x - point1.x), y: (point2.y - point1.y)}
        const axis = {x: (edge.y), y:(-edge.x)};
        const magnitude = Math.sqrt(((axis.x) * axis.x) + (axis.y * axis.y));
        const normalised = {x: (axis.x / magnitude), y: (axis.y / magnitude)};
  
        return normalised
    }

    ProjectPolygon(vertices, axis){
        
        
        
        var max_projection = vertices[0].x * axis.x + vertices[0].y * axis.y;
        var min_projection = max_projection;
        
        for (let point = 1; point < vertices.length; point++){
            var point_projection = vertices[point].x * axis.x + vertices[point].y * axis.y;
            
            if (point_projection < min_projection){
       
                min_projection = point_projection;
            
            } else if (point_projection > max_projection) {
                
                max_projection = point_projection;
           
            }
        }
        
        return [max_projection, min_projection];
    }

    ProjectedCollision(value){
       
        const not_colliding = []
        const keysArray = Array.from(value.keys()); // Convert Map keys to an array
        const finalKey = keysArray[keysArray.length - 1];
        // collisions can only occur between 2 objects

        // check for a collision between objects on a given axis
        for (const [chosen_key, object_values] of value){
            // axis check
            if (chosen_key != finalKey){
        
                
                for (const [other_key, other_values] of value){
                    if (chosen_key != other_key){
                    
                        // here is mess up
                        
                        if ((other_values[0] >= object_values[1] && other_values[0] <= object_values[0]) || (other_values[1] >= object_values[1] && other_values[1] <= object_values[0])){
                            // code is working, data storage is messing up
                            
                        } else{
                            
                            var found = false 
                            for (let v = 0; v < not_colliding.length; v++){
                                if (not_colliding[v] == ([other_key, chosen_key].sort())){
                                    found = true
                                    break;
                                }
                            }
                            if (found == false){
                                not_colliding.push([other_key, chosen_key].sort());
                            }
                            
                        }
                    }
                }
            }

        }
  
        if (not_colliding.size != 0){
 
            return not_colliding;
        }
    }
}

