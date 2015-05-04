function res = fn_linear_integral_inverse (x0, x1, y0, y1, constant, y)
	dx    = x1 - x0;
	dy    = y1 - y0;
    A    = 0.5 * dy / dx;
    B    = y0;
    C    = constant;
    
    square_root = sqrt(B*B - 4*A.*(C-y));
    sol1 = (-B + square_root) / (2*A);
    sol2 = (-B - square_root) / (2*A);
    
    res = [sol1+x0 sol2+x0];
end