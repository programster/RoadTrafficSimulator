
class ToolIntersectionMover extends Tool
{
    public function constructor()
    {
        super arguments...
        this.intersection = null;
    }
    
    
    public function mousedown(e)
    {
        intersection = this.getHoveredIntersection(this.getCell(e));
        
        if (intersection)
        {
            this.intersection = intersection;
            e.stopImmediatePropagation();
        }
    }
    
    
    public function mouseup()
    {
        this.intersection = null;
    }
    
    
    public function mousemove(e)
    {
        if (this.intersection)
        {
            cell = this.getCell(e);
            this.intersection.rect.left(cell.x);
            this.intersection.rect.top(cell.y);
            this.intersection.update();
        }
    }
    
    
    public function mouseout()
    {
        this.intersection = null;
    }
}

