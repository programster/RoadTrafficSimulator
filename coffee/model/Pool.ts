
class Pool
{
    constructor: (this.factory, pool)
    {
        this.objects = {};
        
        if (pool? and pool.objects?)
        {
            for (k, v of pool.objects)
            {
                this.objects[k] = this.factory.copy(v);
            }
        }
    }
        

    public function toJSON()
    {
        return this.objects;
    }
    
    
    public function get(id)
    {
        this.objects[id]
    }
    
    
    public function put(obj)
    {
        this.objects[obj.id] = obj;
    }
    
    
    public function pop(obj)
    {
        id = obj.id ? obj;
        result = this.objects[id];
        result.release?();
        delete this.objects[id];
        return result;
    }

    public function all()
    {
        return this.objects
    }

    public function clear()
    {
        this.objects = {}
    }

    this.property 'length',
        get: -> Object.keys(this.objects).length

}
