X = [ [0,   50], 
	  [50,  110], 
	  [110, 120], 
	  [120, 125], 
	  [125, 130] ];

Y = [ [60,   120], 
	  [120,  140], 
	  [140,   50], 
	  [50,    10], 
	  [10,  1000] ];

last = 0;

X_  = [];
I_  = [];
II_ = [];

var F = new Formulas();

// define dimensions of graph
var m = [0, 0, 20, 80]; // margins
var w = 600 - m[1] - m[3]; // width
var h = 400 - m[0] - m[2]; // height

d3.select("#graph1")
	.append("svg:svg")
		.attr("width", w + m[1] + m[3])
		.attr("height", h + m[0] + m[2]);

for (var line=0; line<5; line++) {

	var x0 = X[line][0];
	var x1 = X[line][1];
	var y0 = Y[line][0];
	var y1 = Y[line][1];
	var constant = last;

	var XX = [];
	var I = [];
	var II = [];

	for (var X1=x0; X1<=x1; X1+=0.1) 
		XX[XX.length] = X1;

	for (var X1=x0; X1<=x1; X1+=0.1) 
		I[I.length] = {
			y: F.linear_integral(x0, x1, 60/y0, 60/y1, constant, X1),
			x: X1
		};
	
	for (var X1=x0, j=0; X1<=x1; X1+=0.1, j++) {
		II[II.length] = {
			y: F.linear_integral_inverse(x0, x1, 60/y0, 60/y1, I[0].y, I[j].y),
			x: X1
		};
	}
		
	
	X_.push(XX);
	I_.push(I);
	II_.push(II);

	XX.color = random_color_v2();
	I.color = random_color_v2();
	II.color = random_color_v2();

	last = I[I.length-1].y;
}

function random_color_v2() {
	return 'rgb(' + [
		~~(Math.random() * 255),
		~~(Math.random() * 255),
		~~(Math.random() * 255)
	] + ')';
}