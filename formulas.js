function Formulas() {}

Formulas.prototype.exponential = function(x0, x1, y0, y1, x) {
	return y0 * Math.pow((y1 / y0), ((Math.min(x, x1) - x0) / (x1 - x0)));
}

Formulas.prototype.exponential_integral = function(x0, x1, y0, y1, constant, x) {
	// Integral of the following function:
	// v(t) = V0 * (V1 / V0) ^ ((t - T0) / (T1 - T0))
	
	dx = x1 - x0;
	ry = y1 / y0;
	U  = ry ^ (1/dx);
	return y0 * ( Math.pow(U, x-x0) / Math.log(U) );
}

Formulas.prototype.exponential_integral_inverse = function(x0, x1, y0, y1, constant, y) {
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

	aux = (y * log(U) / V) - constant;

	res = log(aux) / log(U);
}


Formulas.prototype.linear = function(x0, x1, y0, y1, x) {
	return y0 + (y1 - y0) * ((Math.min(x, x1) - x0) / (x1 - x0));
}

Formulas.prototype.linear_integral = function(x0, x1, y0, y1, constant, x) {
	// Integral of the following function: 
	// v(t) = V0 + (V1 - V0) * ((t - T0) / (T1 - T0))
	
	dy  = y1 - y0;
	dx  = x1 - x0;
	M   = dy / (2*dx);
	C   = y0;

	return M * Math.pow((x - x0), 2) + y0 * (x - x0) + constant;
}

Formulas.prototype.linear_integral_inverse = function(x0, x1, y0, y1, constant, y) {

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