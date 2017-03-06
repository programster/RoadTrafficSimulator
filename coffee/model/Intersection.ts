
class Intersection
{
    private rect : Rect;
    private id;
    private roads;
    private inRoads;
    private controlSignals;
    
    
    public constructor(rect : Rect)
    {
        this.rect = rect;
        this.id = _.uniqueId('intersection');
        this.roads = [];
        this.inRoads = [];
        this.controlSignals = new ControlSignals(this);
    }
    
    
    public copy(intersection) 
    {
        intersection.rect = Rect.copy(intersection.rect);
        result = new Intersection();
        _.extend result, intersection;
        result.roads = [];
        result.inRoads = [];
        result.controlSignals = ControlSignals.copy result.controlSignals, result;
        return result;
    }
    
    
    public toJSON()
    {
        return {
            id: this.id,
            rect: this.rect,
            controlSignals: this.controlSignals
        }
    }
    
    
    public update()
    {
        for (var road of this.roads)
        {
            road.update();
        }
        
        
        for (var road of this.inRoads)
        {
            road.update();
        }
    }
}
