class Point
{
    private length : number;
    private x : number;
    private y : number;
    
    public constructor(x = 0, y = 0)
    {
        this.x = x;
        this.y = y;
    }
    
    
    public add(o: Point)
    {
        return new Point(this.x + o.getX(), this.y + o.getY());
    }
    
    
    public subtract(o: Point)
    {
        return new Point(this.x - o.getX(), this.y - o.getY());
    }
    
    
    public mult(k)
    {
        return new Point(this.x * k, this.y * k);
    }
    
    
    public divide(k)
    {
        return new Point(this.x / k, this.y / k);
    }
    
    // TODO replace these with getLength() etc.
          

    public getLength()
    {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }

    public getDirection()
    {
        return Math.atan2(this.y, this.x);
    }
          
    public getNoramalized()
    {
        return new Point(this.x / this.length, this.y / this.length);
    }
    
    // accessors
    public getX() { return this.x; }
    public getY() { return this.y; }
}
