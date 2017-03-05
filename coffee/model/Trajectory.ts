
class Trajectory
{
    private var car;
    private var current;
    private var current;
    private var next;
    private var temp;
    private var isChangingLanes;
        
    public function constructor(car, lane, position)
    {
        this.car = car;
        position ?= 0;
        this.current = new LanePosition(this.car, lane, position);
        this.current.acquire();
        this.next = new LanePosition(this.car);
        this.temp = new LanePosition(this.car);
        this.isChangingLanes = false;
    }
    
    
    public function isValidTurn()
    {
        #TODO right turn is only allowed from the right lane
        nextLane = this.car.nextLane;
        sourceLane = this.current.lane;
        throw Error 'no road to enter' unless nextLane;
        turnNumber = sourceLane.getTurnDirection nextLane;
        throw Error 'no U-turns are allowed' if turnNumber is 3;
        
        if turnNumber is 0 and not sourceLane.isLeftmost
        {
            throw Error 'no left turns from this lane'
        }
          
        if turnNumber is 2 and not sourceLane.isRightmost
        {
            throw Error 'no right turns from this lane'
        }
        
        return true;
    }
    
    
    public function canEnterIntersection()
    {
        nextLane = this.car.nextLane
        sourceLane = this.current.lane
        return true unless nextLane
        intersection = this.nextIntersection
        turnNumber = sourceLane.getTurnDirection nextLane
        sideId = sourceLane.road.targetSideId
        intersection.controlSignals.state[sideId][turnNumber]
    }

    public function getDistanceToIntersection()
    {
        distance = this.current.lane.length - this.car.length / 2 - this.current.position
        if not this.isChangingLanes then max distance, 0 else Infinity
    }
    
    
    public function timeToMakeTurn(): (plannedStep = 0) ->
    {
        this.getDistanceToIntersection() <= plannedStep
    }
    
    
    public function moveForward(): (distance) ->
    {
        distance = max distance, 0
        this.current.position += distance
        this.next.position += distance
        this.temp.position += distance
        if this.timeToMakeTurn() and this.canEnterIntersection() and this.isValidTurn()
          this._startChangingLanes this.car.popNextLane(), 0
        tempRelativePosition = this.temp.position / this.temp.lane?.length
        gap = 2 * this.car.length
        if this.isChangingLanes and this.temp.position > gap and not this.current.free
          this.current.release()
        if this.isChangingLanes and this.next.free and
        this.temp.position + gap > this.temp.lane?.length
          this.next.acquire()
        if this.isChangingLanes and tempRelativePosition >= 1
          this._finishChangingLanes()
        if this.current.lane and not this.isChangingLanes and not this.car.nextLane
          this.car.pickNextLane()

    public function changeLane(): (nextLane) ->
    {
        throw Error 'already changing lane' if this.isChangingLanes
        throw Error 'no next lane' unless nextLane?
        throw Error 'next lane == current lane' if nextLane is this.lane
        throw Error 'not neighbouring lanes' unless this.lane.road is nextLane.road
        nextPosition = this.current.position + 3 * this.car.length
        throw Error 'too late to change lane' unless nextPosition < this.lane.length
        this._startChangingLanes nextLane, nextPosition

    public function _getIntersectionLaneChangeCurve()
    {

    public function _getAdjacentLaneChangeCurve()
    {
        p1 = this.current.lane.getPoint this.current.relativePosition;
        p2 = this.next.lane.getPoint this.next.relativePosition;
        distance = p2.subtract(p1).length;
        direction1 = this.current.lane.middleLine.vector.normalized.mult distance * 0.3;
        control1 = p1.add direction1;
        direction2 = this.next.lane.middleLine.vector.normalized.mult distance * 0.3;
        control2 = p2.subtract direction2;
        curve = new Curve p1, p2, control1, control2;

    public function _getCurve()
    {
        # FIXME: race condition due to using relativePosition on intersections
        this._getAdjacentLaneChangeCurve();
    }

    public function _startChangingLanes(): (nextLane, nextPosition) ->
    {
        throw Error 'already changing lane' if this.isChangingLanes;
        throw Error 'no next lane' unless nextLane?;
        this.isChangingLanes = true;
        this.next.lane = nextLane;
        this.next.position = nextPosition;

        curve = this._getCurve();

        this.temp.lane = curve;
        this.temp.position = 0 # this.current.lane.length - this.current.position;
        this.next.position -= this.temp.lane.length;
    }

    public function _finishChangingLanes()
    {
        throw Error 'no lane changing is going on' unless this.isChangingLanes;
        this.isChangingLanes = false;
        # TODO swap current and next;
        this.current.lane = this.next.lane;
        this.current.position = this.next.position or 0;
        this.current.acquire();
        this.next.lane = null;
        this.next.position = NaN;
        this.temp.lane = null;
        this.temp.position = NaN;
        this.current.lane;
    }

    public function release()
    {
        this.current?.release();
        this.next?.release();
        this.temp?.release();
    }
        
      this.property 'lane',
        get: -> this.temp.lane or this.current.lane

      this.property 'absolutePosition',
        get: -> if this.temp.lane? then this.temp.position else this.current.position

      this.property 'relativePosition',
        get: -> this.absolutePosition / this.lane.length

      this.property 'direction',
        get: -> this.lane.getDirection this.relativePosition

      this.property 'coords',
        get: -> this.lane.getPoint this.relativePosition

      this.property 'nextCarDistance',
        get: ->
          a = this.current.nextCarDistance
          b = this.next.nextCarDistance
          if a.distance < b.distance then a else b

      this.property 'distanceToStopLine',
        get: ->
          return this.getDistanceToIntersection() if not this.canEnterIntersection()
          return Infinity

      this.property 'nextIntersection',
        get: -> this.current.lane.road.target

      this.property 'previousIntersection',
        get: -> this.current.lane.road.source
}
