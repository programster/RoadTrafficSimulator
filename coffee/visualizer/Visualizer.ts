class Visualizer
{
    private world;
    private canvas;
    private ctx;

    private carImage;

    private zoomer;
    private graphics;
    private toolRoadbuilder;
    private toolIntersectionBuilder;
    private toolHighlighter;
    private toolIntersectionMover;
    private toolMover;
    private running;
    private previousTime;
    private timeFactor;
    private debug;
    private _running: boolean;
        
    public constructor(world)
    {
        this.world = world;
        this.canvas = $('#canvas');
        this.canvas = this.canvas[0];
        this.ctx = this.canvas.getContext('2d');
        
        this.carImage = new Image();
        this.carImage.src = 'images/car.png';
        
        this.updateCanvasSize();
        this.zoomer = new Zoomer(4, this, true);
        this.graphics = new Graphics(this.ctx);
        this.toolRoadbuilder = new ToolRoadBuilder(this, true);
        this.toolIntersectionBuilder = new ToolIntersectionBuilder(this, true);
        this.toolHighlighter = new ToolHighlighter(this, true);
        this.toolIntersectionMover = new ToolIntersectionMover(this, true);
        this.toolMover = new Mover(this, true);
        this._running = false;
        this.previousTime = 0;
        this.timeFactor = Settings.defaultTimeFactor;
        this.debug = false;
    }
    
    
    public drawIntersection(intersection, alpha)
    {
        color = intersection.color or settings.colors.intersection;
        this.graphics.drawRect intersection.rect;
        this.ctx.lineWidth = 0.4;
        this.graphics.stroke settings.colors.roadMarking;
        this.graphics.fillRect intersection.rect, color, alpha;
    }
    
    
    public drawSignals(road)
    {
        lightsColors = [settings.colors.redLight, settings.colors.greenLight];
        intersection = road.target;
        segment = road.targetSide;
        sideId = road.targetSideId;
        lights = intersection.controlSignals.state[sideId];
        
        this.ctx.save();
        this.ctx.translate segment.center.x, segment.center.y;
        this.ctx.rotate (sideId + 1) * PI / 2;
        this.ctx.scale 1 * segment.length, 1 * segment.length;
        // map lane ending to [(0, -0.5), (0, 0.5)];
        
        if (lights[0])
        {
            this.graphics.drawTriangle(
                new Point(0.1, -0.2),
                new Point(0.2, -0.4),
                new Point(0.3, -0.2)
            );
            
            this.graphics.fill(Settings.colors.greenLight);
        }
          
        if lights[1]
        {
            this.graphics.drawTriangle(
                new Point(0.3, -0.1),
                new Point(0.5, 0),
                new Point(0.3, 0.1)
            );
            
            this.graphics.fill(Settings.colors.greenLight);
        }
        
          
        if (lights[2])
        {
            this.graphics.drawTriangle(
                new Point(0.1, 0.2),
                new Point(0.2, 0.4),
                new Point(0.3, 0.2)
            );
            
            this.graphics.fill(Settings.colors.greenLight);
        }
        
        this.ctx.restore();
        
        if (this.debug)
        {
            this.ctx.save();
            this.ctx.fillStyle = "black";
            this.ctx.font = "1px Arial";
            center = intersection.rect.center();
            flipInterval = Math.round(intersection.controlSignals.flipInterval * 100) / 100;
            phaseOffset = Math.round(intersection.controlSignals.phaseOffset * 100) / 100;
            this.ctx.fillText flipInterval + ' ' + phaseOffset, center.x, center.y;
            this.ctx.restore();
        }
    }
    
    
    public drawRoad(road, alpha)
    {
        throw Error 'invalid road' if not road.source? or not road.target?
        sourceSide = road.sourceSide
        targetSide = road.targetSide
        
        this.ctx.save()
        this.ctx.lineWidth = 0.4
        leftLine = road.leftmostLane.leftBorder
        this.graphics.drawSegment leftLine
        this.graphics.stroke settings.colors.roadMarking
        
        rightLine = road.rightmostLane.rightBorder
        this.graphics.drawSegment rightLine
        this.graphics.stroke settings.colors.roadMarking
        this.ctx.restore()
        
        this.graphics.polyline sourceSide.source, sourceSide.target,
        targetSide.source, targetSide.target
        this.graphics.fill settings.colors.road, alpha
        
        this.ctx.save()
        
        for lane in road.lanes[1..]
        {
            line = lane.rightBorder
            dashSize = 1
            this.graphics.drawSegment line
            this.ctx.lineWidth = 0.2
            this.ctx.lineDashOffset = 1.5 * dashSize
            this.ctx.setLineDash [dashSize]
            this.graphics.stroke settings.colors.roadMarking
        }
        
        this.ctx.restore()
    }
    
    
    public drawCar(car)
    {
        angle = car.direction
        center = car.coords
        rect = new Rect 0, 0, 1.1 * car.length, 1.7 * car.width
        rect.center new Point 0, 0
        boundRect = new Rect 0, 0, car.length, car.width
        boundRect.center new Point 0, 0
        
        this.graphics.save()
        this.ctx.translate center.x, center.y
        this.ctx.rotate angle
        l = 0.90 - 0.30 * car.speed / car.maxSpeed
        style = chroma(car.color, 0.8, l, 'hsl').hex()
        # this.graphics.drawImage this.carImage, rect
        this.graphics.fillRect boundRect, style
        this.graphics.restore()
        
        if (this.debug)
        {
            this.ctx.save();
            this.ctx.fillStyle = "black";
            this.ctx.font = "1px Arial";
            this.ctx.fillText car.id, center.x, center.y;

            if (curve = car.trajectory.temp?.lane)?
            {
                this.graphics.drawCurve(curve, 0.1, 'red');
            }
                
            this.ctx.restore();
        }
    }
    
    
    public drawGrid()
    {
        gridSize = settings.gridSize
        box = this.zoomer.getBoundingBox()
        return if box.area() >= 2000 * gridSize * gridSize
        sz = 0.4

        for i in [box.left()..box.right()] by gridSize
          for j in [box.top()..box.bottom()] by gridSize
            rect = new Rect i - sz / 2, j - sz / 2, sz, sz
            this.graphics.fillRect rect, settings.colors.gridPoint
    }

    
    public updateCanvasSize()
    {
        if 
        (
            this.$canvas.attr('width') != $(window).width 
            || this.$canvas.attr('height') != $(window).height)
        {
            this.canvas.setAttribute("width", $(window).width());
            this.canvas.setAttribute("height", $(window).height());
        }
    }
    

    public draw(time)
    {
        delta = (time - this.previousTime) || 0
        
        if (delta > 30)
        {
            delta = 100 if delta > 100
            this.previousTime = time
            this.world.onTick this.timeFactor * delta / 1000
            this.updateCanvasSize()
            this.graphics.clear settings.colors.background
            this.graphics.save()
            this.zoomer.transform()
            this.drawGrid()

            for id, intersection of this.world.intersections.all()
            {
                this.drawIntersection intersection, 0.9
            }

            this.drawRoad road, 0.9 for id, road of this.world.roads.all()
            this.drawSignals road for id, road of this.world.roads.all()
            this.drawCar car for id, car of this.world.cars.all()
            this.toolIntersectionBuilder.draw() # TODO: all tools
            this.toolRoadbuilder.draw()
            this.toolHighlighter.draw()
            this.graphics.restore()
        }
       
        if (this.running)
        {
            window.requestAnimationFrame(this.draw);
        }
        
    }

    
    public getRunning()
    {
        return this._running;
    }
    
    
    public setRunning(input : boolean)
    {
        if (input)
        {
             this.start();
        }
        else 
        {
            this.stop();
        }
    }
    

    public start()
    {
        if (!this._running)
        {
            this._running = true
            this.draw()
        }
    }

    public stop()
    {
        this._running = false
    }

}
