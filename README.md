# bpm-timeline.js

A class that provides a similar way to schedule beat period changes like Web Audio API AudioParam but, in order to convert between Time (seconds) and Beat, we need to calculate the integrals and inverse of the integrals of the automation functions.



**Add a BPM marker**

```javascript
var initialBPM = 60;
var automation = new BPMTimeline(initialBPM);
automation.add_bpm_marker({
  	type: "linear", 
	endBeat: 50,  
	endBPM : 120    
});
```


**Remove a BPM marker**


**Edit a BPM marker**


**Beat/Time relation**


**What is the BPM at**