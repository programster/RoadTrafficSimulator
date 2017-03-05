class Tool
{
    public function constructor(this.visualizer, autobind) ->
    {
        this.ctx = this.visualizer.ctx
        this.canvas = this.ctx.canvas
        this.isBound = false
        this.bind() if autobind
    }

    public function bind()
    {
        this.isBound = true;
        
        for method in METHODS when this.[method]?
        {
            $(this.canvas).on method, this.[method]
        }
    }

    public function unbind()
    {
        this.isBound = false;
        
        for method in METHODS when this.[method]?
        {
            $(this.canvas).off method, this.[method]
        }
    }

    public function toggleState()
    {
        if this.isBound then this.unbind() else this.bind()
    }
    
    
    public function draw(){}
    
    
    public function getPoint: (e)
    {
        return new Point(e.pageX - this.canvas.offsetLeft, e.pageY - this.canvas.offsetTop);
    }
    
    
    public function getCell: (e)
    {
        this.visualizer.zoomer.toCellCoords(this.getPoint(e));
    }
    
    
    public function getHoveredIntersection(cell)
    {
        intersections = this.visualizer.world.intersections.all();
        
        for (id, intersection of intersections)
        {
            return intersection if intersection.rect.containsRect cell
        }
    }
}
