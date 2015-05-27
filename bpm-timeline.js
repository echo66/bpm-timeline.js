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
				return ((beat-pEndBeat) * bpm_to_beat_period(pEndBPM)) + previous.total_time(pEndBeat);
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
				// console.log("Right on the marker.");
				previous = mks[ti[pi]];
				next     = mks[ti[pi+1]];
			} else if (pi!=undefined && ni!=undefined) {
				// console.log("Between two markers.");
				previous = mks[ti[pi]];
				next     = mks[ti[ni]];
			} else if (pi!=undefined && ni==undefined) {
				// console.log("After the last marker.");
				previous = mks[ti[pi]];
			} else if (pi==undefined && ni!=undefined) {
				// console.log("Before the first marker.");
				next = mks[ti[ni]];
			}

			// console.log(next.endBeat)

			if (!next) {
				var pEndBPM  = previous.endBPM,
				    pEndTime = previous.endTime;
				return ((time-pEndTime) / bpm_to_beat_period(pEndBPM)) + previous.total_beats(pEndTime);
			} else 
				return next.total_beats(time);
		}
	}

	this.bpm_at_beat = function(beat) {
		if (beatsIndex.length == 0) 
			return initialBPM;
		else {
			var bi = beatsIndex;
			var idx = find_index(bi, beat);
			var m;
			if (idx.length==1) {
				m = bpmMarkers[bi[idx[0]]+""];
				return m.endBPM;
			} else {
				if (is_first(idx)){
					m = bpmMarkers[bi[idx[1]]+""];
				} else if (is_last(idx)) {
					m = bpmMarkers[bi[bi.length-1]+""];
				} else if (is_inbetween(idx)) {
					m = bpmMarkers[bi[idx[1]]+""];
				} else 
					throw "Bad beat value ("+beat+") @ BPMTimeline.bpm_at_beat.";

				return beat_period_to_bpm(m.value_at_beat(beat));
			}
		}
	}

	this.bpm_at_time = function(time) {
		return this.bpm_at_beat(this.beat(time));
	}

	function is_last(idx) {
		return idx.length > 1 && idx[0]!=undefined && idx[1]==undefined;
	}

	function is_first(idx) {
		return idx.length > 1 && idx[0]==undefined && idx[1]!=undefined;
	}

	function is_inbetween(idx) {
		return idx.length > 1 && !is_first(idx) && !is_last(idx);
	}

	// marker: {endTime|endBeat, endBPM}
	this.add_bpm_marker = function(marker) {
		// TODO: one could use "time" instead of "beat" in the marker object.
		var totalBeatsFn;
		var totalTimeFn;
		var valueAtBeatFn;

		if (marker.type=="linear" || marker.type=="exponential") {

			totalBeatsFn = function (time) {

				var start = (this.previous)? this.previous.endBeat : 0;
				var startBeatPeriod = 
					(this.previous)? 
						bpm_to_beat_period(this.previous.endBPM) : 
						bpm_to_beat_period(this.timeline.get_initial_bpm());

				var end = this.endBeat;
				var endBeatPeriod = bpm_to_beat_period(this.endBPM);
				
				var totalTimeAtStart;

				if (!this.previous) {
					totalTimeAtStart = 0;
				} else 
					totalTimeAtStart = 
						this.previous.endTime
							= this.previous.total_time(start);

				var value = F[this.type+"_integral_inverse"](start, end, startBeatPeriod, endBeatPeriod, totalTimeAtStart, time);

				return value;
			};

			totalTimeFn  = function (beats) {

				var start = (this.previous)? this.previous.endBeat : 0;
				var startBeatPeriod = 
					(this.previous)? 
						bpm_to_beat_period(this.previous.endBPM) : 
						bpm_to_beat_period(this.timeline.get_initial_bpm());

				var end = this.endBeat;
				var endBeatPeriod = bpm_to_beat_period(this.endBPM);

				var totalTimeAtStart;

				if (!this.previous) {
					totalTimeAtStart = 0;
				} else 
					totalTimeAtStart = 
						this.previous.endTime 
							= this.previous.total_time(start);

				var value = F[this.type+"_integral"](start, end, startBeatPeriod, endBeatPeriod, totalTimeAtStart, beats);

				return value;
			};

			valueAtBeatFn = function (beats) {

				var end = this.endBeat;
				var endBeatPeriod = bpm_to_beat_period(this.endBPM);
				var start = (this.previous)? this.previous.endBeat : 0;
				var startBeatPeriod = (this.previous)? bpm_to_beat_period(this.previous.endBPM) : bpm_to_beat_period(this.timeline.get_initial_bpm());

				var value = F[this.type](start, end, startBeatPeriod, endBeatPeriod, beats)

				return value;
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
			value_at_beat : valueAtBeatFn
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

			if (bi.length==0) {
				bi.splice(0, 0, eb);
				ti.splice(0, 0, et);
			} else if (pi != undefined && ni == undefined) {
				// Insert after the last marker in the array.
				bi.splice(pi+1, 0, eb);
				obj.previous = bmks[bi[pi]+""];
				et = obj.endTime = obj.total_time(marker.endBeat);
				ti.splice(pi+1, 0, et);
			} else if (pi == undefined && ni != undefined) {
				// Insert before the first marker in the array.
				bi.splice(ni, 0, eb);
				bmks[bi[ni]+""].previous = obj;
				obj.previous = undefined;
				et = obj.endTime = obj.total_time(marker.endBeat);
				ti.splice(ni, 0, et);
			} else if (pi != undefined && ni != undefined) {
				// Insert inbetween the markers in the array.
				bi.splice(ni, 0, eb);
				bmks[bi[ni]+""].previous = obj;
				obj.previous = bmks[bi[pi]+""];
				et = obj.endTime = obj.total_time(marker.endBeat);
				ti.splice(ni, 0, et);
			}

			bmks[eb+""] = tmks[et+""] = obj;
		} else 
			throw "Illegal access to a BPM marker @ BPMTimeline.add_bpm_marker.";
	}

	// params: {endTime/endBeat}
	this.remove_bpm_marker = function(params) {
		if (!params) 
			throw "Invalid arguments";

		var t, firstIndexArr, secondIndexArr, firstMarkers, secondMarkers;

		if (params.endBeat!=undefined) {
			var m = bpmMarkers[params.endBeat+""];
			if (m) {
				t = params.endBeat;
				firstIndexArr = beatsIndex;
				firstMarkers = bpmMarkers;
				secondIndexArr = timeIndex;
				secondMarkers = timeMarkers;
			} else
				throw "Invalid endBeat";
		} else if (params.endTime!=undefined) {
			var m = timeMarkers[params.endTime+""];
			if (m) {
				t = params.endTime;
				firstIndexArr = timeIndex;
				firstMarkers = timeMarkers;
				secondIndexArr = beatsIndex;
				secondMarkers = bpmMarkers;
			} else
				throw "Invalid endTime";
		} else 
			throw "Invalid arguments";

		var i = find_index(firstIndexArr, t)[0];
		var T = timeIndex.splice(i, 1)[0];
		var B = beatsIndex.splice(i, 1)[0];
		var previousMarker = firstMarkers[t+""].previous;
		delete bpmMarkers[B+""];
		delete timeMarkers[T+""];

		var nextMarker = firstMarkers[firstIndexArr[i]+""];
		if (nextMarker)
			nextMarker.previous = previousMarker;

		if (firstIndexArr[i]!=undefined)
			refreshEndTimes(i);
	}

	// params: {endTime/endBeat, endBPM}
	this.change_bpm_marker = function(params) {
		// TODO
		if (!params || params.endBPM==undefined) 
			throw "Invalid arguments";

		if (beatsIndex.length==0)
			throw "There are no markers";
		else if (params.endTime) {

			var m = timeMarkers[params.endTime+""];
			if (m != undefined) {
				m.endBPM = params.endBPM;
				refreshEndTimes(find_index(beatsIndex, m.endBeat)[0]);
			} else 
				throw "Invalid endTime";

		} else if (params.endBeat) {

			var m = bpmMarkers[params.endBeat+""];
			if (m != undefined) {
				m.endBPM = params.endBPM;
				refreshEndTimes(find_index(beatsIndex, m.endBeat)[0]);
			} else 
				throw "Invalid endBeat";

		} else 
			throw "Invalid arguments";

	}

	function refreshEndTimes(startTimeIndex) {
		for (var i=startTimeIndex; i<timeIndex.length; i++) {
			var m = bpmMarkers[beatsIndex[i]+""];
			m.endTime = m.total_time(m.endBeat);
		}
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
				previous: (m.previous)? get_marker(bi[i-1]) : undefined,
				type    : m.type,
			}
			toReturn.splice(toReturn.length, 0, obj);
		}
		return toReturn;
	}

	var get_marker = function(index) {
		var m = bpmMarkers[index];
		return {
			endBeat : m.endBeat,
			endBPM  : m.endBPM, 
			endTime : m.endTime,
			type    : m.type,
		};
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