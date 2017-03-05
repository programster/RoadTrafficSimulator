
class Segment
{
    private var source = source;
    private var target = target;
    
    private function constructor(source, target)
    {
        this.source = source;
        this.target = target;
    }

    private function split(n, reverse)
    {
        if (reverse)
        {
            order = [n - 1 .. 0];
        }
        else
        {
            order = [0 .. n - 1];
        }
        
        for (k in order)
        {
            this.subsegment((k / n), ((k + 1) / n));
        }
    }
    
    
    private function getPoint(a)
    {
        return this.source.add(this.vector.mult(a))
    }
    
    
    private function subsegment(a, b)
    {
        offset = this.vector;
        start = this.source.add(offset.mult(a))
        end = this.source.add(offset.mult(b))
        retrun new Segment(start, end);
    }
    
    
    this.property 'vector',
        get: ->
          this.target.subtract this.source

      this.property 'length',
        get: ->
          this.vector.length

      this.property 'direction',
        get: ->
          this.vector.direction

      this.property 'center',
        get: ->
          this.getPoint 0.5

}
