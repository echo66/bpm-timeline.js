function res = fn_exponential_integral_inverse( x0, x1, y0, y1, constant, y )

    dx = x1 - x0;
    ry = y1 / y0;
    U = ry ^ (1/dx);
    V = y0 * (ry ^ (-x0/dx));

    aux = (y .* log(U) / V) - constant;

    res = log(aux) / log(U);

end

