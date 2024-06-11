

function findpressure(altitude)
{
if ((altitude<-5000)||(altitude>11000)) alert ("Altitude accurate from -5,000 to 11,000m");
pressure = 101325*Math.pow(1 - 2.25577e-5*altitude,5.2559);
return (pressure);
}

function saturation_pressure(t)
{
var c1 = -5.6745359e3;
var c2 = 6.3925247e0;
var c3 = -9.677843e-3;
var c4 = 6.2215701e-7;
var c5 = 2.0747825e-9;
var c6 = -9.484024e-13;
var c7 = 4.1635019e0;

var c8=-5.8002206e3;
var c9=1.3914993;
var c10=-4.8640239e-2;
var c11=4.1764768e-5;
var c12=-1.4452093e-8;
var c13=6.5459673;

if (t>0)
  {
    t=t+273.15;
    pressure=Math.exp(c8/t+c9+c10*t+c11*t*t+c12*t*t*t+c13*Math.log(t));
  }
else
  { 
    t=t+273.15;
    pressure=Math.exp(c1/t+c2+c3*t+c4*t*t+c5*t*t*t+c6*t*t*t*t+c7*Math.log(t)); 
  }    
return(pressure);
}

function humidity_ratio(p_w,p)
{
hum = 0.621945*p_w/(p-p_w);
return(hum);
}

function equation_33(t_wb,ws_wb,t)
{
w=((2501-2.326*t_wb)*ws_wb - 1.006*(t-t_wb))/(2501+1.86*t-4.186*t_wb);
return(w);
}


function degree_saturation(w,ws)
{
return(w/ws);
}

function rel_humidity(mew,p_ws,p)
{
thi=mew/(1.0-(1.0-mew)*(p_ws/p));
return(thi*100);
}

function specific_volume(t,w,p)
{
v = 287.042*(t+273.15)*(1+1.607858*w)/p;
//converted for pressure in Pa not kPa
return(v);
}

function enthalpy(w,t)
{
h=1.006*t + w*(2501+1.86*t);
return(h);
}

function equation_36(p,w)
{
pressure=p*w/(0.621945+w);
return(pressure);
}

function dewpoint(p_w)
{
p_w=p_w/1000.0;
a = Math.log(p_w);
c14=6.54;
c15=14.526;
c16=0.7389;
c17=0.09486;
c18=0.4569;

dew= c14+c15*a+c16*a*a+c17*a*a*a+c18*Math.pow(p_w,0.1984);
if (dew < 0)
  dew = 6.09 + 12.608*a + 0.4959*a*a;
  
return(dew);
}

function density(v,w)
{
dens=(1.0/v)*(1.0+w);
return(dens);
}

function calcwetbulb(t,p,w)
{
t_wb=t;
count=1;
error=1.0;
while ((count < 10000)&&(error > 0.001))
 {
   p_ws_wb=saturation_pressure(t_wb);
   ws_wb=humidity_ratio(p_ws_wb,p);
   test=(2501*(ws_wb-w)-t*(1.006+1.86*w))/(2.326*ws_wb-1.006-4.186*w);
   error = t_wb-test;
   t_wb = t_wb - error/100;
   count = count+1;
  }
if (count > 9999) alert ("calculation error in wet bulb temperature");
return (t_wb);
}

function psychoCalc({drybulb,wetbulb,altitude,humdity})
{  
   var t=0.0; 
   
   if (!(t=parseFloat(drybulb))) 
     { 
       alert("Please enter a number for Dry Bulb temperature");
       return;
     }
   
   rh=parseFloat(humdity);   
  
   altitude=parseFloat(altitude);
        
   if (t_wb=parseFloat(wetbulb)) 
    {
     if (t_wb>t) 
       {
         alert("Wet bulb cannot be greater than Dry bulb!");
         return;
       }
     p = findpressure(altitude);
     p_ws_wb=saturation_pressure(t_wb);
     ws_wb=humidity_ratio(p_ws_wb,p);
     w=equation_33(t_wb,ws_wb,t);
     p_ws=saturation_pressure(t);
     ws=humidity_ratio(p_ws,p);
     mew=degree_saturation(w,ws); 
     rh=rel_humidity(mew,p_ws,p);
     v=specific_volume(t,w,p);
     h=enthalpy(w,t);
     p_w=equation_36(p,w);
     t_d=dewpoint(p_w);
     rho=density(v,w);  
    }
   
   else if ((rh>=0) && (rh <=100))
     {
     p = findpressure(altitude);
     p_ws=saturation_pressure(t);
     p_w=p_ws*rh/100.0;
     w = humidity_ratio(p_w,p);
     ws = humidity_ratio(p_ws,p);
     mew=degree_saturation(w,ws); 
     v=specific_volume(t,w,p);
     h=enthalpy(w,t);
     t_d=dewpoint(p_w);
     rho=density(v,w);  
     t_wb=calcwetbulb(t,p,w);
     }
     
   else if (t_d=parseFloat(dewpoint))
     {
     p = findpressure(altitude);
     p_w=saturation_pressure(t_d);
     w = humidity_ratio(p_w,p);
     p_ws=saturation_pressure(t);     
     ws = humidity_ratio(p_ws,p);     
     mew=degree_saturation(w,ws); 
     rh=rel_humidity(mew,p_ws,p);
     v=specific_volume(t,w,p);
     h=enthalpy(w,t);
     rho=density(v,w);  
     t_wb=calcwetbulb(t,p,w);
     }
  
   else
     {
     alert("You must enter either Wet Bulb, Relative Humdity or Dewpoint temperature");
     return;
     }    
   
   if (t>80 || t<-60) alert("Results may be inaccurate for temperatures > 80 or < -60");
   
   if (rh<0)
     {
       humdity=0;
       wetbulb = "";
       dewpoint = "";
       psychoCalc();
     }
   
   drybulb = Math.round(t*100)/100;    
   wetbulb = Math.round(t_wb*100)/100; 
   humdity = Math.round(rh); 
   dewpoint = Math.round(t_d*100)/100; 
   altitude = Math.round(altitude);          
   enthalpy= Math.round(h*100)/100; 
  density = Math.round(rho*100)/100; 
  hum_ratio = Math.round(w*10000)/10000; 
  pressure = Math.round(p);
  spec_volume = Math.round(v*1000)/1000; 
  p_w = Math.round(p_w);
  p_ws = Math.round(p_ws); 
  console.log({drybulb,wetbulb,humdity,dewpoint,altitude,enthalpy,density,hum_ratio,pressure,specific_volume,p_w,p_ws})
   return;
}


psychoCalc({
  "drybulb":75,
  "wetbulb":68,
  "altitude":0,
  "humdity":0.70
})