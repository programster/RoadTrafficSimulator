
class World
{
    private set = {};
    
    public constructor()
    {
        this.set = {};
    }
    
    
    public set(obj)
    {
        obj ?= {};
        this.intersections = new Pool(Intersection, obj.intersections);
        this.roads = new Pool(Road, obj.roads);
        this.cars = new Pool(Car, obj.cars);
        this.carsNumber = 0;
        this.time = 0;
    }
    
    
    public save()
    {
        data = _.extend {}, this
        delete data.cars
        localStorage.world = JSON.stringify(data);
    }
    
    
    public load(data)
    {
        data = data or localStorage.world;
        data = data and JSON.parse(data);
        
        if (!data)
        {
            return new Error("World cannot load any data.");
        }
        
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

    
    /**
     * 
     */
    public generateMap(minX = -2, maxX = 2, minY = -2, maxY = 2)
    {
        this.clear();
        var intersectionsNumber = (0.8 * (maxX - minX + 1) * (maxY - minY + 1));
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
        
        for (let x = minX; x <= maxX; x++)
        {
            var previousIntersection = null;
              
            for (let y = minY; y <= maxY; y++)
            {
                var intersection = map[[x, y]];
                
                if (intersection)
                {
                    if (Math.random() < 0.9)
                    {
                        if (previousIntersection)
                        {
                            var road1 = new Road(intersection, previousIntersection);
                            var road2 = new Road(previousIntersection, intersection);
                        }
                        else
                        {
                            var road1 = new Road(intersection, null);
                            var road2 = new Road(previousIntersection, null);
                        }
                        
                        this.addRoad(road1);
                        this.addRoad(road2);
                    }
                    
                    previousIntersection = intersection;
                }
            }
        }
        
        for (let y=minY; y <= maxY; y++)
        {
            var previous = null;
            
            for (let x =minX; x <= maxX; x++)
            {
                intersection = map[[x, y]];
                
                if (intersection)
                {
                    if (Math.random() < 0.9)
                    {
                        if (previous)
                        {
                            var road1 = new Road(intersection, previous)
                            var road2 = new Road(previous, intersection)
                        }
                        else
                        {
                            var road1 = new Road(intersection, null)
                            var road2 = new Road(previous, null)
                        }
                        
                        this.addRoad(road1);
                        this.addRoad(road2);
                    }
                    
                    previous = intersection;
                }
            }
        }
    }
    
    
    public clear() { this.set = {}; }
    
    
    public onTick(delta)
    {
        if (delta > 1)
        {
            return new Error('delta > 1');
        }
        
        this.time += delta;
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
    
    
    public refreshCars()
    {
        if (this.cars.length < this.carsNumber)
        {
            this.addRandomCar() 
        }
        
        if (this.cars.length > this.carsNumber)
        {
            this.removeRandomCar() 
        }
    }
    
    
    public addRoad(road)
    {
        this.roads.put(road);
        road.source.roads.push(road);
        road.target.inRoads.push(road);
        road.update();
    }
    
    
    public getRoad(id : number){ this.roads.get(id); }
    public addCar(car){ this.cars.put(car); }
    public getCar(id) { this.cars.get(id); }
    public removeCar(car) { this.cars.pop(car); }
    public addIntersection(intersection) { this.intersections.put(intersection); }
    public getIntersection: (id) { this.intersections.get(id); }
    
    
    public addRandomCar()
    {
        road = _.sample this.roads.all();
        
        if (road)
        {
            lane = _.sample road.lanes
            this.addCar new Car lane if lane?
        }
    }
    
    
    public removeRandomCar()
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
