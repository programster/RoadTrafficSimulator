
class Segment
{
    private source : Point;
    private target : Point;
    
    constructor(source: Point, target: Point)
    {
        this.source = source;
        this.target = target;
    }
    
    
    private split(numSegments : number, reverse? : boolean)
    {
        if (reverse)
        {
            var start = numSegments - 1;
            var end = 0;
        }
        else
        {
            var start = 0;
            var end = (numSegments - 1);
        }
        
        
        for (let k= start; k <= end; k++)
        {
            this.subsegment((k / numSegments), ((k + 1) / numSegments));
        }
    }
    
    
    public getPoint(a)
    {
        return this.source.add(this.getVector().mult(a))
    }
    
    
    private subsegment(a, b)
    {
        var offset = this.getVector();
        var start = this.source.add(offset.mult(a))
        var end = this.source.add(offset.mult(b))
        return new Segment(start, end);
    }
    
    
    public getVector()
    {
        return this.target.subtract(this.source);
    }
    
    
    public getLength()
    {
        return this.getVector().getLength();
    }

          
    public getDirection()
    {
        return this.getVector().getDirection();
    }
    
    
    public getCenter()
    {
        return this.getPoint(0.5);
    }
}
