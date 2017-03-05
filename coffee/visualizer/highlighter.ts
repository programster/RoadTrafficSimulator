
class ToolHighlighter extends Tool
{
    public function constructor()
    {
        super arguments...
        this.hoveredCell = null
    }
    
    
    public function mousemove(e)
    {
        cell = this.getCell e
        hoveredIntersection = this.getHoveredIntersection cell
        this.hoveredCell = cell
        
        for id, intersection of this.visualizer.world.intersections.all()
        {
            intersection.color = null
        }
        
        if hoveredIntersection?
        {
            hoveredIntersection.color = settings.colors.hoveredIntersection
        }
    }

    public function mouseout()
    {
        this.hoveredCell = null
    }
    

    public function draw()
    {
        if this.hoveredCell
        {
            color = settings.colors.hoveredGrid
            this.visualizer.graphics.fillRect this.hoveredCell, color, 0.5
        }
    }
}