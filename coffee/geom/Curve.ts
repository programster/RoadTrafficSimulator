
class Curve
{
    private A;
    private B;
    private O;
    private Q;
    
    private AB;
    private AO;
    private OQ;
    private QB;
    
    private _length;
        
    public constructor(A, B, O, Q)
    {
        this.A = A;
        this.B = B;
        this.O = O;
        this.Q = Q;
        
        this.AB = new Segment(this.A, this.B);
        this.AO = new Segment(this.A, this.O);
        this.OQ = new Segment(this.O, this.Q);
        this.QB = new Segment(this.Q, this.B);
        
        this._length = null;
    }
    
    
    public getPoint(a)
    {
        // OPTIMIZE avoid points and segments
        var p0 = this.AO.getPoint(a)
        var p1 = this.OQ.getPoint(a)
        var p2 = this.QB.getPoint(a)
        var r0 = (new Segment(p0, p1).getPoint(a));
        var r1 = (new Segment(p1, p2).getPoint(a));
        var segment = new Segment(r0, r1);
        return segment.getPoint(a);
    }
    
    
    public getDirection(a)
    {
        // OPTIMIZE avoid points and segments
        var p0 = this.AO.getPoint(a);
        var p1 = this.OQ.getPoint(a);
        var p2 = this.QB.getPoint(a);
        var r0 = (new Segment(p0, p1).getPoint(a));
        var r1 = (new Segment(p1, p2).getPoint(a));
        var segment = new Segment(r0, r1);
        return segment.getDirection();
    }
    
    
    public getLength()
    {
        if (!this._length)
        {
            var pointsNumber = 10;
            var prevoiusPoint = null;
            this._length = 0;
            
            for (let i = 0; i <= pointsNumber; i++)
            {
                var point = this.getPoint(i / pointsNumber);
                
                if (prevoiusPoint)
                {
                    this._length += point.subtract(prevoiusPoint).getLength();
                }
                
                prevoiusPoint = point;
            }
        }
        
        return this._length
    }  
}
