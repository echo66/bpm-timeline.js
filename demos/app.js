var tl = new BPMTimeline(120);
tl.add_tempo_marker({ type: "linear", endBeat: 64, endTempo: 140 });
tl.add_tempo_marker({ type: "step", endBeat: 128, endTempo: 135 });
tl.add_tempo_marker({ type: "exponential", endBeat: 192, endTempo: 20 });
var idCounter = 0;


function refresh() {
	document.getElementById("graphs-div").innerHTML = "";
	refresh_marker_table();
	refresh_graphs(tl);
}

function refresh_marker_table() {
	var table = document.getElementById("markers-table");
	table.innerHTML = "";

	var markerRow = create_tempo_markers_table_row({
		endTempo : tl.get_initial_tempo(), 
		endBeat  : 0, 
		canChangeEndTempo: true
	});

	markerRow.dataset['stored'] = true;

	document.getElementById('markers-table').appendChild(markerRow);


	var markers = tl.get_markers();

	for (var i=0; i<markers.length; i++) {
		var m = markers[i];
		var markerRow = create_tempo_markers_table_row({
			types : {
				"linear" : (m.type == "linear")? true : false, 
				"step" : (m.type == "step")? true : false, 
				"exponential" : (m.type == "exponential")? true : false
			}, 
			endTempo : m.endTempo, 
			endBeat  : m.endBeat,
			canDelete : true, 
	 		canChangeEndBeat : true,
	 		canChangeEndTempo: true
		});

		markerRow.dataset['stored'] = true;

		document.getElementById('markers-table').appendChild(markerRow);
	}
}

function add_new_marker_to_table() {
	var markerRow = create_tempo_markers_table_row({
		types:{},
		canDelete : true, 
 		canChangeEndBeat : true,
 		canChangeEndTempo: true
	});

	document.getElementById('markers-table').appendChild(markerRow);
}

/*
 	params: {
 		types: {
			"linear" : Boolean, 
			"step" : Boolean, 
			"exponential" : Boolean, 
			...
 		}, 
 		endTempo: Number, 
 		endBeat : Number, 
 		canDelete : Boolean, 
 		canChangeEndBeat : Boolean,
 		canChangeEndTempo: Boolean
 	}
 */
function create_tempo_markers_table_row(params) {
	var markerRow = document.createElement('tr');
	var markerId = idCounter++;
	markerRow.id = "marker-row-" + markerId;
	markerRow.dataset['stored'] = false;
	markerRow.dataset['currentBeat'] = params.endBeat;

	var typeCell = create_tempo_function_dropdown_cell(params, markerId);
	
	var endTempoCell = create_end_tempo_cell(params, markerId);

	var endBeatCell = create_end_beat_cell(params, markerId);

	var saveButtonCell = create_save_button_cell(params, markerId);

	var deleteButtonCell = create_delete_button_cell(params, markerId);

	markerRow.appendChild(typeCell);
	markerRow.appendChild(endTempoCell);
	markerRow.appendChild(endBeatCell);
	markerRow.appendChild(saveButtonCell);
	markerRow.appendChild(deleteButtonCell);

	return markerRow;
}

function create_tempo_function_dropdown_cell(params, markerId) {
	var typeCell = document.createElement('td');
	if (params.types) {
		var typeSelect = document.createElement('select');
		typeSelect.id = "type-" + markerId;

		var linearOption = document.createElement('option');
		linearOption.value = 'linear';
		linearOption.innerHTML = 'linear';
		linearOption.selected = (params.types.linear)? true : false;
		typeSelect.appendChild(linearOption);

		var stepOption = document.createElement('option');
		stepOption.value = 'step';
		stepOption.innerHTML = 'step';
		stepOption.selected = (params.types.step)? true : false;
		typeSelect.appendChild(stepOption);

		var exponentialOption = document.createElement('option');
		exponentialOption.value = 'exponential';
		exponentialOption.innerHTML = 'exponential';
		exponentialOption.selected = (params.types.exponential)? true : false;
		typeSelect.appendChild(exponentialOption);
		typeCell.appendChild(typeSelect);
	} else {
		typeCell.innerHTML = "N/A";
	}

	return typeCell;
}

function create_end_tempo_cell(params, markerId) {
	var endTempoCell = document.createElement('td');
	var endTempoInput = document.createElement('input');
	endTempoInput.id = "end-tempo-" + markerId;
	endTempoInput.value = (params.endTempo != undefined)? params.endTempo : "";
	endTempoInput.placeholder = "Insert a number";
	endTempoInput.disabled = (params.canChangeEndTempo)? false : true ;
	endTempoCell.appendChild(endTempoInput);

	return endTempoCell;
}

