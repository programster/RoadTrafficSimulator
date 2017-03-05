

class Rect
{
    private var x;
    private var y;
    private var _width;
    private var _height;
    
    public function constructor(x, y, width = 0, height = 0)
    {
        this.x = x;
        this.y = y;
        this._width = width;
        this._height = height;
    }
    
    
    public function copy(rect)
    {
        new Rect rect.x, rect.y, rect._width, rect._height
    }
    
    
    public function toJSON()
    {
        _.extend {}, this
    }
    
    
    public function area()
    {
        this.width() * this.height()
    }
    
    
    public function left: (left)
    {
        this.x = left if left?
        this.x
    }
    
    
    public function right: (right) 
    {
        this.x = right - this.width() if right?
        this.x + this.width()
    }
    
    
    public function width: (width)
    {
        this._width = width if width?
        this._width
    }
    
    
    public function top: (top)
    {
        this.y = top if top?
        this.y
    }
    
    
    public function bottom: (bottom)
    {
        this.y = bottom - this.height() if bottom?
        this.y + this.height()
    }
    
    
    public function height: (height)
    {
        this._height = height if height?
        this._height
    }
    
    
    public function center: (center)
    {
        if center?
          this.x = center.x - this.width() / 2
          this.y = center.y - this.height() / 2
        new Point this.x + this.width() / 2, this.y + this.height() / 2
    }
    
    
    public function containsPoint(point)
    {
        this.left() <= point.x <= this.right() and this.top() <= point.y <= this.bottom()
    }
    
    
    public function containsRect(rect)
    {
        this.left() <= rect.left() and rect.right() <= this.right() and
        this.top() <= rect.top() and rect.bottom() <= this.bottom()
    }
    
    
    public function getVertices()
    {
        return [
          new Point(this.left(), this.top()),
          new Point(this.right(), this.top()),
          new Point(this.right(), this.bottom()),
          new Point(this.left(), this.bottom()),
        ];
    }
    
    
    public function getSide(i)
    {
        vertices = this.getVertices()
        new Segment vertices[i], vertices[(i + 1) % 4]
    }
    
    
    public function getSectorId(point)
    {
        offset = point.subtract this.center()
        return 0 if offset.y <= 0 and abs(offset.x) <= abs(offset.y)
        return 1 if offset.x >= 0 and abs(offset.x) >= abs(offset.y)
        return 2 if offset.y >= 0 and abs(offset.x) <= abs(offset.y)
        return 3 if offset.x <= 0 and abs(offset.x) >= abs(offset.y)
        throw Error 'algorithm error'
    }
    
    
    public function getSector: (point)
    {
        this.getSide this.getSectorId point
    }
}
