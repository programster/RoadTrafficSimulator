class ControlSignals
{
    private var intersection;
    private var flipMultiplier;
    private var phaseOffset;
    private var time;
    private var stateNum;
    
    private var states: [
        ['L', '', 'L', ''],
        ['FR', '', 'FR', ''],
        ['', 'L', '', 'L'],
        ['', 'FR', '', 'FR']
      ]
    
    constructor(this.intersection)
    {
        this.flipMultiplier = random();
        this.phaseOffset = 100 * random();
        this.time = this.phaseOffset;
        this.stateNum = 0;
    }
        

    public function copy(controlSignals, intersection)
    {
        if (!controlSignals)
        {
            return new ControlSignals intersection;
        }
        
        result = new ControlSignals();
        result.flipMultiplier = controlSignals.flipMultiplier;
        result.time = result.phaseOffset = controlSignals.phaseOffset;
        result.stateNum = 0;
        result.intersection = intersection;
        return result;
    }
        

    toJSON: ->
        obj =
          flipMultiplier: this.flipMultiplier;
          phaseOffset: this.phaseOffset;

    this.STATE = [RED: 0, GREEN: 1];

    this.property 'flipInterval',
        get: -> (0.1 + 0.05 * this.flipMultiplier) * settings.lightsFlipInterval

    _decode: (str) ->
        state = [0, 0, 0]
        state[0] = 1 if 'L' in str
        state[1] = 1 if 'F' in str
        state[2] = 1 if 'R' in str
        state

    this.property 'state',
        get: ->
          stringState = this.states[this.stateNum % this.states.length]
          if this.intersection.roads.length <= 2
            stringState = ['LFR', 'LFR', 'LFR', 'LFR']
          (this._decode x for x in stringState)

    flip: ->
        this.stateNum += 1

    onTick: (delta) =>
        this.time += delta
        if this.time > this.flipInterval
          this.flip()
          this.time -= this.flipInterval
}
