function BPMTimeline(initialBPM) {

	var initialBPM = initialBPM;

	var F = new Formulas();

	var bpmMarkers  = {};
	var timeMarkers = {};

	var beatsIndex = [];
	var timeIndex  = [];


	// converter from beat to time
	this.time = function (beat) {

		if (beatsIndex.length == 0) 
			return beat * bpm_to_beat_period(initialBPM); // constant BPM
		else {
			var bi = beatsIndex;
			var idx  = find_index(bi, beat);
			var mks = bpmMarkers;
			var previous, next;
			var pi = idx[0];
			var ni = idx[1];

			if (idx.length == 1) {
				previous = mks[bi[pi]];
				next     = mks[bi[pi+1]];
			} else if (pi!=undefined && ni!=undefined) {
				previous = mks[bi[pi]];
				next     = mks[bi[ni]];
			} else if (pi!=undefined && ni==undefined) 
				previous = mks[bi[pi]];
			else if (pi==undefined && ni!=undefined) 
				next = mks[bi[ni]];

			if (!next) {
				var pEndBeat = previous.endBeat, pEndBPM  = previous.endBPM;
				return (beat-pEndBeat) * bpm_to_beat_period(pEndBPM) + previous.total_time(pEndBeat);
			} else 
				return next.total_time(beat);
		}

	}

	// converter from time to beat
	this.beat = function (time) {

		if (timeIndex.length == 0) // constant BPM
			return time / bpm_to_beat_period(initialBPM);
		else {
			var ti   = timeIndex;
			var idx  = find_index(ti, time);
			var mks = timeMarkers;
			var previous, next;
			var pi = idx[0];
			var ni = idx[1];

			if (idx.length == 1) {
				previous = mks[ti[pi]];
				next     = mks[ti[pi+1]];
			} else if (pi!=undefined && ni!=undefined) {
				previous = mks[ti[pi]];
				next     = mks[ti[ni]];
			} else if (pi!=undefined && ni==undefined) 
				previous = mks[ti[pi]];
			else if (pi==undefined && ni!=undefined) 
				next = mks[ti[ni]];

			if (!next) {
				return ((time-previous.endTime) / bpm_to_beat_period(previous.endBPM)) + previous.endTime;

			} else 
				return next.total_beats(time);
		}

		// // TODO
		// var previous;
		// var next;

		// for (var i=0; i<bpmMarkers.length; i++) {
		// 	if (bpmMarkers[i].time > time) {
		// 		next = bpmMarkers[i];
		// 	} else {
		// 		previous = bpmMarkers[i];
		// 	}
		// }

		// if (!previous && !next) // constant BPM
		// 	return time / bpm_to_beat_period(initialBPM);
		// else if (previous && next)
		// 	return next.totalTime(time);
		// else if (previous && !next)
		// 	previous.beat 
	}

	function update(_initialBPM, start, end) {
		// TODO
		bpmMarkers.sort(function(m1, m2) { return m1.beat - m2.beat; });
	}

	function bpm_at_beat(beat) {
		// TODO: test this function.
		if (beatsIndex.length == 0) 
			return initialBPM;
		else {
			var bi = beatsIndex;
			var idx = find_index(bi, beat);
			var m = bpmMarkers[beatsIndex[idx[0]]+""];
			if (idx.length==1 || (idx[0]!=undefined && idx[1]==undefined)) 
				return m.endBPM;
			else if (idx[1]!=undefined) 
				return m.value_at_beat(beat);
			else 
				throw "Bad beat value ("+beat+") @ BPMTimeline.bpm_at_beat.";
		}
	}

	function bpm_at_time(time) {
		// TODO
	}

	// marker: {time|beat, bpm}
	this.add_bpm_marker = function(marker) {
		// TODO
		var totalBeatsFn;
		var totalTimeFn;
		var valueAtBeatFn;

		if (marker.type=="linear" || marker.type=="exponential") {

			totalBeatsFn = function (time) {

				var end = this.endBeat;
				var endBeatPeriod = bpm_to_beat_period(this.endBPM);
				var start = (this.previous)? this.previous.endBeat : 0;
				var startBeatPeriod = 
					(this.previous)? 
						bpm_to_beat_period(this.previous.endBPM) : 
						bpm_to_beat_period(this.timeline.get_initial_bpm());

				var totalTimeAtStart;

				if (!this.previous) {
					totalTimeAtStart = 0;
				} else 
					totalTimeAtStart = 
						this.previous.endTime 
							= this.previous.total_time(start);

				return F[this.type+"_integral_inverse"](start, end, startBeatPeriod, endBeatPeriod, totalTimeAtStart, time);
			};

			totalTimeFn  = function (beats) {

				var end = this.endBeat;
				var endBeatPeriod = bpm_to_beat_period(this.endBPM);
				var start = (this.previous)? this.previous.endBeat : 0;

				var startBeatPeriod = 
					(this.previous)? 
						bpm_to_beat_period(this.previous.endBPM) : 
						bpm_to_beat_period(this.timeline.get_initial_bpm());

				var totalTimeAtStart;

				if (!this.previous) {
					totalTimeAtStart = 0;
				} else 
					totalTimeAtStart = 
						this.previous.endTime 
							= this.previous.total_time(start);

				return F[this.type+"_integral"](start, end, startBeatPeriod, endBeatPeriod, totalTimeAtStart, beats);
			};

			valueAtBeatFn = function (beats) {

				var end = this.endBeat;
				var endBeatPeriod = bpm_to_beat_period(this.endBPM);
				var start = (this.previous)? this.previous.endBeat : 0;
				var startBeatPeriod = (this.previous)? bpm_to_beat_period(this.previous.endBPM) : this.timeline.get_initial_bpm();

				return F[this.type](start, end, startBeatPeriod, endBeatPeriod, beats);
			};

		} else {
			throw "Unsupported marker type (" + marker.type + ") @ BPMTimeline.add_bpm_marker.";
		}

		var obj = {
			previous      : undefined,
			timeline      : this, 
			type          : marker.type,
			endBeat       : marker.endBeat, 
			endBPM        : marker.endBPM, 
			endTime       : undefined, 
			total_beats   : totalBeatsFn, 
			total_time    : totalTimeFn, 
			value_at_beat : valueAtBeatFn,
			value_at_time : undefined
		};

		totalBeatsFn.bind(obj);
		totalTimeFn.bind(obj);
		valueAtBeatFn.bind(obj);

		var bi = beatsIndex;
		var ti = timeIndex;
		var eb = marker.endBeat;
		var et = obj.endTime = obj.total_time(marker.endBeat);

		var idx = find_index(bi, marker.endBeat);
		var pi  = idx[0];
		var ni  = idx[1];
		
		if (idx.length > 1) {

			var bmks = bpmMarkers;
			var tmks = timeMarkers;

			bmks[eb+""] = tmks[et+""] = obj;

			if (bi.length==0) {
				bi.splice(0, 0, eb);
				ti.splice(0, 0, et);
			} else if (pi != undefined && ni == undefined) {
				// Insert after the last marker in the array.
				bi.splice(pi+1, 0, eb);
				ti.splice(pi+1, 0, et);
				obj.previous = bmks[bi[pi]+""];
			} else if (pi == undefined && ni != undefined) {
				// Insert before the first marker in the array.
				bi.splice(ni, 0, eb);
				ti.splice(ni, 0, et);
				bmks[bi[ni]+""].previous = obj;
				tmks[ti[ni]+""].previous = obj;
				obj.previous = undefined;
			} else if (pi != undefined && ni != undefined) {
				// Insert inbetween the markers in the array.
				bi.splice(ni, 0, eb);
				ti.splice(ni, 0, et);
				bmks[bi[ni]+""].previous = obj;
				tmks[ti[ni]+""].previous = obj;
				obj.previous = bmks[bi[pi]+""];
			}
		} else 
			throw "Illegal access to a BPM marker @ BPMTimeline.add_bpm_marker.";

	}

	this.remove_bpm_marker = function(markerTime) {
		// TODO
	}

	this.change_bpm_marker = function(markerTime) {
		// TODO
	}

	this.get_markers = function() {
		var toReturn = [];
		var bi = beatsIndex;
		for (var i=0; i<bi.length; i++) {
			var m = bpmMarkers[bi[i]];
			var obj = {
				endBeat : m.endBeat,
				endBPM  : m.endBPM, 
				endTime : m.endTime, 
				type    : m.type,
			}
			toReturn.splice(toReturn.length, 0, obj);
		}
		return toReturn;
	}

	this.get_initial_bpm = function() {
		return initialBPM;
	}

	this.set_initial_bpm = function(newBPM) {
		// TODO: Test this function.
		initialBPM = newBPM;
		for (var i in beatsIndex) {
			var m = bpmMarkers[beatsIndex[i]+""];
			m.endTime = m.total_time(m.endBeat);
		}
	}

	/* 
	 * Given a beat index 'b0' and a step 'difB' (e.g.: beat 4, step 0.5), 
	 * returns the time period between [b0, b0+difB]. 
	 * Useful function to return the time period of, for example, a segment 
	 * of 4 beats.
	 */
	this.get_period = function(b0, difB) {
		// TODO: Test this function.
		var startTime = this.time(b0);
		var endTime   = this.time(b0 + difB);
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