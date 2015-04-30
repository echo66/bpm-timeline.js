function res = fn_linear (x0, x1, y0, y1, x) 
	res = y0 + (y1-y0) * ((x-x0)/(x1-x0));
end