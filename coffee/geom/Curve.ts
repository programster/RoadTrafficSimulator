
class Curve
{
    private var A = A;
    private var B = B;
    private var O = O;
    private var Q = Q;
    
    private var AB = new Segment(this.A, this.B);
    private var AO = new Segment(this.A, this.O);
    private var OQ = new Segment(this.O, this.Q);
    private var QB = new Segment(this.Q, this.B);
    
    private var _length = null;
        
    public function constructor(A, B, O, Q)
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
    
    
    public function getPoint(a)
    {
        # OPTIMIZE avoid points and segments
        p0 = this.AO.getPoint(a)
        p1 = this.OQ.getPoint(a)
        p2 = this.QB.getPoint(a)
        r0 = (new Segment p0, p1).getPoint a
        r1 = (new Segment p1, p2).getPoint a
        (new Segment r0, r1).getPoint a
    }
    
    
    public function getDirection(a)
    {
        # OPTIMIZE avoid points and segments
        p0 = this.AO.getPoint(a)
        p1 = this.OQ.getPoint(a)
        p2 = this.QB.getPoint(a)
        r0 = (new Segment p0, p1).getPoint a
        r1 = (new Segment p1, p2).getPoint a
        (new Segment r0, r1).direction
    }
    
    
    this.property 'length',
        get: ->
          if not this._length?
            pointsNumber = 10
            prevoiusPoint = null
            this._length = 0
            for i in [0..pointsNumber]
              point = this.getPoint i / pointsNumber
              this._length += point.subtract(prevoiusPoint).length if prevoiusPoint
              prevoiusPoint = point
          return this._length
}
