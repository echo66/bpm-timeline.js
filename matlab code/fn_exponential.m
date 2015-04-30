function res = fn_exponential( x0, x1, y0, y1, x )
    res = y0 * ((y1 / y0).^((min(x, x1) - x0) ./ (x1 - x0)));
end

