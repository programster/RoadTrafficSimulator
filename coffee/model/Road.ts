
class Road
{
    private id : number;
    private lanes = [];
    private lanesNumber = null;
    private target;
    private source;
    private static roadCounter : number = 0;
    private targetSideId;
    
    private getUniqueId()
    {
        Road.roadCounter++;
        return Road.roadCounter;
    }
    
    public constructor(source, target)
    {
        this.id = this.getUniqueId();
        this.lanes = [];
        this.lanesNumber = null;
        this.target = target;
        this.source = source;
        this.update();
    }
    
    
    public copy(road)
    {
        
        var result = new Road();
        _.extend result, road;
        result.lanes ?= [];
        return result;
    }
    
    
    public toJSON()
    {
        return {
            "id": this.id,
            "source": this.source.id,
            "target": this.target.id
        }
    }
    
    
    public getTurnDirection(other)
    {
        if (this.target != other.source)
        {
            return new Error('invalid roads');
        }
        
        var side1 = this.targetSideId;
        var side2 = other.sourceSideId;
        // 0 - left, 1 - forward, 2 - right
        var turnNumber = (side2 - side1 - 1 + 8) % 4;
        return turnNumber;
    }
    
    
    public update()
    {
        if (!this.source && !this.target)
        {
            return new Error('incomplete road');
        }
        
        this.sourceSideId = this.source.rect.getSectorId(this.target.rect.center());
        this.sourceSide = this.source.rect.getSide(this.sourceSideId).subsegment(0.5, 1.0);
        this.targetSideId = this.target.rect.getSectorId(this.source.rect.center());
        this.targetSide = this.target.rect.getSide(this.targetSideId).subsegment(0, 0.5);
        this.lanesNumber = Math.min(this.sourceSide.length, this.targetSide.length);
        this.lanesNumber = Math.max(2, this.lanesNumber / settings.gridSize);
        sourceSplits = this.sourceSide.split(this.lanesNumber, true);
        targetSplits = this.targetSide.split(this.lanesNumber);
        
        if (not this.lanes? or this.lanes.length < this.lanesNumber)
        {
            this.lanes ?= [];
          
            for (i in [0..this.lanesNumber - 1])
            {
                this.lanes[i] ?= new Lane(sourceSplits[i], targetSplits[i], this);
            }
        }
            
        for (let i=0; i<this.lanesNumber; i++)
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

