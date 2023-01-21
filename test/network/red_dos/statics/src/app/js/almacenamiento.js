
window.$almacenamiento = {};
window.$almacenamiento.ID_ALMACENAMIENTO = "Restologia";
window.$almacenamiento.persistir = function(clave, valor) {const datosJSON = localStorage[window.$almacenamiento.ID_ALMACENAMIENTO];
const datos = (() => {
try {return JSON.parse(datosJSON);} catch(error) {
return {};}})();
datos[clave] = valor;
localStorage[window.$almacenamiento.ID_ALMACENAMIENTO] = JSON.stringify(datos, null, 2);
return datos;};
window.$almacenamiento.obtener = function(clave, porDefecto = undefined) {const datosJSON = localStorage[window.$almacenamiento.ID_ALMACENAMIENTO];
const datos = (() => {
try {return JSON.parse(datosJSON);} catch(error) {
return {};}})();
return (clave in datos ? datos[clave] : porDefecto);};