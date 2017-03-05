class ToolRoadBuilder extends Tool
{
    public function constructor()
    {
        super arguments...
        this.sourceIntersection = null
        this.road = null
        this.dualRoad = null
    }
    
    
    public function mousedown(e)
    {
        cell = this.getCell(e);
        hoveredIntersection = this.getHoveredIntersection(cell);
        
        if e.shiftKey and hoveredIntersection?
        {
            this.sourceIntersection = hoveredIntersection
            e.stopImmediatePropagation()
        }
    }

    public function mouseup()(e)
    {
        this.visualizer.world.addRoad this.road if this.road?
        this.visualizer.world.addRoad this.dualRoad if this.dualRoad?
        this.road = this.dualRoad = this.sourceIntersection = null
    }
        
        
    public function mousemove(e)
    {
        cell = this.getCell(e);
        hoveredIntersection = this.getHoveredIntersection(cell);
        
        if 
        (
            this.sourceIntersection 
            && hoveredIntersection 
            && this.sourceIntersection.id != hoveredIntersection.id
        )
        {
            if (this.road?)
            {
                this.road.target = hoveredIntersection;
                this.dualRoad.source = hoveredIntersection;
            }
            else
            {
                this.road = new Road this.sourceIntersection, hoveredIntersection;
                this.dualRoad = new Road hoveredIntersection, this.sourceIntersection;
            }
        }
        else
        {
          this.road = this.dualRoad = null;
        }
    }
    
    
    public function mouseout()(e)
    {
        this.road = this.dualRoad = this.sourceIntersection = null;
    }

    public function draw()
    {
        this.visualizer.drawRoad(this.road, 0.4 if this.road?)
        this.visualizer.drawRoad(this.dualRoad, 0.4 if this.dualRoad?)
    }
}
