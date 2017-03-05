
class Intersection
{
    private var rect;
    private var id;
    private var roads;
    private var inRoads;
    private var controlSignals;
    
    
    public function constructor(rect)
    {
        this.rect = rect;
        this.id = _.uniqueId('intersection');
        this.roads = [];
        this.inRoads = [];
        this.controlSignals = new ControlSignals(this);
    }
    
    
    public function copy: (intersection) 
    {
        intersection.rect = Rect.copy(intersection.rect);
        result = new Intersection();
        _.extend result, intersection;
        result.roads = [];
        result.inRoads = [];
        result.controlSignals = ControlSignals.copy result.controlSignals, result;
        return result;
    }
    
    
    public function toJSON()
    {
        return {
            id: this.id
            rect: this.rect
            controlSignals: this.controlSignals
        }
    }
    
    
    public function update()
    {
        road.update() for road in @roads
        road.update() for road in @inRoads
    }
}
