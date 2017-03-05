
class Mover extends Tool
{
    public function constructor:
    {
        super arguments...
        this.startPosition = null;
    }
    
    
    public function contextmenu()
    {
        return false;
    }
    
    
    public function mousedown(e)
    {
        this.startPosition = this.getPoint(e);
        e.stopImmediatePropagation();
    }
    
    
    public function mouseup()
    {
        this.startPosition = null;
    }
    
    
    public function mousemove(e)
    {
        if (this.startPosition)
        {
            offset = this.getPoint(e).subtract(this.startPosition);
            this.visualizer.zoomer.moveCenter(offset);
            this.startPosition = this.getPoint(e);
        }
    }
    
    
    public function mouseout()
    {
        this.startPosition = null;
    }
}


