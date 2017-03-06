
class Graphics
{
    private m_ctx;
    
    public constructor(ctx) 
    {
        this.m_ctx = ctx;
    }

    public function fillRect (rect, style, alpha)
    {
        this.m_ctx.fillStyle = style if style?;
        _alpha = this.m_ctx.globalAlpha;
        this.m_ctx.globalAlpha = alpha if alpha?;
        this.m_ctx.fillRect(rect.left(), rect.top(), rect.width(), rect.height());
        this.m_ctx.globalAlpha = _alpha;
    }
    

    public function drawRect(rect)
    {
        this.m_ctx.beginPath
        vertices = rect.getVertices()
        this.m_ctx.beginPath()
        this.moveTo vertices[0]
        this.lineTo point for point in vertices[1..]
        this.m_ctx.closePath()
    }


    drawImage: (image, rect)
    {
        this.m_ctx.drawImage image, rect.left(), rect.top(), rect.width(), rect.height()
    }
    

    public function clear(color)
    {
        this.m_ctx.fillStyle = color
        this.m_ctx.fillRect 0, 0, this.m_ctx.canvas.width, this.m_ctx.canvas.height
    }
    

    public function moveTo(point)
    {
        this.m_ctx.moveTo point.x, point.y
    }
    

    public funciton lineTo(point)
    {
        this.m_ctx.lineTo point.x, point.y
    }
    

    public function drawLine(source, target)
    {
        this.m_ctx.beginPath()
        this.moveTo source
        this.lineTo target
    }
    

    drawSegment: (segment)
    {
        this.drawLine segment.source, segment.target
    }
    

    public function drawCurve(curve, width, color)
    {
        pointsNumber = 10
        this.m_ctx.lineWidth = width
        this.m_ctx.beginPath()
        this.moveTo curve.getPoint 0
        
        for i in [0..pointsNumber]
        {
            point = curve.getPoint i / pointsNumber
            this.lineTo point
        }
          
          
        if curve.O
        {
            this.moveTo curve.O
            this.m_ctx.arc curve.O.x, curve.O.y, width, 0, 2 * PI
        }
          
          
        if curve.Q
        {
            this.moveTo curve.Q
            this.m_ctx.arc curve.Q.x, curve.Q.y, width, 0, 2 * PI
        }
          
        this.stroke color if color
    }
    
    
    public funciton drawTriangle(p1, p2, p3)
    {
        this.m_ctx.beginPath()
        this.moveTo(p1)
        this.lineTo(p2)
        this.lineTo(p3)
    }
    
    
    fill: (style, alpha)
    {
        this.m_ctx.fillStyle = style
        _alpha = this.m_ctx.globalAlpha
        this.m_ctx.globalAlpha = alpha if alpha?
        this.m_ctx.fill()
        this.m_ctx.globalAlpha = _alpha
    }
    
    
    stroke: (style)
    {
        this.m_ctx.strokeStyle = style
        this.m_ctx.stroke()
    }
    
    
    public function polyline(points...)
    {
        if points.length >= 1
        {
            this.m_ctx.beginPath()
            this.moveTo points[0]
            for point in points[1..]
            this.lineTo point
            this.m_ctx.closePath()
        }
    }
    
    
    public function save()
    {
        this.m_ctx.save()
    }
    
    
    public function restore()
    {
        this.m_ctx.restore()
    }
}


