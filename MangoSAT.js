// create using MangoSAT.Circle(ctx, position, radius)


//circle

export class Circle{
    constructor(x, y, velocity_x, velocity_y, colour, radius, mass, gravity){
        // variables
        try {
            this.gravity = gravity;
            this.mass = mass;
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
    constructor(vertices, colour, angle, key, velocityx, velocityy, mass, gravity) {
        this.gravity = gravity;
        this.number = vertices.length || 0;
        this.vertices = vertices;
        this.colour = colour;
        this.angle = (angle * (Math.PI / 180));
        this.key = key;
        this.velocityx = velocityx;
        this.velocityy = velocityy;
        this.mass = mass;
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

    constructor(interactables, deltaTime){
        this.interactables = interactables;
        this.deltaTime = deltaTime;
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
        // return {key : points}, {key: points} and then reference projected
        // so proctected shows all the axis and their projected points from each interactable
        this.projected  = projected;

        // now check for collisions
        const all_points = [];
        const final_collide = [];
   
        for (var [prokey, value] of projected){
            // prokey is referencing axis, vale is the various point maps
       
            var what_returned = this.ProjectedCollision(value);

            // the points are where the collision occurs for the given axis
            const the_points = what_returned[1];
            what_returned = what_returned[0];
            if (the_points !== undefined){
                for(let w = 0; w< the_points.length; w++){
                    var axismap = new Map()
                    axismap.set(prokey, the_points[w])
                    all_points.push(axismap);
                }
            }
            // checks for duplicates and see what objects are not colliding
            if (what_returned !== undefined){
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

        }

        const colliding_objects = [];
        // find objects that are colliding
        for (let v = 0; v < (this.interactables.length - 1); v++){
            const check_pair = this.interactables[v].key;
            for (let f = (v+1); f < (this.interactables.length); f++){
                if (this.interactables[f].key != check_pair){
                    const the_pair = [this.interactables[v].key, this.interactables[f].key].sort();
                    var finder = false;
                    for (let r = 0; r < final_collide.length; r++){
                        if ((final_collide[r][0] == the_pair[0]) && (final_collide[r][1] == the_pair[1])){
                            finder = true;
                        }
                    }
                    if (finder == false){
                        colliding_objects.push(the_pair);
                    }
                }  
            }

        }
        if (colliding_objects.length > 0){
            console.log(colliding_objects);
        }

 
        this.CalculateSmallestOverlap(colliding_objects, all_points);

        

        //const uniqueArray = Array.from(new Set(final_collide.map(JSON.stringify)), JSON.parse);
        //console.log(uniqueArray);
    } 
    // store like {key : [{mtv: axis}]}
    CalculateSmallestOverlap(colliding_objects, all_points) {

      
        const thesmallest = new Map();
        for (let mini_point = 0; mini_point < colliding_objects.length; mini_point++) {
      
            var smallest_overlap = Infinity;
            var mtv = null;
            const the_keys = colliding_objects[mini_point];
            for (let each_thing =0; each_thing < all_points.length; each_thing++){

                var map_values = all_points[each_thing].values().next().value;
                if(map_values.has(the_keys[0]) && map_values.has(the_keys[1])){
                    
                    // calculate overlap
                    var current_overlap = 0;
                    const object1 = map_values.get(the_keys[0]);
                    const object2 = map_values.get(the_keys[1]);
                    const max1 = object1[0];
                    const min1 = object1[1];
                    const max2 = object2[0];
                    const min2 = object2[1];
                    const overlap_start = Math.max(min1, min2);
                    const overlap_end = Math.min(max1, max2);
                    current_overlap = overlap_end - overlap_start;
                    if(current_overlap < smallest_overlap){
                        smallest_overlap = current_overlap;
                        var points1 = object1;
                        var points2 = object2;
                        var small_axis = all_points[each_thing].keys().next().value;
                        const direction = (current_overlap > 0) ? 1 : -1;
                        const magnitude = Math.abs(current_overlap);
                    
                        mtv = { x: small_axis.x * magnitude * direction, y: small_axis.y * magnitude * direction };
                    }
                }   
            }
         
 
            for(let mass_finder = 0; mass_finder < this.interactables.length; mass_finder++){
                if (this.interactables[mass_finder].key == the_keys[0]){
                    var mass1 = this.interactables[mass_finder].mass;
                } else if(this.interactables[mass_finder].key == the_keys[1]) {
                    var mass2 = this.interactables[mass_finder].mass;
                }
               
            }
 
            const impulse_magnitude  = (Math.sqrt(mtv.x **2 + mtv.y ** 2)) / (mass1 + mass2);

            mtv =  {x: (mtv.x * impulse_magnitude), y: (mtv.y * impulse_magnitude)};
            console.log(smallest_overlap, 'small lap');
            
            if (typeof(thesmallest.get(the_keys[0])) === 'undefined'){
                if (smallest_overlap > 0){
                    var mtvA = {x: -(mtv.x), y: -(mtv.y)}
                    thesmallest.set(the_keys[0], [mtvA]);
                } else {
                    thesmallest.set(the_keys[0], [mtv]);
                }
                
            } else {
                if (smallest_overlap > 0){
                    var mtvA = {x: -(mtv.x), y: -(mtv.y)}
                    thesmallest.get(the_keys[0]).push(mtvA);
                } else {
                    thesmallest.get(the_keys[0]).push(mtv);
                }
                
            }

            if (typeof(thesmallest.get(the_keys[1])) === 'undefined'){
                if (smallest_overlap <= 0){
                    var mtvB = {x: -(mtv.x), y: -(mtv.y)}
                    thesmallest.set(the_keys[1], [mtvB]);
                } else {
                    thesmallest.set(the_keys[1], [mtv]);
                }
                

            } else {
                
                if (smallest_overlap <= 0){
                    var mtvB = {x: -(mtv.x), y: -(mtv.y)}
                    thesmallest.get(the_keys[1]).push(mtvB);
                } else {
                    thesmallest.get(the_keys[1]).push(mtv);
                }
            }
            console.log(thesmallest, 'inpulse and key normalised');
            // var tempmap1 = new Map();
            // tempmap1.set(the_keys[0], )
            // tempmap.set(the_keys[0], points1);
            // tempmap.set(the_keys[1], points2);
            // tempmap.set('axis', small_axis);
            // tempmap.set('mtv', mtv);
            // tempmap.set('overlap', smallest_overlap);
            // thesmallest.push(tempmap)
            
        }
        this.thesmallest = thesmallest;
      
        this.UpdatePolygonPositions();
      
     
    }
    UpdatePolygonPositions(){

        for (let interindex = 0; interindex < this.interactables.length; interindex++){
            // check for MTV
         
            var overall_mtv = {x:0, y:0}
            if(typeof(this.thesmallest.get(this.interactables[interindex].key)) === 'undefined'){
                // there is not MTV so object is not colliding
                
            }else {
                // object is colliding
                // calculate overall mvt
                for(let each_mtv of (this.thesmallest.get(this.interactables[interindex].key))){
                    overall_mtv.x += each_mtv.x;
                    overall_mtv.y += each_mtv.y;
                }
            }
            // find velocity
            
            this.interactables[interindex].velocityx += -(overall_mtv.x / this.interactables[interindex].mass);
            this.interactables[interindex].velocityy += -(overall_mtv.y / this.interactables[interindex].mass);
            
            // grav acceleration
            this.interactables[interindex].velocityy += (this.interactables[interindex].gravity * this.deltaTime);
            
            
            // update position
            var object_displacement = {x:0, y:0};
            object_displacement.x +=  this.interactables[interindex].velocityx * this.deltaTime
            object_displacement.y += this.interactables[interindex].velocityy * this.deltaTime
           
            for(let vertex_update = 0; vertex_update < this.interactables[interindex].vertices.length; vertex_update++){
                
                this.interactables[interindex].vertices[vertex_update].x += object_displacement.x;
                this.interactables[interindex].vertices[vertex_update].y += object_displacement.y;
      
            }
        }
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

        // value is like interactable key : projected values btw
        // so this function runs for each axis, passing in the points as value
        // create somethig to store colliding pair points e.g Map{[key : [point1, point2], key2: [point3, point4]]}
        const collision_points = [];
        const not_colliding = []
        const keysArray = Array.from(value.keys()); // Convert Map keys to an array
        const finalKey = keysArray[keysArray.length - 1];
        // collisions can only occur between 2 objects

        // check for a collision between objects on a given axis
        for (const [chosen_key, object_values] of value){
            // axis check to make sure because you don't need to compare with the final
            if (chosen_key != finalKey){
        
                
                for (const [other_key, other_values] of value){
                    if (chosen_key != other_key){
                        // check that not comparing value to itself    
                        if ((other_values[0] >= object_values[1] && other_values[0] <= object_values[0]) || (other_values[1] >= object_values[1] && other_values[1] <= object_values[0])){
                            // objects are colliding
                            const collide_map = new Map();
                            collide_map.set(chosen_key, object_values);
                            collide_map.set(other_key, other_values);
                            collision_points.push(collide_map);
                            
                        } else{
                            // objects are not colliding
                            var found = false 
                            for (let v = 0; v < not_colliding.length; v++){
                                if (not_colliding[v] == ([other_key, chosen_key].sort())){
                                    found = true
                                    break;
                                }
                            }
                            // checks if not colliding is already inside list
                            if (found == false){
                                not_colliding.push([other_key, chosen_key].sort());
                            }
                            
                        }
                    }
                }
            }

        }


        return [not_colliding, collision_points];
        
    }


}

// issues
// something is wrong with the SAT calculation??
// check axis calculation --- try this
// or maybe all points are not being taken into account
// maybe the overlap is not working correctly -- resolved not the case since collision is not detected

// sign is incorrect when calculating mtv and impulse


// x---------------------> +
// y goes up when down