# bpm-timeline.js

BPMTimeline is a time mapping library, providing a seamless mapping between score and performance time. To achieve this, we model tempo changes as tempo functions (a well documented subject in literature) and realize the mappings through integral and inverse of integral of tempo functions.

## Create a BPMTimeline object

```javascript
var initialBPM = 60;
var automation = new BPMTimeline(initialBPM);
```

## Add a BPM marker
```javascript
automation.add_tempo_marker({type: "linear", endBeat: 50,  endBPM : 120    });
automation.add_tempo_marker({type: "linear", endBeat: 100, endBPM : 140   });
automation.add_tempo_marker({type: "step", endBeat: 120, endBPM : 50    });
automation.add_tempo_marker({type: "linear", endBeat: 125, endBPM : 10    });
automation.add_tempo_marker({type: "exponential", endBeat: 130, endBPM : 1000   });
```

## Remove a BPM marker
```javascript
automation.remove_tempo_marker({ endBeat: 50 });
```
```javascript
automation.remove_tempo_marker({ endTime: 37.5 });
```

## Edit a BPM marker
```javascript
automation.change_tempo_marker({endBeat:130, endBPM: 100});
```

## Beat/Time relation
```javascript
automation.time(132);
```
```javascript
automation.beat(40);
```

## What is the BPM at
```javascript
automation.tempo_at_beat(132);
automation.tempo_at_time(60);
```

## Supported automation functions
* Linear: v(t) = V0 + (V1 - V0) * ((t - T0) / (T1 - T0))
* Exponential: v(t) = V0 * e^(log(y1/y0) * (x - x0) / (x1 - x0))
* Step: v(t) = (t < T1)? V0 : V1

## Use cases
* Scheduling events using beat values, relating them directly to time (seconds) values used by the scheduler.
* Showing the time value of the beats in a DAW composer grid.
* Automatic Synchronization of multiple audio players to a master tempo timeline.