function create_end_beat_cell(params, markerId) {
	var endBeatCell = document.createElement('td');
	var endBeatInput = document.createElement('input');
	endBeatInput.id = "end-beat-" + markerId;
	endBeatInput.value = (params.endBeat != undefined)? params.endBeat : "";
	endBeatInput.placeholder = "Insert a number";
	endBeatInput.disabled = (params.canChangeEndBeat)? false : true ;
	endBeatCell.appendChild(endBeatInput);

	return endBeatCell;
}

function create_save_button_cell(params, markerId) {
	var saveButtonCell = document.createElement('td');
	var saveButton = document.createElement('button');
	saveButton.id = 'save-'+markerId;
	saveButton.innerHTML = 'save';
	saveButton.dataset['markerId'] = markerId;
	saveButton.onclick = function(e) { save_tempo_marker(e.target.dataset["markerId"]); };
	saveButtonCell.appendChild(saveButton);
	return saveButtonCell;
}

function create_delete_button_cell(params, markerId) {
	var deleteButtonCell = document.createElement('td');
	var deleteButton = document.createElement('button');
	deleteButton.id = 'delete-'+markerId;
	deleteButton.innerHTML = 'delete';
	deleteButton.dataset['markerId'] = markerId;
	deleteButton.disabled = (params.canDelete)? false : true ;
	deleteButton.onclick = function(e) { delete_tempo_marker(e.target.dataset["markerId"]); };
	deleteButtonCell.appendChild(deleteButton);
	return deleteButtonCell;
}

function refresh_graphs(tl) {
	// define dimensions of graph
	var m = [0, 0, 20, 80]; // margins
	var w = 600 - m[1] - m[3]; // width
	var h = 400 - m[0] - m[2]; // height

	var datasets = {
		tempoAtBeat: []
	};

	var markers = tl.get_markers();
	for (var mi in markers)
		markers[mi].color = random_color_v2();

	// Create "timeAtBeat" dataset
	var xmax = markers[markers.length-1].endBeat;
	for (var mi in markers) {

		console.log("----------mi:"+mi+"--------------");

		var arr1 = [];

		var Ms = markers[mi];

		for (var beat = (Ms.previous)? Ms.previous.endBeat : 0; beat <= Ms.endBeat; beat += 0.1) {
			var tempoAtBeat = tl.tempo_at_beat(beat);
			arr1.push({ x: beat, y: tempoAtBeat });
			// console.log({ x: beat, y: tempoAtBeat });
		}

		arr1.color = Ms.color;
		
		datasets.tempoAtBeat.push(arr1);

	}

	var ymax = tl.get_max_tempo();

	create_d3_xy_graph("graphs-div", "graph1", w, h, m, datasets.tempoAtBeat, xmax+50, ymax+10);

	function random_color_v2() {
		return 'rgb(' + [
			~~(Math.random() * 255),
			~~(Math.random() * 255),
			~~(Math.random() * 255)
		] + ')';
	}
	//TODO
}


function delete_tempo_marker(markerId) {
	var markerRow = document.getElementById("marker-row-"+markerId);
	if (markerRow.dataset.stored == "true") {
		var endBeat = document.querySelector("#end-beat-"+markerId).value;
		tl.remove_tempo_marker({endBeat: endBeat});
	}
	markerRow.remove();
	refresh();
}

function save_tempo_marker(markerId) {
	var markerRow = document.getElementById("marker-row-"+markerId);
	var typeSelect = document.querySelector("#type-"+markerId);
	var endTempo = Number(document.querySelector("#end-tempo-"+markerId).value);
	var endBeat = Number(document.querySelector("#end-beat-"+markerId).value);
	var type =  (typeSelect == null)? undefined : typeSelect.options[typeSelect.selectedIndex].value;
	var oldCurrentBeat = Number(markerRow.dataset["currentBeat"]);

	console.log([endTempo, endBeat, type]);

	if (type) {
		if (markerRow.dataset.stored == "true") {
			tl.change_tempo_marker({ oldEndBeat: oldCurrentBeat, newType: type, newEndTempo: endTempo, newEndBeat: endBeat });
		} else if (type != "" && endBeat != "" && endTempo != "") {
			tl.add_tempo_marker({ type: type, endBeat: endBeat, endTempo: endTempo });
		} else {
			alert("Invalid input at markers table");
			throw "Invalid input at markers table";
		}
	} else {
		tl.set_initial_tempo(endTempo);
	}

	markerRow.dataset["currentBeat"] = endBeat;
	refresh();
}


refresh();