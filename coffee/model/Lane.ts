
class Lane
{
    private sourceSegment;
    private targetSegment;
    private road;
    private leftAdjacent;
    private rightAdjacent;
    private leftmostAdjacent;
    private rightmostAdjacent;
    private carsPositions = {};
    
    public constructor(sourceSegment, targetSegment, road)
    {
        this.sourceSegment = sourceSegment;
        this.targetSegment = targetSegment;
        this.road = road;
        this.leftAdjacent = null;
        this.rightAdjacent = null;
        this.leftmostAdjacent = null;
        this.rightmostAdjacent = null;
        this.carsPositions = {};
        this.update();
    }

    public toJSON()
    {
        obj = _.extend {}, this
        delete obj.carsPositions
        return obj;
    }
        



    public update()
    {
        this.middleLine = new Segment this.sourceSegment.center, this.targetSegment.center
        this.length = this.middleLine.length
        this.direction = this.middleLine.direction
    }
    
    
    public getTurnDirection(other)
    {
        return this.road.getTurnDirection(other.road)
    }
    
    
    public getDirection() { return this.direction; }
    public getPoint(a) { return this.middleLine.getPoint(a); }
    
    
    public addCarPosition(carPosition)
    {
        throw Error 'car is already here' if carPosition.id of this.carsPositions
        this.carsPositions[carPosition.id] = carPosition
    }
    
    
    public removeCar(carPosition)
    {
        throw Error 'removing unknown car' unless carPosition.id of this.carsPositions
        delete this.carsPositions[carPosition.id]
    }
    
    
    public getNext(carPosition)
    {
        throw Error 'car is on other lane' if carPosition.lane isnt this;
        next = null;
        bestDistance = Infinity;
        
        for id, o of this.carsPositions
        {
            distance = o.position - carPosition.position;

            if (not o.free and 0 < distance < bestDistance)
            {
                bestDistance = distance
                next = o
            }
        }
        
        return next;
    }
    
      this.property 'sourceSideId',
        get: -> this.road.sourceSideId

      this.property 'targetSideId',
        get: -> this.road.targetSideId

      this.property 'isRightmost',
        get: -> this is this..rightmostAdjacent

      this.property 'isLeftmost',
        get: -> this is this..leftmostAdjacent

      this.property 'leftBorder',
        get: ->
          new Segment this.sourceSegment.source, this.targetSegment.target

      this.property 'rightBorder',
        get: ->
          new Segment this.sourceSegment.target, this.targetSegment.source
}
