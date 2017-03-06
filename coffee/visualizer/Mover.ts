
class Mover extends Tool
{
    private startPosition;
    
    public constructor(visualizer: Visualizer, bind? : boolean)
    {
        super(visualizer, bind);
        this.startPosition = null;
    }
    
    
    public contextmenu()
    {
        return false;
    }
    
    
    public mousedown(e)
    {
        this.startPosition = this.getPoint(e);
        e.stopImmediatePropagation();
    }
    
    
    public mouseup()
    {
        this.startPosition = null;
    }
    
    
    public mousemove(e)
    {
        if (this.startPosition)
        {
            offset = this.getPoint(e).subtract(this.startPosition);
            this.visualizer.zoomer.moveCenter(offset);
            this.startPosition = this.getPoint(e);
        }
    }
    
    
    public mouseout()
    {
        this.startPosition = null;
    }
}


