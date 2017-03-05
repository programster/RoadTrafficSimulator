class LanePosition
{
    private var car;
    private var position;
    private var id;
    private var free;
    private var lane;
    
    public function constructor: (car, lane, position)
    {
        this.car = car;
        this.position = position;
        this.id = _.uniqueId 'laneposition';
        this.free = true;
        this.lane = lane;
    }
    
    public function acquire()
    {
        if (this.lane?.addCarPosition?)
        {
            this.free = false;
            this.lane.addCarPosition(this);
        }
    }
    
    
    public function release()
    {
        if not this.free and this.lane?.removeCar
        {
            this.free = true
            this.lane.removeCar this
        }
    }
    
    
    public function getNext()
    {
        return this.lane.getNext this if this.lane and not this.free
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
