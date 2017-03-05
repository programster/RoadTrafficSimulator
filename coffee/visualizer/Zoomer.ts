
class Zoomer extends Tool
{
    protected _scale;
    protected screenCenter;
    protected center;
    
    
    constructor: (this.defaultZoom, this.visualizer, args...)
    {
        super this.visualizer, args...;
        this.ctx = this.visualizer.ctx;
        this.canvas = this.ctx.canvas;
        this._scale = 1;
        this.screenCenter = new Point this.canvas.width / 2, this.canvas.height / 2;
        this.center = new Point this.canvas.width / 2, this.canvas.height / 2;
    }
    
    
    this.property 'scale',
        get: -> this._scale;
        set: (scale) -> this.zoom scale, this.screenCenter;
    
    
    toCellCoords: (point)
    {
        gridSize = settings.gridSize;
        centerOffset = point.subtract(this.center).divide(this.scale);
        x = centerOffset.x // (this.defaultZoom * gridSize) * gridSize;
        y = centerOffset.y // (this.defaultZoom * gridSize) * gridSize;
        new Rect x, y, gridSize, gridSize;
    }
    
    
    public function getBoundingBox(cell1, cell2)
    {
        cell1 ?= this.toCellCoords new Point 0, 0;
        cell2 ?= this.toCellCoords new Point this.canvas.width, this.canvas.height;
        x1 = cell1.x;
        y1 = cell1.y;
        x2 = cell2.x;
        y2 = cell2.y;
        xMin = min cell1.left(), cell2.left();
        xMax = max cell1.right(), cell2.right();
        yMin = min cell1.top(), cell2.top();
        yMax = max cell1.bottom(), cell2.bottom();
        return new Rect(xMin, yMin, (xMax - xMin), (yMax - yMin));
    }
    
    
    public function transform()
    {
        this.ctx.translate this.center.x, this.center.y;
        k = this.scale * this.defaultZoom;
        this.ctx.scale(k, k);
    }
    
    
    public function zoom(k, zoomCenter)
    {
        k ?= 1;
        offset = this.center.subtract zoomCenter;
        this.center = zoomCenter.add offset.mult k / this._scale;
        this._scale = k;
    }
    
    
    public function moveCenter(offset)
    {
        this.center = this.center.add(offset);
    }
    
    
    public function mousewheel(e)
    {
        offset = e.deltaY * e.deltaFactor;
        zoomFactor = 2 ** (0.001 * offset);
        this.zoom this.scale * zoomFactor, this.getPoint(e);
        e.preventDefault();
    }
}
