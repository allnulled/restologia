
const ALPHABET = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789".split("");
window.$utilidades = {};
window.$utilidades.getRandomId = function(len = 1000, alphabet = ALPHABET) {let id = "";
for(let index = 0; index < len; index++) {id = id + alphabet[Math.floor(Math.random() * alphabet.length)];}
return id;};
window.$utilidades.capitalizeString = function(texto) {return texto.substr(0, 1).toUpperCase() + texto.substr(1);};
window.$utilidades.padLeft = function(text, len, ch = "0") {let out = "" + text;
while(out.length < len) {
out = ch + out;}
return out;};
window.$utilidades.fromDateToString = function(date, untilSeconds = false) {if(untilSeconds) {
return "" + window.$utilidades.padLeft(date.getFullYear(), 4, "0") + "/" + window.$utilidades.padLeft(date.getMonth() + 1, 2, "0") + "/" + window.$utilidades.padLeft(date.getDate(), 2, "0") + " " + window.$utilidades.padLeft(date.getHours(), 2, "0") + ":" + window.$utilidades.padLeft(date.getMinutes(), 2, "0") + ":" + window.$utilidades.padLeft(date.getSeconds(), 2, "0") + "." + window.$utilidades.padLeft(date.getMilliseconds(), 3, "0");
}
else {
return "" + window.$utilidades.padLeft(date.getFullYear(), 4, "0") + "/" + window.$utilidades.padLeft(date.getMonth() + 1, 2, "0") + "/" + window.$utilidades.padLeft(date.getDate(), 2, "0");}};
window.$utilidades.fromStringToDate = function(dateStr, untilSeconds = false) {if(dateStr instanceof Date) {
return dateStr;
}
const dateStrParts = dateStr.split(new RegExp("[\\/\\:\\ \\.]", "g"));
const date = new Date();
date.setFullYear(dateStrParts[0]);
date.setMonth(dateStrParts[1] - 1);
date.setDate(dateStrParts[2]);
if(untilSeconds) {
date.setHours(dateStrParts[3]);
date.setMinutes(dateStrParts[4]);
date.setSeconds(dateStrParts[5]);
date.setMilliseconds(dateStrParts[6]);
}
else {
date.setHours(0);
date.setMinutes(0);
date.setSeconds(0);
date.setMilliseconds(0);}
return date;};
window.$utilidades.adaptWeekDay = function(day) {if(day === 0) {
return 7;
}
if(day === 1) {
return 1;
}
if(day === 2) {
return 2;
}
if(day === 3) {
return 3;
}
if(day === 4) {
return 4;
}
if(day === 5) {
return 5;
}
if(day === 6) {
return 6;
}};
window.$utilidades.fromWeekdayToText = function(day) {if(day === 0) {
return "Domingo";
}
if(day === 1) {
return "Lunes";
}
if(day === 2) {
return "Martes";
}
if(day === 3) {
return "Miércoles";
}
if(day === 4) {
return "Jueves";
}
if(day === 5) {
return "Viernes";
}
if(day === 6) {
return "Sábado";
}};
window.$utilidades.fromMonthToText = function(month) {if(month === 0) {
return "Enero";
}
if(month === 1) {
return "Febrero";
}
if(month === 2) {
return "Marzo";
}
if(month === 3) {
return "Abril";
}
if(month === 4) {
return "Mayo";
}
if(month === 5) {
return "Junio";
}
if(month === 6) {
return "Julio";
}
if(month === 7) {
return "Agosto";
}
if(month === 8) {
return "Septiembre";
}
if(month === 9) {
return "Octubre";
}
if(month === 10) {
return "Noviembre";
}
if(month === 11) {
return "Diciembre";
}};