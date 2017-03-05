
class World
{
    public function constructor()
    {
        this.set = {};
    }
    
    
    public function set(obj)
    {
        obj ?= {}
        this.intersections = new Pool Intersection, obj.intersections
        this.roads = new Pool Road, obj.roads
        this.cars = new Pool Car, obj.cars
        this.carsNumber = 0
        this.time = 0
    }
    
    
    public function save()
    {
        data = _.extend {}, this
        delete data.cars
        localStorage.world = JSON.stringify data
    }
    
    
    public function load: (data)
    {
        data = data or localStorage.world
        data = data and JSON.parse data
        return unless data?
        this.clear()
        this.carsNumber = data.carsNumber or 0
        
        for (id, intersection of data.intersections)
        {
            this.addIntersection(Intersection.copy(intersection));
        }
        
        for (id, road of data.roads)
        {
            road = Road.copy(road);
            road.source = this.getIntersection(road.source);
            road.target = this.getIntersection(road.target);
            this.addRoad(road);
        }
    }


    public function generateMap(minX = -2, maxX = 2, minY = -2, maxY = 2)
    {
        this.clear();
        intersectionsNumber = (0.8 * (maxX - minX + 1) * (maxY - minY + 1)) | 0
        map = {};
        gridSize = settings.gridSize
        step = 5 * gridSize
        this.carsNumber = 100;
        
        while (intersectionsNumber > 0)
        {
            x = _.random(minX, maxX);
            y = _.random(minY, maxY);
            
            unless map[[x, y]]?
            {
                rect = new Rect(step * x, step * y, gridSize, gridSize);
                intersection = new Intersection(rect);
                map[[x, y]] = intersection;
                this.addIntersection(intersection);
                intersectionsNumber -= 1;
            }
        }
        
        for x in [minX..maxX]
        {
            previous = null;
              
            for y in [minY..maxY]
            {
                intersection = map[[x, y]];
                
                if intersection?
                {
                    if random() < 0.9
                    {
                        this.addRoad new Road intersection, previous if previous?
                        this.addRoad new Road previous, intersection if previous?
                    }
                          
                    previous = intersection;
                }
            }
        }
        
        for y in [minY..maxY]
        {
            previous = null;
            
            for (x in [minX..maxX])
            {
                intersection = map[[x, y]];
                
                if (intersection)
                {
                    if random() < 0.9
                    {
                        this.addRoad new Road intersection, previous if previous?
                        this.addRoad new Road previous, intersection if previous?
                    }
                    
                    previous = intersection
                }
            }
        }
        
        return null;
    }
    
    
    public function clear() { this.set = {}; }
    
    
    public function onTick(delta)
    {
        throw Error 'delta > 1' if delta > 1
        this.time += delta
        this.refreshCars();
        
        for id, intersection of this.intersections.all()
        {
            intersection.controlSignals.onTick delta
        }
          
        for id, car of this.cars.all()
        {
            car.move delta
            this.removeCar car unless car.alive
        }
    }
    
    
    public function refreshCars()
    {
        this.addRandomCar() if this.cars.length < this.carsNumber
        this.removeRandomCar() if this.cars.length > this.carsNumber
    }
    
    
    public function addRoad(road)
    {
        this.roads.put road
        road.source.roads.push road
        road.target.inRoads.push road
        road.update()
    }
    
    
    public function getRoad(id){ this.roads.get(id); }
    public function addCar(car){ this.cars.put(car); }
    public function getCar(id) { this.cars.get(id); }
    public function removeCar(car) { this.cars.pop(car); }
    public function addIntersection(intersection) { this.intersections.put(intersection); }
    public function getIntersection: (id) { this.intersections.get(id); }
    
    
    public function addRandomCar()
    {
        road = _.sample this.roads.all();
        
        if (road)
        {
            lane = _.sample road.lanes
            this.addCar new Car lane if lane?
        }
    }
    
    
    public function removeRandomCar()
    {
        car = _.sample this.cars.all();
        
        if (car)
        {
            this.removeCar(car);
        }
    }

          
          
        this.property 'instantSpeed',
        get: ->
          speeds = _.map this.cars.all(), (car) -> car.speed
          return 0 if speeds.length is 0
          return (_.reduce speeds, (a, b) -> a + b) / speeds.length
}
