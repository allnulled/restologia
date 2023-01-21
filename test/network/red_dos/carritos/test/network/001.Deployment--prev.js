const { una_red_de_servidores_http_rest_automaticos } = require(__dirname + "/../../api.js");

module.exports = async commonData => {
    try {
        const { requester, utils, tester } = commonData;
        tester.startTest("Deployment");

        await require(__dirname + "/Deployment.js")(una_red_de_servidores_http_rest_automaticos);
        const red = await una_red_de_servidores_http_rest_automaticos(async ($red_de_servidores_rest) => {
            try {
                await $red_de_servidores_rest.execute({
                    comando: "addConfigurations",
                    directorioBase: __dirname + "/red_uno",
                });
                await $red_de_servidores_rest.execute({
                    comando: "addServer",
                    directorio: "./identificacion",
                    resetear: true,
                    configuracion: {
                        SERVER_ID: "Identificacion",
                        SERVER_PORT: 9950,
                        ADMINISTRATOR_USER: "superadmin",
                        ADMINISTRATOR_PASSWORD: "superadmin.123456"
                    }
                });
                await $red_de_servidores_rest.execute({
                    comando: "addServer",
                    directorio: "./productos",
                    resetear: true,
                    configuracion: {
                        SERVER_ID: "Productos",
                        SERVER_PORT: 9951
                    }
                });
                await $red_de_servidores_rest.execute({
                    comando: "addServer",
                    directorio: "./carritos",
                    resetear: true,
                    configuracion: {
                        SERVER_ID: "Carritos",
                        SERVER_PORT: 9952
                    }
                });
                await $red_de_servidores_rest.execute({
                    comando: "startServers",
                    servidores: ["Identificacion", "Productos", "Carritos"]
                });
                await $red_de_servidores_rest.execute({
                    comando: "addProject",
                    proyecto: "Identificacion",
                    servidor: ["Identificacion"],
                    autentificador: null,
                    configuraciones: {
                        administrator_name: "auth_admin",
                        administrator_password: "auth_admin",
                        administrator_email: "auth_admin@email.com"
                    }
                });
                await $red_de_servidores_rest.execute({
                    comando: "addProject",
                    proyecto: "Productos",
                    servidor: ["Productos"],
                    autentificador: ["Identificacion", "Identificacion"],
                    configuraciones: {
                        administrator_name: "productos_admin",
                        administrator_password: "productos_admin",
                        administrator_email: "productos_admin@email.com"
                    }
                });
                await $red_de_servidores_rest.execute({
                    comando: "addProject",
                    proyecto: "Carritos",
                    servidor: ["Carritos"],
                    autentificador: ["Identificacion", "Identificacion"],
                    configuraciones: {
                        administrator_name: "carritos_admin",
                        administrator_password: "carritos_admin",
                        administrator_email: "carritos_admin@email.com"
                    }
                });
                await $red_de_servidores_rest.execute({
                    comando: "addTable",
                    proyecto: ["Carritos", "Carritos"],
                    tabla: "users",
                    configuraciones: {
                        attributes: {
                            isExternalizedBy: {
                                host: "http://127.0.0.1:9950",
                                project: "Identificacion",
                                table: "users",
                            }
                        },
                    }
                });
                await $red_de_servidores_rest.execute({
                    comando: "addTable",
                    proyecto: ["Carritos", "Carritos"],
                    tabla: "carritos",
                    configuraciones: {
                        attributes: {},
                        columns: {
                            propietario: {
                                isUnique: false,
                                isType: "object",
                                isSubtype: null,
                                isEncrypted: false,
                                isReferenceOf: "users",
                                isNullable: false,
                                hasDefault: [],
                                hasDescription: "Representa el propietario de cada carrito"
                            }
                        }
                    }
                });
                await $red_de_servidores_rest.execute({
                    comando: "addTable",
                    proyecto: ["Carritos", "Carritos"],
                    tabla: "cupones_prototipo",
                    configuraciones: {
                        attributes: {},
                        columns: {
                            nombre: {
                                isUnique: false,
                                isType: "string",
                                isSubtype: null,
                                isEncrypted: false,
                                isReferenceOf: null,
                                isNullable: true,
                                hasDefault: null,
                                hasMinimum: 0,
                                hasMaximum: 200,
                                hasPattern: false,
                                hasPatternErrorMessage: false,
                                hasDescription: "Representa el nombre que identifica a un prototipo de cupón"
                            },
                            descripcion: {
                                isUnique: false,
                                isType: "string",
                                isSubtype: null,
                                isEncrypted: false,
                                isReferenceOf: null,
                                isNullable: true,
                                hasDefault: null,
                                hasMinimum: 0,
                                hasMaximum: 200,
                                hasPattern: false,
                                hasPatternErrorMessage: false,
                                hasDescription: "Representa la descripción de un tipo de cupón"
                            }
                        }
                    }
                });
                await $red_de_servidores_rest.execute({
                    comando: "addTable",
                    proyecto: ["Carritos", "Carritos"],
                    tabla: "cupones",
                    configuraciones: {
                        attributes: {},
                        columns: {
                            cupon_prototipo: {
                                isUnique: false,
                                isType: "object",
                                isSubtype: null,
                                isEncrypted: false,
                                isReferenceOf: "cupones_prototipo",
                                isNullable: false,
                                hasDefault: [],
                                hasDescription: "Representa el prototipo de cupón de un cupón"
                            },
                            detalles: {
                                isUnique: false,
                                isType: "string",
                                isSubtype: null,
                                isEncrypted: false,
                                isReferenceOf: null,
                                isNullable: true,
                                hasDefault: null,
                                hasMinimum: 0,
                                hasMaximum: 200,
                                hasPattern: false,
                                hasPatternErrorMessage: false,
                                hasDescription: "Representa detalles asociados a un cupón"
                            }
                        }
                    }
                });
                await $red_de_servidores_rest.execute({
                    comando: "addTable",
                    proyecto: ["Carritos", "Carritos"],
                    tabla: "productos_de_carrito",
                    configuraciones: {
                        attributes: {},
                        columns: {
                            carrito: {
                                isUnique: false,
                                isType: "object",
                                isSubtype: null,
                                isEncrypted: false,
                                isReferenceOf: "carritos",
                                isNullable: false,
                                hasDefault: [],
                                hasDescription: "Representa los productos de un carrito"
                            },
                            cupones: {
                                isUnique: false,
                                isType: "list",
                                isSubtype: null,
                                isEncrypted: false,
                                isReferenceOf: "cupones",
                                isNullable: true,
                                hasDefault: [],
                                hasDescription: "Representa cupones asociados a un carrito"
                            },
                            detalles: {
                                isUnique: false,
                                isType: "string",
                                isSubtype: null,
                                isEncrypted: false,
                                isReferenceOf: null,
                                isNullable: true,
                                hasDefault: null,
                                hasMinimum: 0,
                                hasMaximum: 1000,
                                hasPattern: false,
                                hasPatternErrorMessage: false,
                                hasDescription: "Representa detalles de un carrito"
                            }
                        }
                    }
                });
                await $red_de_servidores_rest.execute({
                    comando: "addTable",
                    proyecto: ["Identificacion", "Identificacion"],
                    tabla: "correos",
                    configuraciones: {
                        attributes: {},
                        columns: {
                            nombre: {
                                attributes: {}
                            },
                            en_origen: {
                                attributes: {}
                            },
                            en_destino: {
                                attributes: {}
                            },
                            en_copia: {
                                attributes: {}
                            }
                        }
                    }
                });
                await $red_de_servidores_rest.execute({
                    comando: "addProcess",
                    proyectos: [["Carritos", "Carritos"]],
                    nombre: "restologia.test.org/Carritos/add-product-to-chart",
                    ruta: "restologia.test.org/Carritos/add-product-to-chart.js",
                    proceso: async function(publicParameters, privateParameters, configurations) {
                        try {
                            return { message: "Successfully added product to chart!" };
                        } catch(error) {
                            return { error: error.message };
                        }
                    }
                });
                tester.passTest("Deployment");
            } catch (error) {
                tester.failTest("Deployment");
                throw error;
            }
        });

        return red;

    } catch (error) {
        console.log(error);
        throw error;
    }
};