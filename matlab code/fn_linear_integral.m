function res = fn_linear_integral (x0, x1, y0, y1, constant, x)
	dy  = y1 - y0;
	dx  = x1 - x0;
	M   = dy / dx;
	C   = y0;
	res = (M/2).*((x - x0).^2) + C.*(x - x0) + constant;
end