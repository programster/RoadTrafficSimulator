

class Car
{
    constructor: (lane, position)
    {
        this.id = _.uniqueId 'car'
        this.color = (300 + 240 * random() | 0) % 360
        this._speed = 0
        this.width = 1.7
        this.length = 3 + 2 * random()
        this.maxSpeed = 30
        this.s0 = 2
        this.timeHeadway = 1.5
        this.maxAcceleration = 1
        this.maxDeceleration = 3
        this.trajectory = new Trajectory this, lane, position
        this.alive = true
        this.preferedLane = null
    }
    
    
    public function release()
    {
        this.trajectory.release()
    }
    
    
    public function getAcceleration()
    {
        nextCarDistance = this.trajectory.nextCarDistance;
        distanceToNextCar = max(nextCarDistance.distance, 0);
        a = this.maxAcceleration;
        b = this.maxDeceleration;
        deltaSpeed = (this.speed - nextCarDistance.car?.speed) || 0
        freeRoadCoeff = (this.speed / this.maxSpeed) ** 4;
        distanceGap = this.s0;
        timeGap = this.speed * this.timeHeadway;
        breakGap = this.speed * deltaSpeed / (2 * sqrt a * b);
        safeDistance = distanceGap + timeGap + breakGap;
        busyRoadCoeff = (safeDistance / distanceToNextCar) ** 2;
        safeIntersectionDistance = 1 + timeGap + this.speed ** 2 / (2 * b);
        intersectionCoeff = (safeIntersectionDistance / this.trajectory.distanceToStopLine) ** 2;
        coeff = 1 - freeRoadCoeff - busyRoadCoeff - intersectionCoeff;
        return this.maxAcceleration * coeff;
    }
    
    
    public function move(delta)
    {
        acceleration = this.getAcceleration();
        this.speed += acceleration * delta;
        
        if (!this.trajectory.isChangingLanes && this.nextLane)
        {
            currentLane = this.trajectory.current.lane
            turnNumber = currentLane.getTurnDirection this.nextLane
        }
        
        switch (turnNumber)
        {
            case 0:
            {
                preferedLane = currentLane.leftmostAdjacent;
            }
            break;
            
            case 2:
            {
                preferedLane = currentLane.rightmostAdjacent;
            }
            break;
            
            default:
            {
                preferedLane = currentLane;
            }
        }
        
        if preferedLane isnt currentLane
        {
            this.trajectory.changeLane preferedLane
        }
        
        step = this.speed * delta + 0.5 * acceleration * delta ** 2
        # TODO: hacks, should have changed speed
        console.log 'bad IDM' if this.trajectory.nextCarDistance.distance < step
        
        if this.trajectory.timeToMakeTurn(step)
        {
          return this.alive = false if not this.nextLane?
        }
        
        this.trajectory.moveForward(step);
    }
    
    
    public function pickNextRoad()
    {
        intersection = this.trajectory.nextIntersection;
        currentLane = this.trajectory.current.lane;
        possibleRoads = intersection.roads.filter (x) ->
          x.target isnt currentLane.road.source
        
        if (possibleRoads.length == 0)
        {
            nextRoad = null;
        }
        else
        {
            nextRoad = _.sample possibleRoads
        }
        
        return nextRoad;
    }
    
    
    public function pickNextLane()
    {
        if (this.nextLane)
        {
            throw Error 'next lane is already chosen';
        }
        
        this.nextLane = null;
        nextRoad = this.pickNextRoad();
        
        if (!nextRoad)
        {
            return null;
        }
       
        turnNumber = this.trajectory.current.lane.road.getTurnDirection(nextRoad);
        
        switch (turnNumber)
        {
            case 0:
            {
                laneNumber = nextRoad.lanesNumber - 1;
            };
            
            case 1:
            {
                laneNumber = _.random 0, nextRoad.lanesNumber - 1;
            };
            
            case 2:
            {
                laneNumber = 0;
            };
            
        }
        
        this.nextLane = nextRoad.lanes[laneNumber];
        
        if (!this.nextLane)
        {
            throw Error 'can not pick next lane' if not this.nextLane;
        }
        
        return this.nextLane;
    }
    
    
    public function popNextLane()
    {
        nextLane = this.nextLane
        this.nextLane = null
        this.preferedLane = null
        return nextLane
    }
        
        
        this.property 'coords',
        get: -> this.trajectory.coords

      this.property 'speed',
        get: -> this._speed
        set: (speed) ->
          speed = 0 if speed < 0
          speed = this.maxSpeed if speed > this.maxSpeed
          this._speed = speed

      this.property 'direction',
        get: -> this.trajectory.direction
}
