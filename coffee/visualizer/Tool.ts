class Tool
{
    protected ctx;
    protected canvas;
    protected isBound;
    protected visualizer : Visualizer;
    
    
    public constructor(visualizer: Visualizer, autobind? : boolean)
    {
        this.visualizer = visualizer;
        this.ctx = this.visualizer.ctx;
        this.canvas = this.ctx.canvas;
        this.isBound = false;
        
        if (autobind)
        {
            this.bind();
        }
    }
    
    
    public bind()
    {
        this.isBound = true;
        
        for (method in METHODS when this.[method]?
        {
            $(this.canvas).on(method, this.[method]);
        }
    }
    
    
    public unbind()
    {
        this.isBound = false;
        
        for method in METHODS when this.[method]?
        {
            $(this.canvas).off method, this.[method]
        }
    }
    
    
    public toggleState()
    {
        if this.isBound then this.unbind() else this.bind()
    }
    
    
    public draw(){}
    
    
    public getPoint: (e)
    {
        return new Point(e.pageX - this.canvas.offsetLeft, e.pageY - this.canvas.offsetTop);
    }
    
    
    public getCell(e)
    {
        this.visualizer.zoomer.toCellCoords(this.getPoint(e));
    }
    
    
    public getHoveredIntersection(cell)
    {
        intersections = this.visualizer.world.intersections.all();
        
        for (id, intersection of intersections)
        {
            return intersection if intersection.rect.containsRect cell
        }
    }
}
