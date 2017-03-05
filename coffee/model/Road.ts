
class Road
{
    private id = _.uniqueId 'road';
    private lanes = [];
    private lanesNumber = null;
        
    public function constructor: (this.source, this.target) ->
    {
        this.id = _.uniqueId 'road';
        this.lanes = [];
        this.lanesNumber = null;
        this.update();
    }
    
    
    public function this.copy: (road) ->
    {
        result = Object.create Road::
        _.extend result, road
        result.lanes ?= []
        result
    }
    
    
    public function toJSON: ->
    {
        obj =
          id: this.id
          source: this.source.id
          target: this.target.id
    }
    
    
    public function getTurnDirection: (other) ->
    {
        throw Error 'invalid roads' if this.target isnt other.source
        side1 = this.targetSideId
        side2 = other.sourceSideId
        # 0 - left, 1 - forward, 2 - right
        turnNumber = (side2 - side1 - 1 + 8) % 4
    }
    
    
    public function update: ->
    {
        throw Error 'incomplete road' unless this.source and this.target
        this.sourceSideId = this.source.rect.getSectorId this.target.rect.center()
        this.sourceSide = this.source.rect.getSide(this.sourceSideId).subsegment 0.5, 1.0
        this.targetSideId = this.target.rect.getSectorId this.source.rect.center()
        this.targetSide = this.target.rect.getSide(this.targetSideId).subsegment 0, 0.5
        this.lanesNumber = min(this.sourceSide.length, this.targetSide.length) | 0
        this.lanesNumber = max 2, this.lanesNumber / settings.gridSize | 0
        sourceSplits = this.sourceSide.split this.lanesNumber, true
        targetSplits = this.targetSide.split this.lanesNumber
        
        if (not this.lanes? or this.lanes.length < this.lanesNumber)
        {
            this.lanes ?= [];
          
            for (i in [0..this.lanesNumber - 1])
            {
                this.lanes[i] ?= new Lane(sourceSplits[i], targetSplits[i], this);
            }
        }
            
        for i in [0..this.lanesNumber - 1]
        {
            this.lanes[i].sourceSegment = sourceSplits[i];
            this.lanes[i].targetSegment = targetSplits[i];
            this.lanes[i].leftAdjacent = this.lanes[i + 1];
            this.lanes[i].rightAdjacent = this.lanes[i - 1];
            this.lanes[i].leftmostAdjacent = this.lanes[this.lanesNumber - 1];
            this.lanes[i].rightmostAdjacent = this.lanes[0];
            this.lanes[i].update();
        }
    }
          
          
    this.property 'length',
        get: -> this.targetSide.target.subtract(this.sourceSide.source).length

      this.property 'leftmostLane',
        get: -> this.lanes[this.lanesNumber - 1]

      this.property 'rightmostLane',
        get: -> this.lanes[0]
}

