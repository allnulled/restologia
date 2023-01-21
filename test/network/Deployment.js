
require("fs").rmdirSync(__dirname + "/red_dos_prototipo", {recursive:true});
module.exports = function(ff) {const Castelog = {};
Castelog.metodos = {};
Castelog.metodos.una_red_de_servidores_http_rest_automaticos = ff;
const datos = {};
return Castelog.metodos.una_red_de_servidores_http_rest_automaticos(__dirname + "/red_dos_prototipo", async ($red_de_servidores_rest) => { try {await $red_de_servidores_rest.execute({
  comando: "addConfigurations", 
  ...{directorioBase:__dirname + "/red_dos", servidorDeChat:"http://127.0.0.1:9955"} });
await $red_de_servidores_rest.execute({
  comando: "addServer", 
  resetear: true, 
  directorio: "./identificacion",
  configuracion: {SERVER_ID:"Identificacion", SERVER_PROTOCOL:"http", SERVER_HOST:"127.0.0.1", SERVER_PORT:9900, ADMINISTRATOR_USER:"superadmin", ADMINISTRATOR_PASSWORD:"superadmin.123456"} });
await $red_de_servidores_rest.execute({
  comando: "addServer", 
  resetear: true, 
  directorio: "./productos",
  configuracion: {SERVER_ID:"Productos", SERVER_PROTOCOL:"http", SERVER_HOST:"127.0.0.1", SERVER_PORT:9901} });
await $red_de_servidores_rest.execute({
  comando: "addServer", 
  resetear: true, 
  directorio: "./carritos",
  configuracion: {SERVER_ID:"Carritos", SERVER_PROTOCOL:"http", SERVER_HOST:"127.0.0.1", SERVER_PORT:9902} });
await $red_de_servidores_rest.execute({
  comando: "addServer", 
  resetear: true, 
  directorio: "./proveedores",
  configuracion: {SERVER_ID:"Proveedores", SERVER_PROTOCOL:"http", SERVER_HOST:"127.0.0.1", SERVER_PORT:9903} });
await $red_de_servidores_rest.execute({
  comando: "addFileToServer",
  servidor: "Identificacion",
  tipo: "fichero",
  origen: __dirname + "/red_dos_data/roots/identificacion/README.md",
  destino: "./README.md"
});
await $red_de_servidores_rest.execute({
  comando: "addFileToServer",
  servidor: "Proveedores",
  tipo: "fichero",
  origen: __dirname + "/red_dos_data/roots/proveedores/README.md",
  destino: "./README.md"
});
await $red_de_servidores_rest.execute({
  comando: "addFileToServer",
  servidor: "Carritos",
  tipo: "fichero",
  origen: __dirname + "/red_dos_data/roots/carritos/README.md",
  destino: "./README.md"
});
await $red_de_servidores_rest.execute({
  comando: "addFileToServer",
  servidor: "Productos",
  tipo: "fichero",
  origen: __dirname + "/red_dos_data/roots/productos/README.md",
  destino: "./README.md"
});
await $red_de_servidores_rest.execute({
  comando: "startServers", 
  servidores: [["Identificacion"], ["Productos"], ["Carritos"], ["Proveedores"]] });
await $red_de_servidores_rest.execute({
  comando: "addFileToApplication",
  tipo: "fichero",
  origen: __dirname + "/red_dos_data/roots/statics/README.md",
  destino: "./README.md"
});
await $red_de_servidores_rest.execute({
  comando: "addProject", 
  proyecto: "Identificacion",
  servidor: ["Identificacion"],
  autentificador: null,
  configuraciones: {administrator_name:"auth_admin", administrator_password:"auth_admin", administrator_email:"auth_admin@email.com"} });
await $red_de_servidores_rest.execute({
  comando: "addProject", 
  proyecto: "Productos",
  servidor: ["Productos"],
  autentificador: ["Identificacion", "Identificacion"],
  configuraciones: {} });
await $red_de_servidores_rest.execute({
  comando: "addProject", 
  proyecto: "Carritos",
  servidor: ["Carritos"],
  autentificador: ["Identificacion", "Identificacion"],
  configuraciones: {} });
await $red_de_servidores_rest.execute({
  comando: "addProject", 
  proyecto: "Proveedores",
  servidor: ["Proveedores"],
  autentificador: ["Identificacion", "Identificacion"],
  configuraciones: {} });
await $red_de_servidores_rest.execute({
  comando: "addFileToProject",
  proyecto: ["Identificacion", "Identificacion"],
  tipo: "fichero",
  origen: __dirname + "/red_dos_data/roots/identificacion/identificacion/README.md",
  destino: "./README.md"
});
await $red_de_servidores_rest.execute({
  comando: "addFileToProject",
  proyecto: ["Proveedores", "Proveedores"],
  tipo: "fichero",
  origen: __dirname + "/red_dos_data/roots/proveedores/proveedores/README.md",
  destino: "./README.md"
});
await $red_de_servidores_rest.execute({
  comando: "addFileToProject",
  proyecto: ["Carritos", "Carritos"],
  tipo: "fichero",
  origen: __dirname + "/red_dos_data/roots/carritos/carritos/README.md",
  destino: "./README.md"
});
await $red_de_servidores_rest.execute({
  comando: "addFileToProject",
  proyecto: ["Productos", "Productos"],
  tipo: "fichero",
  origen: __dirname + "/red_dos_data/roots/productos/productos/README.md",
  destino: "./README.md"
});
await $red_de_servidores_rest.execute({
  comando: "addFileToProject",
  proyecto: ["Productos", "Productos"],
  tipo: "fichero",
  origen: __dirname + "/red_dos_data/roots/productos/productos/files/nodejs.png",
  destino: "./files/file-column.on-00000000000000.000.column-imagenes.uid-Xxxxxxxx00.as-nodejs.png"
});
await $red_de_servidores_rest.execute({
  comando: "addTable", 
  tabla: "correos",
  proyecto: ["Identificacion", "Identificacion"],
  configuraciones: {attributes:{}, columns:{nombre:{attributes:{}}, en_origen:{attributes:{}}, en_destino:{attributes:{}}, en_copia:{attributes:{}}, fichero_adjunto:{attributes:{isType:"file"}}}} });
await $red_de_servidores_rest.execute({
  comando: "addTable", 
  tabla: "proveedores",
  proyecto: ["Proveedores", "Proveedores"],
  configuraciones: {attributes:{}, columns:{nombre:{attributes:{isType:"text", isUnique:true}}, telefono:{attributes:{isType:"text"}}, cuentas_sociales:{attributes:{isType:"text", isMultipleRows:true}}}} });
await $red_de_servidores_rest.execute({
  comando: "addTable", 
  tabla: "pedidos",
  proyecto: ["Proveedores", "Proveedores"],
  configuraciones: {attributes:{}, columns:{titulo:{attributes:{isType:"text"}}, pedido_en_texto:{attributes:{isType:"text", hasMultipleRows:true}}, proveedor:{attributes:{isType:"object", isReferenceOf:"proveedores"}}, fecha_de_peticion:{attributes:{isType:"time"}}, fecha_de_resolucion:{attributes:{isType:"time", hasDefault:null}}}} });
await $red_de_servidores_rest.execute({
  comando: "addTable", 
  tabla: "proveedores",
  proyecto: ["Productos", "Productos"],
  configuraciones: {attributes:{isExternalizedBy:{host:"http://127.0.0.1:9903", project:"Proveedores", table:"proveedores"}}} });
await $red_de_servidores_rest.execute({
  comando: "addTable", 
  tabla: "imagenes",
  proyecto: ["Productos", "Productos"],
  configuraciones: {attributes:{}, columns:{titulo:{attributes:{isType:"text"}}, imagen:{attributes:{isType:"image"}}, detalles:{attributes:{isType:"text", hasMultipleRows:true}}}} });
await $red_de_servidores_rest.execute({
  comando: "addTable", 
  tabla: "productos",
  proyecto: ["Productos", "Productos"],
  configuraciones: {attributes:{}, columns:{nombre:{attributes:{isType:"text"}}, precio:{attributes:{isType:"number"}}, moneda_de_precio:{attributes:{isType:"text"}}, caracteristicas_tecnicas:{attributes:{isType:"text", hasMultipleRows:true}}, estado:{attributes:{isType:"option", hasOptions:[{label:"En almacén", value:"en almacen"}, {label:"Por encargo", value:"por encargo"}, {label:"Agotado", value:"agotado"}], hasDefault:"por encargo"}}, detalles_de_estado_en_almacen:{attributes:{isType:"text", hasMultipleRows:true, hasOptionConditions:[[["estado", "=", "en almacen"]]], hasDefault:""}}, detalles_de_estado_por_encargo:{attributes:{isType:"text", hasMultipleRows:true, hasOptionConditions:[[["estado", "=", "por encargo"]]], hasDefault:""}}, detalles_de_estado_agotado:{attributes:{isType:"text", hasMultipleRows:true, hasOptionConditions:[[["estado", "=", "agotado"]]], hasDefault:""}}, detalles:{attributes:{isType:"text", hasMultipleRows:true}}, imagenes:{attributes:{isType:"list", isReferenceOf:"imagenes"}}}} });
await $red_de_servidores_rest.execute({
  comando: "addTable", 
  tabla: "users",
  proyecto: ["Carritos", "Carritos"],
  configuraciones: {attributes:{isExternalizedBy:{host:"http://127.0.0.1:9900", project:"Identificacion", table:"users"}}} });
await $red_de_servidores_rest.execute({
  comando: "addTable", 
  tabla: "productos",
  proyecto: ["Carritos", "Carritos"],
  configuraciones: {attributes:{isExternalizedBy:{host:"http://127.0.0.1:9901", project:"Productos", table:"productos"}}} });
await $red_de_servidores_rest.execute({
  comando: "addTable", 
  tabla: "cupones_prototipo",
  proyecto: ["Carritos", "Carritos"],
  configuraciones: {attributes:{}, columns:{nombre:{attributes:{isType:"text", isUnique:true}}}} });
await $red_de_servidores_rest.execute({
  comando: "addTable", 
  tabla: "cupones",
  proyecto: ["Carritos", "Carritos"],
  configuraciones: {attributes:{}, columns:{prototipo:{attributes:{isType:"object", isReferenceOf:"cupones_prototipo"}}}} });
await $red_de_servidores_rest.execute({
  comando: "addTable", 
  tabla: "carritos",
  proyecto: ["Carritos", "Carritos"],
  configuraciones: {attributes:{}, columns:{propietario:{attributes:{isType:"object", isReferenceOf:"users", isUnique:true}}, cupones_asociados:{attributes:{isType:"list", isReferenceOf:"cupones"}}, productos_de_carrito:{attributes:{isType:"list", isReferenceOf:"productos_de_carrito"}}}} });
await $red_de_servidores_rest.execute({
  comando: "addTable", 
  tabla: "productos_de_carrito",
  proyecto: ["Carritos", "Carritos"],
  configuraciones: {attributes:{}, columns:{propietario:{attributes:{isType:"object", isReferenceOf:"users", isSelfUserId:true}}, producto:{attributes:{isType:"object", isReferenceOf:"productos"}}, unidades:{attributes:{isType:"number", hasMinimum:1, hasDefault:1}}, comentarios_del_comprador:{attributes:{isType:"text", hasMultipleRows:true}}, comentarios_del_vendedor:{attributes:{isType:"text", hasMultipleRows:true}}}} });
await $red_de_servidores_rest.execute({
  comando: "addProcess", 
  nombre: "restologia.test.org/Correos/enviar-correo",
  proyectos: [["Identificacion", "Identificacion"]],
  ruta: "restologia.test.org/Correos/enviar-correo.js",
  proceso: function() {return {correo:"enviado"};} });
await $red_de_servidores_rest.execute({
  comando: "addData", 
  proyecto: ["Identificacion", "Identificacion"],
  tabla: "users",
  datos: require(__dirname + "/red_dos_data/users.json") });
await $red_de_servidores_rest.execute({
  comando: "addData", 
  proyecto: ["Identificacion", "Identificacion"],
  tabla: "groups",
  datos: require(__dirname + "/red_dos_data/groups.json") });
await $red_de_servidores_rest.execute({
  comando: "addData", 
  proyecto: ["Identificacion", "Identificacion"],
  tabla: "privileges",
  datos: require(__dirname + "/red_dos_data/privileges.json") });
await $red_de_servidores_rest.execute({
  comando: "addData", 
  proyecto: ["Proveedores", "Proveedores"],
  tabla: "proveedores",
  datos: require(__dirname + "/red_dos_data/proveedores.json") });
await $red_de_servidores_rest.execute({
  comando: "addData", 
  proyecto: ["Productos", "Productos"],
  tabla: "productos",
  datos: require(__dirname + "/red_dos_data/productos.json") });
await $red_de_servidores_rest.execute({
  comando: "addData", 
  proyecto: ["Productos", "Productos"],
  tabla: "imagenes",
  datos: require(__dirname + "/red_dos_data/imagenes.json") });
await $red_de_servidores_rest.execute({
  comando: "addData", 
  proyecto: ["Carritos", "Carritos"],
  tabla: "carritos",
  datos: require(__dirname + "/red_dos_data/carritos.json") });
await $red_de_servidores_rest.execute({
  comando: "addData", 
  proyecto: ["Carritos", "Carritos"],
  tabla: "productos_de_carrito",
  datos: require(__dirname + "/red_dos_data/productos_de_carrito.json") });
await $red_de_servidores_rest.execute({
  comando: "addHook", 
  secuencia: "nativo.introduccion",
  hook: "\n            Imprimo \"Inicio de sección de hooks: nativo.introduccion\".\n            Imprimo \"Fin de sección de hooks: nativo.introduccion\".\n        " });
await $red_de_servidores_rest.execute({
  comando: "addHook", 
  secuencia: "nativo.componentes",
  hook: "\n            Creo Pagina01Page como un componente vue2 con nombre \"Pagina01Page\" con plantilla {\n                <div class=\"Pagina01Page\">\n                    <TitleOfPage>\n                        <Horizontally>\n                            <td class=\"width_auto\"><BackButton :levels=\"2\" /></td>\n                            <td class=\"width_100x100\">{{ $t(\"Pagina 01\") }}</td>\n                        </Horizontally>\n                    </TitleOfPage>\n                    <hr />\n                    <div class=\"padding_2\">\n                        Estás en la página 01.\n                    </div>\n                </div>\n            } con lógica {\n                Retorno {}.\n            }.\n            Creo Pagina02Page como un componente vue2 con nombre \"Pagina02Page\" con plantilla {\n                <div class=\"Pagina02Page\">\n                    <TitleOfPage>\n                        <Horizontally>\n                            <td class=\"width_auto\"><BackButton :levels=\"2\" /></td>\n                            <td class=\"width_100x100\">{{ $t(\"Pagina 02\") }}</td>\n                        </Horizontally>\n                    </TitleOfPage>\n                    <hr />\n                    <div class=\"padding_2\">\n                        Estás en la página 02.\n                    </div>\n                </div>\n            } con lógica {\n                Retorno {}.\n            }.\n            Creo Pagina03Page como un componente vue2 con nombre \"Pagina03Page\" con plantilla {\n                <div class=\"Pagina03Page\">\n                    <TitleOfPage>\n                        <Horizontally>\n                            <td class=\"width_auto\"><BackButton :levels=\"2\" /></td>\n                            <td class=\"width_100x100\">{{ $t(\"Pagina 03\") }}</td>\n                        </Horizontally>\n                    </TitleOfPage>\n                    <hr />\n                    <div class=\"padding_2\">\n                        Estás en la página 03.\n                    </div>\n                </div>\n            } con lógica {\n                Retorno {}.\n            }.\n            Creo Pagina04Page como un componente vue2 con nombre \"Pagina04Page\" con plantilla {\n                <div class=\"Pagina04Page\">\n                    <TitleOfPage>\n                        <Horizontally>\n                            <td class=\"width_auto\"><BackButton :levels=\"2\" /></td>\n                            <td class=\"width_100x100\">{{ $t(\"Pagina 04\") }}</td>\n                        </Horizontally>\n                    </TitleOfPage>\n                    <hr />\n                    <div class=\"padding_2\">\n                        Estás en la página 04.\n                    </div>\n                </div>\n            } con lógica {\n                Retorno {}.\n            }.\n            Creo Pagina05Page como un componente vue2 con nombre \"Pagina05Page\" con plantilla {\n                <div class=\"Pagina05Page\">\n                    <TitleOfPage>\n                        <Horizontally>\n                            <td class=\"width_auto\"><BackButton :levels=\"2\" /></td>\n                            <td class=\"width_100x100\">{{ $t(\"Pagina 05\") }}</td>\n                        </Horizontally>\n                    </TitleOfPage>\n                    <hr />\n                    <div class=\"padding_2\">\n                        Estás en la página 05.\n                    </div>\n                </div>\n            } con lógica {\n                Retorno {}.\n            }.\n        " });
await $red_de_servidores_rest.execute({
  comando: "addHook", 
  secuencia: "nativo.rutas",
  hook: "\n            Hago routes.push({\n                Propiedad name como \"Pagina01\".\n                Propiedad path como \"/page/01\".\n                Propiedad component como Pagina01Page.\n            }).\n            Hago routes.push({\n                Propiedad name como \"Pagina02\".\n                Propiedad path como \"/page/02\".\n                Propiedad component como Pagina02Page.\n            }).\n            Hago routes.push({\n                Propiedad name como \"Pagina03\".\n                Propiedad path como \"/page/03\".\n                Propiedad component como Pagina03Page.\n            }).\n            Hago routes.push({\n                Propiedad name como \"Pagina04\".\n                Propiedad path como \"/page/04\".\n                Propiedad component como Pagina04Page.\n            }).\n            Hago routes.push({\n                Propiedad name como \"Pagina05\".\n                Propiedad path como \"/page/05\".\n                Propiedad component como Pagina05Page.\n            }).\n        " });
await $red_de_servidores_rest.execute({
  comando: "addHook", 
  secuencia: "nativo.dependencias_globales",
  hook: "\n            Imprimo \"Inicio de sección de hooks: nativo.dependencias_globales\".\n            Imprimo \"Fin de sección de hooks: nativo.dependencias_globales\".\n        " });
await $red_de_servidores_rest.execute({
  comando: "addHook", 
  secuencia: "nativo.botones_de_home_page",
  hook: "<div>\n                <ul class=\"BigMenuSquaresList\">\n                    <li v-on:click=\"() => $router.history.push('/page/01')\"><span class=\"link_text\">Página 01</span></li>\n                    <li v-on:click=\"() => $router.history.push('/page/02')\"><span class=\"link_text\">Página 02</span></li>\n                    <li v-on:click=\"() => $router.history.push('/page/03')\"><span class=\"link_text\">Página 03</span></li>\n                    <li v-on:click=\"() => $router.history.push('/page/04')\"><span class=\"link_text\">Página 04</span></li>\n                    <li v-on:click=\"() => $router.history.push('/page/05')\"><span class=\"link_text\">Página 05</span></li>\n                </ul>\n            </div>" });
await $red_de_servidores_rest.execute({
  comando: "recompileStaticApplication" });} catch(error) {
console.log(error);
throw error;} });};
/////////////////////////
// Ignorado por Castelog:
// console.log(Object.assign({}, {a:8}, {b:9}));
