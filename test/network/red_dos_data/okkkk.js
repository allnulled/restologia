
X: {
Castelog.variables.globales["entorno"] = "testing";
const incr = function(parametro) {return parametro + 1;};
if(Castelog.metodos.estoy_en('estoy en entorno', "testing")) {
(async () => {
Castelog.metodos.un_testeo(4 * 1000, ["Test inicio"], null);
(await Castelog.metodos.un_test("Test inicio", async () => {
if(!(incr(50) === 51)) throw new Error("Función incr no suma 1 (1)")
if(!(incr(100) === 101)) throw new Error("Función incr no suma 1 (2)")
if(!(incr("ok") === "ok1")) throw new Error("Función incr no suma 1 (3)")}));})();
}}

const aplicacion = Castelog.metodos.una_aplicacion_sintactica_universal({ejecuta:{aplicacion:Castelog.metodos.un_punto_sintactico_universal({api:"module.exports = (async () => {\nconsole.log(800);\nreturn 900;})()", bin:"api", npm:"api", http:false, ws:false, web:false})}, bildea:{ficheros:{calo:Castelog.metodos.un_punto_sintactico_universal({api:"module.exports = (async () => {\nconsole.log(1000);\nreturn 1100;})()", bin:"api", npm:"api", http:"api", ws:"api", web:{name:"bildeaFicherosCaloPage", component:""}})}, todo:Castelog.metodos.un_punto_sintactico_universal({api:function() {return 400;}, bin:true, npm:true, http:true, ws:true, web:true})}}, {help:function() {}, http:{port:9001}, ws:{port:9011}, web:{port:9021}});
aplicacion.buildea.ficheros.calo.en.node();
aplicacion.buildea.ficheros.calo.en.cmd();
aplicacion.buildea.ficheros.calo.en.npm();
aplicacion.buildea.ficheros.calo.en.http();
aplicacion.buildea.ficheros.calo.en.ws();
aplicacion.buildea.ficheros.calo.en.web();