
class Zoomer extends Tool
{
    protected defaultZoom : number;
    protected _scale : number;
    protected screenCenter : Point;
    protected center : Point;
    
    
    public constructor(defaultZoom: number, visualizer: Visualizer, bind?)
    {
        super(visualizer, bind);
        this.defaultZoom = defaultZoom;
        this._scale = 1;
        this.screenCenter = new Point(this.canvas.width / 2, this.canvas.height / 2);
        this.center = new Point(this.canvas.width / 2, this.canvas.height / 2);
    }
    
    
        
    public getScale()
    {
        return this._scale;
    }
    
    public setScale(scale : number)
    {
        return this.zoom(scale, this.screenCenter);
    }
    
    
    public toCellCoords(point : Point) : Rect
    {
        var centerOffset = point.subtract(this.center).divide(this._scale);
        var x = centerOffset.getX() // (this.defaultZoom * gridSize) * gridSize;
        var y = centerOffset.getY() // (this.defaultZoom * gridSize) * gridSize;
        return new Rect(x, y, Settings.gridSize, Settings.gridSize);
    }
    
    
    public getBoundingBox(cell1? : Rect, cell2? : Rect)
    {
        if (!cell1)
        {
            var cell1 = this.toCellCoords(new Point(0, 0));
        }
        
        if (!cell2)
        {
            var cell2 = this.toCellCoords(new Point(this.canvas.width, this.canvas.height));
        }
        
        var x1 = cell1.getX();
        var y1 = cell1.getY();
        var x2 = cell2.getX();
        var y2 = cell2.getY();
        
        var xMin = Math.min(cell1.left(), cell2.left());
        var xMax = Math.max(cell1.right(), cell2.right());
        var yMin = Math.min(cell1.top(), cell2.top());
        var yMax = Math.max(cell1.bottom(), cell2.bottom());
        
        return new Rect(xMin, yMin, (xMax - xMin), (yMax - yMin));
    }
    
    
    public transform()
    {
        this.ctx.translate(this.center.getX(), this.center.getY());
        var k = this._scale * this.defaultZoom;
        this.ctx.scale(k, k);
    }
    
    
    public zoom(k : number, zoomCenter: Point)
    {
        // If you find code that is not setting k, then update it to use 1
        var offset = this.center.subtract(zoomCenter);
        this.center = zoomCenter.add(offset.mult(k / this._scale));
        this._scale = k;
    }
    
    
    public moveCenter(offset)
    {
        this.center = this.center.add(offset);
    }
    
    
    public mousewheel(e)
    {
        var offset = e.deltaY * e.deltaFactor;
        var zoomFactor = 2 ** (0.001 * offset);
        this.zoom(this._scale * zoomFactor, this.getPoint(e));
        e.preventDefault();
    }
}
