

class Rect
{
    private x;
    private y;
    private _width;
    private _height;
    
    public constructor(x, y, width = 0, height = 0)
    {
        this.x = x;
        this.y = y;
        this._width = width;
        this._height = height;
    }
    
    
    public copy(rect: Rect) : Rect
    {
        return new Rect(rect.x, rect.y, rect._width, rect._height);
    }
    
    
    public toJSON()
    {
        return {
            "x" : this.x,
            "y" : this.y,
            "_width" : this._width,
            "_height" : this._height
        };
    }
    
    
    public area() : number
    {
        return (this.width() * this.height());
    }
    
    
    public left(left?: number) : number
    {
        if (left)
        {
            this.x = left;
        }
        
        return this.x;
    }
    
    
    public right(right?: number) : number
    {
        if (right)
        {
            this.x = right - this.width();
        }
        
        return (this.x + this.width());
    }
    
    
    public width(width?: number) : number
    {
        if (width)
        {
            this._width = width;
        }
        
        return this._width
    }
    
    
    public top(top?: number) : number
    {
        if (top)
        {
            this.y = top;
        }
        
        return this.y;
    }
    
    
    public bottom(bottom?: number) : number
    {
        if (bottom)
        {
            this.y = bottom - this.height();
        }
        
        return (this.y + this.height());
    }
    
    
    public height(height?: number) : number
    {
        if (height)
        {
            this._height = height;
        }
        
        return this._height;
    }
    
    
    public center(center?: Point) : Point
    {
        if (center)
        {
            this.x = (center.getX() - this.width() / 2);
            this.y = (center.getY() - this.height() / 2);
        }
          
        return new Point(
            this.x + this.width() / 2, 
            this.y + this.height() / 2
        );
    }
    
    
    public containsPoint(point: Point): boolean
    {
        var result = false;
        
        if 
        (
            this.left() <= point.getX()
            && point.getX() <= this.right() 
            && this.top() <= point.getY() 
            && point.getY() <= this.bottom()
        )
        {
            result = true;
        }
        
        return result;
    }
    
    
    public containsRect(rect: Rect)
    {
        var result = false;
        
        if 
        (
            this.left() <= rect.left() 
            && rect.right() <= this.right()
            && this.top() <= rect.top() 
            && rect.bottom() <= this.bottom()
        )
        {
            result = true;
        }
        
        return result;
    }
    
    
    public getVertices()
    {
        return [
            new Point(this.left(), this.top()),
            new Point(this.right(), this.top()),
            new Point(this.right(), this.bottom()),
            new Point(this.left(), this.bottom()),
        ];
    }
    
    
    public getSide(i)
    {
        var vertices = this.getVertices();
        return new Segment(vertices[i], vertices[(i + 1) % 4]);
    }
    
    
    public getSectorId(point : Point) : number
    {
        var offset = point.subtract(this.center());
        
        if (offset.getY() <= 0 && Math.abs(offset.getX()) <= Math.abs(offset.getY())) { return 0; }
        if (offset.getX() >= 0 && Math.abs(offset.getX()) >= Math.abs(offset.getY())) { return 1; }
        if (offset.getY() >= 0 && Math.abs(offset.getX()) <= Math.abs(offset.getY())) { return 2; }
        if (offset.getX() <= 0 && Math.abs(offset.getX()) >= Math.abs(offset.getY())) { return 3; }
        
        var error = new Error('algorithm error');
        console.log(error);
    }
    
    
    public getSector(point : Point)
    {
        return this.getSide(this.getSectorId(point));
    }
}
