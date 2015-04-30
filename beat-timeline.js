function BPMTimeline(initialBPM) {

	var initialBPM = initialBPM;

	// [ {id, beat, time, bpm, type, totalTime} ]
	var bpmMarkers  = [];


	function exponential (x0, x1, y0, y1, x) {
		return y0 * Math.pow((y1 / y0), ((Math.min(x, x1) - x0) / (x1 - x0)));
	}

	function exponential_integral (x0, x1, y0, y1, constant, x) {
		// Integral of the following function:
		// v(t) = V0 * (V1 / V0) ^ ((t - T0) / (T1 - T0))
		
		dx = x1 - x0;
	    ry = y1 / y0;
	    U  = ry ^ (1/dx);
	    return y0 * ( Math.pow(U, x-x0) / Math.log(U) );
	}

	function exponential_integral_inverse (x0, x1, y0, y1, constant, y) {
		var dx = x1 - x0;
		var ry = y1 / y0;
		var U = Math.pow(ry, 1/dx);
		var V = y0 * Math.pow(ry, -x0/dx);

		var aux = (y * Math.log(U) / V) - constant;

		return Math.log(aux) / Math.log(U);

		dx = x1 - x0;
	    ry = y1 / y0;
	    U  = ry ^ (1/dx);
	    V  = y0 * (ry ^ (-x0/dx));

	    aux = (y .* log(U) / V) - constant;

	    res = log(aux) / log(U);
	}


	function linear (x0, x1, y0, y1, x) {
		return y0 + (y1 - y0) * ((Math.min(x, x1) - x0) / (x1 - x0));
	}

	function linear_integral (x0, x1, y0, y1, constant, x) {
		// Integral of the following function: 
		// v(t) = V0 + (V1 - V0) * ((t - T0) / (T1 - T0))
		
		dy  = y1 - y0;
		dx  = x1 - x0;
		M   = dy / (2*dx);
		C   = y0;

		return M * Math.pow((x - x0), 2) + y0 * (x - x0) + constant;
	}

	function linear_integral_inverse (x0, x1, y0, y1, constant, y) {
		
		dx  = x1 - x0;
		dy  = y1 - y0;
	    A   = 0.5 * dy / dx;
	    B   = y0 - 2 * A * x0;
	    C   = A * (x0*x0) - y0 * x0 + constant;
	    
	    square_root = sqrt(B*B - 4*A*(C-y));
	    sol1 = (-B + square_root) / (2*A);
	    sol2 = (-B - square_root) / (2*A);
	    
	    if (sol1>0)
	    	return sol1;
	    else 
	    	return sol2;
	}

	// converter from beat to time
	var time = function (beat) {
		var marker;
		for (var i=0; i<bpmMarkers.length; i++) {
			if (bpmMarkers[i].beat > beat) {
				marker = bpmMarkers[i];
				break;
			}
		}

		if (!marker) // constant BPM
			return initialBeatPeriod * beat;
		else 
			return marker.totalTime(beat);
	}

	// converter from time to beat
	var beat = function (time) {
		// TODO
		var previous;
		var next;
		for (var i=0; i<bpmMarkers.length; i++) {
			if (bpmMarkers[i].time > time) {
				next = bpmMarkers[i];
			} else {
				previous = bpmMarkers[i];
			}
		}

		if (!previous && !next) // constant BPM
			return time / bpm_to_beat_period(initialBPM);
		else if (previous && next)
			return next.totalTime(time);
		else if (previous && !next)
			previous.beat 
	}

	function update(_initialBPM, start, end) {
		// TODO
		bpmMarkers.sort(function(m1, m2) { return m1.beat-m2.beat; });
	}

	function bpm_at_beat(b) {
		// TODO
	}

	function bpm_at_time(t) {
		// TODO
	}

	// marker: {time|beat, bpm}
	function add_bpm_marker(marker) {
		// TODO
		var beatPeriod = bpm_to_beat_period(marker.bpm);
		var totalBeatsFn;
		var totalTimeFn;
		var valueAtBeatFn;
		if (marker.type=="linear") {
			// TODO
			totalBeatsFn = function (time) {
				return linear_integral_inverse(); //TODO
			};
			totalTimeFn  = function (beat) {
				return linear_integral(); //TODO
			};
			valueAtBeatFn = function(beat) {
				return linear(); //TODO
			};
		} else if (marker.type=="exponential") {
			// TODO
			totalBeatsFn = function (time) {
				return exponential_integral_inverse(); //TODO
			};
			totalTimeFn  = function (beat) {
				return exponential_integral(); //TODO
			};
			valueAtBeatFn = function(beat) {
				return exponential(); //TODO
			};
		} else if (marker.type=="constant") {
			// TODO
			totalBeatsFn = function (time) {
				//TODO
			};
			totalTimeFn  = function (beat) {
				//TODO
			};
			valueAtBeatFn = function(beat) {
				//TODO
			};
		}

		var obj = {
			type       : marker.type,
			endBeat    : marker.beat, 
			totalBeats : totalBeatsFn, 
			totalTime  : totalTimeFn, 
			valueAtBeat: valueAtBeatFn
		};
	}

	function remove_bpm_marker(markerTime) {
		// TODO
	}

	function change_bpm_marker(markerTime) {
		// TODO
	}

	/* 
	 * Given a beat index 'b0' and a step 'difB' (e.g.: beat 4, step 0.5), 
	 * returns the time period between [b0, b0+difB].
	 */
	function get_period(b0, difB) {
		var startTime = this.time(b0);
		var endTime   = this.time(b0+difB);
		return endTime - startTime;
	}

	// helper
	function bpm_to_beat_period(bpm) { 
		return 60/bpm; 
	}

	// helper
	function beat_period_to_bpm(beatPeriod) { 
		return 60/beatPeriod; 
	}
}