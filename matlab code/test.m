close all; clear; clc;

figure
hold


x0 = 0;
x1 = 100;
y0 = 1;
y1 = 20;

X1 = [x0:0.1:x1];
l1 = fn_exponential(x0, x1, y0, y1, X1);
i1 = fn_exponential_integral(x0, x1, y0, y1, 0, X1);
ii1 = fn_exponential_integral_inverse(x0, x1, y0, y1, 0, i1);
plot(X1, l1, 'red')
plot(X1, i1, 'blue')
plot(X1, ii1, 'green')



% x0 = x1 
% x1 = 2*x1;
% y0 = y1;
% y1 = 10*y1;
% 
% X1 = [x0:0.1:x1];
% l1 = fn_linear(x0, x1, y0, y1, X1);
% i1 = fn_linear_integral(x0, x1, y0, y1, i1(end), X1);
% plot(X1, l1, 'red')
% plot(X1, i1, 'red')
% 
% 
% 
% x0 = x1
% x1 = 2*x1;
% y0 = y1;
% y1 = 0.01*y1;
% 
% X1 = [x0:0.1:x1];
% l1 = fn_linear(x0, x1, y0, y1, X1);
% i1 = fn_linear_integral(x0, x1, y0, y1, i1(end), X1);
% plot(X1, l1, 'blue')
% plot(X1, i1, 'blue')
% 
% hold off
