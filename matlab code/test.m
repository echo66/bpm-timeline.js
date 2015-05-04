close all; clear; clc;

figure
hold

X = [ 0   50;
      50  110;
      110 120;
      120 125;
      125 130 ];
  
Y = [ 60  120;
      120 140;
      140 50;
      50  10;
      10  1000 ];

 last = 0;
 last_ = 0;
 
 X_  = [];
 I_  = [];
 II_ = [];
  
for line=1:5
    x0 = X(line,1);
    x1 = X(line,2);
    y0 = Y(line,1);
    y1 = Y(line,2);
    X1 = x0:0.1:x1;
    constant = last;
    I  = fn_linear_integral(x0, x1, 60/y0, 60/y1, constant, X1)';
    II = fn_linear_integral_inverse(x0, x1, 60/y0, 60/y1, I(1), I);
    II = II(:,1)';
%     plot(X1, I, 'Color', [rand, rand, rand]);
    plot(X1, II, 'Color', [rand, rand, rand]);
    last = I(end);
    X_  = [X_  X1];
    I_  = [I_  I'];
    II_ = [II_ II];
end