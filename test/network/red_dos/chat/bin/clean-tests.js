const mkdirSync = function(...args) {
    try {
        require("fs").mkdirSync(...args);
    } catch(error) {
        
    }
};

const rmdirSync = function (...args) {
    try {
        require("fs").rmdirSync(...args);
    } catch (error) {

    }
};

const unlinkSync = function (...args) {
    try {
        require("fs").unlinkSync(...args);
    } catch (error) {

    }
};

rmdirSync(__dirname + "/../test/network/red_uno", { recursive: true });
mkdirSync(__dirname + "/../test/network/red_uno");
rmdirSync(__dirname + "/../test/network/red_dos", { recursive: true });
mkdirSync(__dirname + "/../test/network/red_dos");
rmdirSync(__dirname + "/../test/network/red_dos_prototipo", { recursive: true });
mkdirSync(__dirname + "/../test/network/red_dos_prototipo");
unlinkSync(__dirname + "/../src/app/app.js");
unlinkSync(__dirname + "/../src/app/main.js");
unlinkSync(__dirname + "/../src/app/js/almacenamiento.js");
unlinkSync(__dirname + "/../src/app/js/api-nativa.js");
unlinkSync(__dirname + "/../src/app/js/cliente.js");
unlinkSync(__dirname + "/../src/app/js/notificaciones.js");
unlinkSync(__dirname + "/../src/app/js/traducciones.js");
unlinkSync(__dirname + "/../src/app/js/utilidades.js");
unlinkSync(__dirname + "/../src/app/restologia-app.1.0.0.html");
rmdirSync(__dirname + "/../src/data/projects/Empresa_z", { recursive: true });