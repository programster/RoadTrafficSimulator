class Point
{
    private var length;
    private var x;
    private var y;
    
    public function constructor(x = 0, y = 0)
    {
        this.x = x;
        this.y = y;
    }

    public function add(o)
    {
        new Point @x + o.x, @y + o.y
    }

    public function subtract(o)
    {
        new Point @x - o.x, @y - o.y
    }

    public function mult(k)
    {
        new Point @x * k, @y * k
    }

    public function divide(k)
    {
        new Point @x / k, @y / k
    }
    
    // TODO replace these with getLength() etc.
    @property 'length',
        get: ->
          sqrt @x * @x + @y * @y

      @property 'direction',
        get: ->
          atan2 @y, @x

      @property 'normalized',
        get: ->
          new Point @x / @length, @y / @length

}
