function res = fn_exponential_integral(x0, x1, y0, y1, constant, x )
    
    dx = x1 - x0;
    ry = y1 / y0;
    U  = ry ^ (1/dx);
    res = y0 * (U.^(x-x0)/log(U));

end

