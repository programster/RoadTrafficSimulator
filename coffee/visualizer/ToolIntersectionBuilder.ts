
class ToolIntersectionBuilder extends Tool
{
    public function constructor()
    {
        super arguments...;
        this.tempIntersection = null;
        this.mouseDownPos = null;
    }


    public function mousedown(e)
    {
        this.mouseDownPos = this.getCell(e);
        
        if (e.shiftKey)
        {
            this.tempIntersection = new Intersection this.mouseDownPos;
            e.stopImmediatePropagation();
        }
    }


    public function mouseup()
    {
        if (this.tempIntersection)
        {
            this.visualizer.world.addIntersection this.tempIntersection;
            this.tempIntersection = null;
        }
        
        this.mouseDownPos = null;
    }
    
    public function mousemove(e)
    {
        if this.tempIntersection
        {
            rect = this.visualizer.zoomer.getBoundingBox(this.mouseDownPos, this.getCell(e));
            this.tempIntersection.rect = rect;
        }
    }
    
    
    public function mouseout()
    {
        this.mouseDownPos = null;
        this.tempIntersection = null;
    }
    
    
    public function draw()
    {
        if this.tempIntersection
        {
            this.visualizer.drawIntersection(this.tempIntersection, 0.4);
        }
    }
}


