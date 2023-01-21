
module.exports = Castelog.metodos.una_superquery(Vue.prototype.$rest.schema, Vue.prototype.$rest.client, () => {const usuarios = (await Castelog.metodos.una_query_de({ operation: "select", table: "users", where: ["name", "=", "auth_admin"], sort: null, paginate: null }, undefined));
const carritos = (await Castelog.metodos.una_query_de({ operation: "select", table: "carritos", where: ["propietario", "in", Castelog.metodos.siendo(usuarios, [false, "aplanado", {por:"id"}],
[true, "aplanado", {por:"id"}],
...[[false, "expandido", {modo:"ids", ruta:"*", datos:productos_de_carrito}], [false, "expandido", {modo:"ids", ruta:"*/carrito", datos:carritos}]])], sort: null, paginate: null }, undefined));
const cupones = (await Castelog.metodos.una_query_de({ operation: "select", table: "cupones", where: ["id", "in", Castelog.metodos.siendo(carritos, [false, "aplanado", {por:"cupones_asociados", en:0}])], sort: null, paginate: null }, undefined));
const cupones_prototipo = (await Castelog.metodos.una_query_de({ operation: "select", table: "cupones_prototipo", where: ["id", "in", Castelog.metodos.siendo(cupones, [false, "aplanado", {por:"prototipo"}])], sort: null, paginate: null }, undefined));
const productos_de_carrito = (await Castelog.metodos.una_query_de({ operation: "select", table: "productos_de_carrito", where: ["carrito", "in", Castelog.metodos.siendo(carritos, [false, "aplanado", {por:"id"}])], sort: null, paginate: null }, undefined));
const productos = (await Castelog.metodos.una_query_de({ operation: "select", table: "productos", where: ["carrito", "in", Castelog.metodos.siendo(productos_de_carrito, [false, "aplanado", {por:"productos"}])], sort: null, paginate: null }, undefined));
const imagenes = (await Castelog.metodos.una_query_de({ operation: "select", table: "imagenes", where: ["id", "in", Castelog.metodos.siendo(productos, [false, "aplanado", {por:"imagenes"}])], sort: null, paginate: null }, undefined));
Castelog.metodos.siendo(x, [true, "binario", [0, 1], [0, 1], [0, 1], [0, 1]],
[true, 'binario', [0, 1, 1], [1, 0, 0]],
...[[true, 'binario', [0, 1, 0, 0], [1, 1, 0, 0]]]);
return Castelog.metodos.siendo(productos_de_carrito, [false, "expandido", [{modo:"ids", ruta:"*", datos:productos_de_carrito}, {modo:"ids", ruta:"*/carrito", datos:carritos}, {modo:"ids", ruta:"*/carrito/cupones_asociados/*", datos:cupones}, {modo:"ids", ruta:"*/carrito/cupones_asociados/*/prototipo", datos:cupones_prototipo}, {modo:"ids", ruta:"*/productos/*", datos:productos_de_carritos}, {modo:"ids", ruta:"*/productos/*/producto", datos:productos}, {modo:"ids", ruta:"*/productos/*/producto/imagenes/*", datos:imagenes}]]);}, null);
const subitems_ids = Castelog.metodos.siendo(base, [false, "forzado", {a:["app", "author"], ser:"allnulled"}],
[false, "accedido", {por:["datos", "items"], defecto:[]}],
[false, "mapeado", {por:function(item) {return item.subitems;}}],
[false, "aplanado", {niveles:1}],
[false, "deduplicado", null],
[false, "comprobado", {para:["app", "author"], que:typeof item === 'string'}]);
if(Castelog.metodos.estoy_en('estoy en entorno', "testing")) {
Castelog.metodos.un_test("Test de superquery", async () => {
try {if(!(5 === 5)) throw new Error("Nunca debe ocurrir esto")} catch(error) {
throw error;}});
Castelog.metodos.un_test("Test de query", async () => {
try {if(!(5 === 5)) throw new Error("Nunca debe ocurrir esto")} catch(error) {
throw error;}});
Castelog.metodos.un_test("Test unitario", async () => {
try {if(!(5 === 5)) throw new Error("Nunca debe ocurrir esto")} catch(error) {
throw error;}});
Castelog.metodos.un_testeo(5 * 1000, ["Test de superquery", "Test de query", "Test unitario"], (error) => {
throw error;});
}