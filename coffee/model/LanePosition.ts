class LanePosition
{
    private car;
    private position;
    private id;
    private free;
    private lane;
    
    public constructor(car, lane, position)
    {
        this.car = car;
        this.position = position;
        this.id = _.uniqueId 'laneposition';
        this.free = true;
        this.lane = lane;
    }
    
    public acquire()
    {
        if (this.lane?.addCarPosition?)
        {
            this.free = false;
            this.lane.addCarPosition(this);
        }
    }
    
    
    public release()
    {
        if (!this.free && this.lane?.removeCar)
        {
            this.free = true;
            this.lane.removeCar(this);
        }
    }
    
    
    public getNext()
    {
        if (this.lane && !this.free)
        {
            return this.lane.getNext(this)
        }
    }
    
    
    this.property 'lane',
            get: -> this._lane
            set: (lane) ->
              this.release()
              this._lane = lane
              # this.acquire()
    
    this.property 'relativePosition',
        get: -> this.position / this.lane.length
            
    
    this.property 'nextCarDistance',
            get: ->
              next = this.getNext()
              if next
                rearPosition = next.position - next.car.length / 2
                frontPosition = this.position + this.car.length / 2
                return result =
                  car: next.car
                  distance: rearPosition - frontPosition
              return result =
                car: null
                distance: Infinity
}
