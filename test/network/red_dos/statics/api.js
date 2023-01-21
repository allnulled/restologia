const url = require("url");
const fs = require("fs");
const path = require("path");
const generatorDeProyecto = require(__dirname + "/generator.js");

const RestServersNetwork = class {

    static async buildNetwork(deployer) {
        try {
            const network = new this();
            const deployment = await deployer(network);
            const schema = await network.buildSchema.call(network);
            return { network, deployment, schema };
        } catch (error) {
            console.log("Error on building network from deployer:", error);
            throw error;

        }
    }

    constructor() {
        this.INTERCEPTOR_TOKEN = "\n                ////>>>> INSERT_PROCESSES_LAST_CASE_CLAUSE_HERE <<<<////";
        this.configurations = { directorioBase: "." };
        this.servers = {};
        this.application = {};
        this.projects = {};
        this.administrators = {};
        this.executions = [];
        this.requester = undefined;
        this.hooks = {};
        this.utils = undefined;
    }

    async execute(operation) {
        try {
            operation.started_at = new Date();
            this.executions.push(operation);
            if (operation.comando === "addConfigurations") {
                await this.addConfigurations(operation);
            } else if (operation.comando === "addServer") {
                await this.addServer(operation);
            } else if (operation.comando === "startServers") {
                await this.startServers(operation);
            } else if (operation.comando === "addProject") {
                await this.addProject(operation);
            } else if (operation.comando === "addTable") {
                await this.addTable(operation);
            } else if (operation.comando === "addProcess") {
                await this.addProcess(operation);
            } else if (operation.comando === "addData") {
                await this.addData(operation);
            } else if (operation.comando === "addFileToServer") {
                await this.addFileToServer(operation);
            } else if (operation.comando === "addFileToProject") {
                await this.addFileToProject(operation);
            } else if (operation.comando === "addFileToApplication") {
                await this.addFileToApplication(operation);
            } else if (operation.comando === "addHook") {
                await this.addHook(operation);
            } else if (operation.comando === "recompileStaticApplication") {
                await this.recompileStaticApplication(operation);
            } else {
                throw new Error("Required parameter «comando» to be an identifiable command, but «" + operation.comando + "» is not identified");
            }
            operation.finished_at = new Date();
        } catch(error) {
            console.error(error);
            throw error;
        }
    }

    async addHook(operation) {
        try {
            const name = operation.secuencia;
            const hook = operation.hook;
            if(!(name in this.hooks)) {
                this.hooks[name] = [];
            }
            this.hooks[name].push(hook);
        } catch(error) {
            throw error;
        }
    }

    async recompileStaticApplication(operation) {
        try {
            const appMainFile = path.resolve(this.configurations.directorioBase, "./statics/src/app/app.calo");
            let output = await fs.promises.readFile(appMainFile, "utf8");
            output = output.replace(/(<\!\-\-)?([\n\t ]*)@SECCIÓN DE HOOK: ([^\n]*)/gi, (match, group1, group2, group3) => {
                const isInHtml = match.startsWith("<!--");
                const hookId = group3.trim().replace(/\-\-\>$/g, "").trim();
                let hookContents = "";
                let sectionTitle = "@SECCIÓN DE IMPLEMENTACIÓN DE HOOKS DE: " + hookId + "";
                if(isInHtml) {
                    sectionTitle = "<!-- " + sectionTitle.trim() + " -->";
                }
                if(hookId in this.hooks) {
                    const hookItems = this.hooks[hookId];
                    for(let indexHook = 0; indexHook < hookItems.length; indexHook++) {
                        const hookItem = hookItems[indexHook];
                        const hookOrder = indexHook + 1;
                        let beginComment = "\n\n@SECCIÓN DE IMPLEMENTACIÓN DE HOOK: " + hookId + " [nº " + hookOrder + "] [Inicio de sección]\n\n";
                        if(isInHtml) {
                            beginComment = "\n\n<!-- " + beginComment.trim() + " -->\n\n";
                        }
                        let finalComment = "\n\n@SECCIÓN DE IMPLEMENTACIÓN DE HOOK: " + hookId + " [nº " + hookOrder + "] [Final de sección]\n\n"
                        if (isInHtml) {
                            finalComment = "\n\n<!-- " + finalComment.trim() + " -->";
                        }
                        hookContents += sectionTitle;
                        hookContents += beginComment;
                        hookContents += (typeof hookItem === "function") ? hookItem.toString() : hookItem;
                        hookContents += finalComment;
                    }
                }
                return match + "\n\n" + hookContents;
            });
            await fs.promises.writeFile(appMainFile, output, "utf8");
        } catch(error) {
            throw error;
        }
    }

    async addConfigurations(parametros) {
        try {
            delete parametros.comando;
            const claves = Object.keys(parametros);
            for(let index = 0; index < claves.length; index++) {
                const clave = claves[index];
                const valor = parametros[clave];
                this.configurations[clave] = valor;
            }
        } catch (error) {
            throw error;
        }
    }

    async addServer(parametros) {
        try {
            if (typeof parametros.directorio !== "string") {
                throw new Error("Required parameter «directorio» to be a string in order to «addServer»");
            }
            if (typeof parametros.configuracion !== "object") {
                throw new Error("Required parameter «configuracion» to be an object in order to «addServer»");
            }
            if (typeof parametros.configuracion.SERVER_ID !== "string") {
                throw new Error("Required parameter «configuracion.SERVER_ID» to be an object in order to «addServer»");
            }
            if (typeof parametros.configuracion.SERVER_PORT !== "number") {
                throw new Error("Required parameter «configuracion.SERVER_PORT» to be a number in order to «addServer»");
            }
            if (parametros.configuracion.SERVER_ID in this.servers) {
                throw new Error("Required parameter «configuracion.SERVER_ID» to not be an already added server in order to «addServer»");
            }
            const directorio = path.resolve(this.configurations.directorioBase, parametros.directorio);
            this.servers[parametros.configuracion.SERVER_ID] = {
                configuracion: parametros.configuracion,
                directorio: directorio
            };
            if(parametros.resetear === true) {
                fs.rmdirSync(directorio, { recursive: true });
            }
            await generatorDeProyecto(directorio);
            const settingsJsonPath = path.resolve(directorio, "./src/security/settings.json");
            const settingsJson = JSON.parse(fs.readFileSync(settingsJsonPath).toString());
            const settingsJson2 = Object.assign({}, settingsJson, parametros.configuracion);
            fs.writeFileSync(settingsJsonPath, JSON.stringify(settingsJson2, null, 2), "utf8");
            if(typeof this.requester === "undefined") {
                this.requester = require(path.resolve(directorio, "./src/classes/server/Requester.js"))
            }
            if(typeof this.utils === "undefined") {
                this.utils = require(path.resolve(directorio, "./src/classes/Utils.js"));
            }
        } catch(error) {
            throw error;
        }
    }

    async startServers(parametros) {
        try {
            if(!Array.isArray(parametros.servidores)) {
                throw new Error("Required parameter «servidores» to be an array in order to «startServers»");
            }
            for(let index = 0; index < parametros.servidores.length; index++) {
                const serverId = parametros.servidores[index];
                if(!(serverId in this.servers)) {
                    throw new Error("Required parameter «servidores» on index «" + index + "» to be a SERVER_ID in order to «startServers»");
                }
                const serverData = this.servers[serverId];
                const serverPath = serverData.directorio;
                const startPath = path.resolve(serverPath, "./src/start.js");
                const starter = require(startPath);
                if(starter instanceof Error) {
                    throw starter;
                }
                const result = await starter;
                this.servers[serverId].environment = result;
            }
            await this.execute({
                comando: "addServer",
                directorio: "./statics",
                interfazDeUsuario: true,
                resetear: true,
                configuracion: {
                    SERVER_ID: "Static_resources",
                    SERVER_PORT: 9090,
                    APPLICATION_PORT: 9090
                }
            });
            const appPath = path.resolve(this.configurations.directorioBase, "./statics/src/app.js");
            // Runs static app:
            await require(appPath);
            this.application.path = path.resolve(this.configurations.directorioBase, "./statics");
            if (typeof this.configurations.servidorDeChat === "string") {
                const urled = url.parse(this.configurations.servidorDeChat);
                const port = parseInt(urled.port);
                await this.execute({
                    comando: "addServer",
                    directorio: "./chat",
                    chatDeUsuario: true,
                    reseterar: true,
                    configuracion: {
                        SERVER_ID: "Chat",
                        SERVER_HOST: urled.host,
                        SERVER_PROTOCOL: urled.protocol,
                        SERVER_PORT: port,
                        CHAT_PORT: port
                    }
                })
                const chatPath = path.resolve(this.configurations.directorioBase, "./chat/src/chat.js");
                // Runs chat app:
                await require(chatPath);
            }
        } catch(error) {
            throw error;
        }
    }

    async addProject(parametros) {
        try {
            if(typeof parametros.proyecto !== "string") {
                throw new Error("Required parameter «proyecto» to be a string in order to «addProject»");
            }
            if(!Array.isArray(parametros.servidor)) {
                throw new Error("Required parameter «servidor» to be an array in order to «addProject»");
            }
            if(parametros.servidor.length !== 1) {
                throw new Error("Required parameter «servidor» to be an array of 1 item in order to «addProject»");
            }
            if(typeof parametros.servidor[0] !== "string") {
                throw new Error("Required parameter «servidor» on index «0» to be a string in order to «addProject»");
            }
            if(!(parametros.servidor[0] in this.servers)) {
                throw new Error("Required parameter «servidor» on index «0» to be a SERVER_ID in order to «addProject»");
            }
            if(!("autentificador" in parametros)) {
                throw new Error("Required parameter «autentificador» to be defined in order to «addProject»");
            }
            if(parametros.autentificador === null) {
                if(typeof parametros.configuraciones !== "object") {
                    throw new Error("Required parameter «configuraciones» to be an object when «autentificador» is null in order to «addProject»");
                }
                if(typeof parametros.configuraciones.administrator_name !== "string") {
                    throw new Error("Required parameter «configuraciones.administrator_name» to be a string when «autentificador» is null in order to «addProject»");
                }
                if(typeof parametros.configuraciones.administrator_password !== "string") {
                    throw new Error("Required parameter «configuraciones.administrator_password» to be a string when «autentificador» is null in order to «addProject»");
                }
                if(typeof parametros.configuraciones.administrator_email !== "string") {
                    throw new Error("Required parameter «configuraciones.administrator_email» to be a string when «autentificador» is null in order to «addProject»");
                }
            } else {
                if(!Array.isArray(parametros.autentificador)) {
                    throw new Error("Required parameter «autentificador» to be an array in order to «addProject»");
                }
                if(parametros.autentificador.length !== 2) {
                    throw new Error("Required parameter «autentificador» to be an array with 2 items in order to «addProject»");
                }
                const autentificadorId = parametros.autentificador.join("@");
                if(!(autentificadorId in this.projects)) {
                    throw new Error("Required parameter «autentificador» to be a valid project identifier when not null in order to «addProject»");
                }
            }
            const projectId = parametros.servidor.concat([ parametros.proyecto ]).join("@");
            if(projectId in this.projects) {
                throw new Error("Required parameter «servidor» and «proyecto» to be a unique project identifier in order to «addProject»");
            }
            this.projects[projectId] = parametros;
            const serverData = this.servers[parametros.servidor[0]];
            const serverDirectory = serverData.directorio;
            const serverSettingsPath = path.resolve(serverDirectory, "./src/security/settings.json");
            const serverSettings = JSON.parse(fs.readFileSync(serverSettingsPath).toString());
            const adminUser = serverSettings.ADMINISTRATOR_USER;
            const adminPassword = serverSettings.ADMINISTRATOR_PASSWORD;
            const publicParams = {
                operation: "create-project"
            };
            const privateParams = {
                user: adminUser,
                password: adminPassword,
                project: parametros.proyecto,
                administrator_name: parametros.configuraciones.administrator_name,
                administrator_password: parametros.configuraciones.administrator_password,
                administrator_email: parametros.configuraciones.administrator_email,
                schema_attributes: {
                    isAuthenticatedBy: this.getAuthenticationSchemaAttributesFromProject(parametros.autentificador)
                }
            };
            const response = await this.requester.request("POST", `${serverSettings.SERVER_PROTOCOL}://${serverSettings.SERVER_HOST}:${serverSettings.SERVER_PORT}`, publicParams, privateParams, {}, true, false, "Creating project: " + projectId)
            if(response.response.status === "success") {
                return true;
            } else {
                throw response.response.data;
            }
        } catch(error) {
            throw error;
        }
    }

    async addTable(parametros) {
        try {
            if (typeof parametros.tabla !== "string") {
                throw new Error("Required parameter «tabla» to be a string in order to «addTable»");
            }
            if (!Array.isArray(parametros.proyecto)) {
                throw new Error("Required parameter «proyecto» to be an array in order to «addTable»");
            }
            if (parametros.proyecto.length !== 2) {
                throw new Error("Required parameter «proyecto» to be an array with 2 items in order to «addTable»");
            }
            const proyectoId = parametros.proyecto.join("@");
            if (!(proyectoId in this.projects)) {
                throw new Error("Required parameter «proyecto» to be a valid project identifier in order to «addTable»");
            }
            const adminToken = await this.getAuthAdminTokenFromProject(parametros.proyecto);
            const serverURL = await this.getServerURL(parametros.proyecto[0]);
            await this.requester.request("POST", serverURL, {
                project: parametros.proyecto[1],
                operation: "add-table"
            }, {
                table: parametros.tabla,
                attributes: JSON.stringify(parametros.configuraciones.attributes || {}),
                properties: JSON.stringify(parametros.configuraciones.properties || {}),
                columns: JSON.stringify(parametros.configuraciones.columns || {})
            }, {
                authorization: adminToken,
            }, true, false, "Add table «" + parametros.tabla + "» to project «" + proyectoId + "»");
        } catch (error) {
            throw error;
        }
    }

    async addProcess(parametros) {
        try {
            if (typeof parametros.ruta !== "string") {
                throw new Error("Required parameter «ruta» to be a string in order to «addProcess»");
            }
            if (parametros.ruta.indexOf("..") !== -1) {
                throw new Error("Required parameter «ruta» to not contain '..' in order to «addProcess»");
            }
            if (!parametros.ruta.endsWith(".js")) {
                throw new Error("Required parameter «ruta» to not contain '..' in order to «addProcess»");
            }
            if (typeof parametros.nombre !== "string") {
                throw new Error("Required parameter «nombre» to be a string in order to «addProcess»");
            }
            if (typeof parametros.proceso !== "function") {
                throw new Error("Required parameter «proceso» to be a function in order to «addProcess»");
            }
            if(!Array.isArray(parametros.proyectos)) {
                throw new Error("Required parameter «proyectos» to be an array in order to «addProcess»");
            }
            for(let indexProyecto = 0; indexProyecto < parametros.proyectos.length; indexProyecto++) {
                const proyecto = parametros.proyectos[indexProyecto];
                if (!Array.isArray(proyecto)) {
                    throw new Error("Required parameter «proyectos» on index «" + indexProyecto + "» to be an array in order to «addProcess»");
                }
                if (proyecto.length !== 2) {
                    throw new Error("Required parameter «proyectos» on index «" + indexProyecto + "» to be an array of 2 items in order to «addProcess»");
                }
                const proyectoId = proyecto.join("@");
                if (!(proyectoId in this.projects)) {
                    throw new Error("Required parameter «proyectos» on index «" + indexProyecto + "» to be a valid project identifier in order to «addProcess»");
                }
                const serverId = proyecto[0];
                const projectName = proyecto[1];
                if(!(serverId in this.servers)) {
                    throw new Error("Required parameter «proyectos» on index «" + indexProyecto + "» on index «0» to be a valid server identifier in order to «addProcess»");
                }
                const serverData = this.servers[serverId];
                const serverPath = serverData.directorio;
                const processPath = path.resolve(serverPath, "./src/classes/database/process", parametros.ruta);
                if(!processPath.startsWith(serverPath)) {
                    throw new Error("Required parameter «ruta» to result a subpath of the process folder in order to «addProcess»");
                }
                const processSubpath = parametros.ruta;
                const processSubpathParts = processSubpath.split("/");
                const processSubpathFolders = processSubpathParts.splice(0, processSubpathParts.length - 1);
                CreatingFolders:
                for(let indexFolders = 0; indexFolders < processSubpathFolders.length; indexFolders++) {
                    const processSubpathFolder = path.resolve(serverPath, "./src/classes/database/process", processSubpathFolders.slice(0, indexFolders + 1).join("/"));
                    const existsFile = await this.utils.fileExists(processSubpathFolder);
                    if (!existsFile) {
                        await fs.promises.mkdir(processSubpathFolder);
                    }
                }
                await fs.promises.writeFile(processPath, `module.exports = ${parametros.proceso.toString()};`);
                const processClassPath = path.resolve(serverPath, "./src/classes/database/Process.js");
                const processClassSource = await fs.promises.readFile(processClassPath, "utf8");
                const processClassSourceModified = processClassSource.replace(this.INTERCEPTOR_TOKEN, this.generateSwitchCaseCodeForProcess(parametros.nombre, parametros.ruta) + this.INTERCEPTOR_TOKEN);
                await fs.promises.writeFile(processClassPath, processClassSourceModified, "utf8");
                serverData.environment.database.Process.selfUpdate(serverData.environment);
                const projectJsonPath = path.resolve(serverPath, "./src/data/projects/" + projectName + "/project.json");
                const projectData = await this.utils.hydrateJSON(projectJsonPath);
                projectData.schema.attributes.hasEnabledProcesses[parametros.nombre] = true;
                await this.utils.dehydrateJSON(projectJsonPath, projectData);
            }
        } catch (error) {
            throw error;
        }
    }

    async addData(parametros) {
        try {
            const { proyecto, tabla, datos } = parametros;
            if(typeof proyecto !== "object") {
                throw new Error("Required parameter «proyecto» to be an object in order to «addData»");
            }
            if(!Array.isArray(proyecto)) {
                throw new Error("Required parameter «proyecto» to be an array in order to «addData»");
            }
            if(proyecto.length !== 2) {
                throw new Error("Required parameter «proyecto» to be an array of 2 items in order to «addData»");
            }
            const proyectoId = proyecto.join("@");
            if (!(proyectoId in this.projects)) {
                throw new Error("Required parameter «proyecto» to be a valid project identifier in order to «addData»");
            }
            if(typeof tabla !== "string") {
                throw new Error("Required parameter «tabla» to be a string in order to «addData»");
            }
            let dataProvidedAs = undefined;
            if(typeof datos === "function") {
                dataProvidedAs = "function";
            } else if(typeof datos === "object") {
                dataProvidedAs = "object";
            } else {
                throw new Error("Required parameter «datos» to be a function or an object in order to «addData»");
            }
            const [serverId, projectName] = proyecto;
            const serverDirectory = this.servers[serverId].directorio;
            const tableFile = path.resolve(serverDirectory, "./src/data/projects/" + projectName + "/data/" + tabla + ".json");
            const tableData = await this.utils.hydrateJSON(tableFile);
            if(dataProvidedAs === "function") {
                datos = await datos();
            }
            if(!Array.isArray(datos)) {
                throw new Error("Required parameter «datos» for «project.table» (" + proyecto.join("@") + "." + tabla + ") to end as an array or as a function that returns an array in order to «addData»");
            }
            const addedIds = [];
            for(let indexRow = 0; indexRow < datos.length; indexRow++) {
                const dato = datos[indexRow];
                const lastId = tableData.id++;
                dato.id = lastId;
                tableData.data[lastId] = dato;
                addedIds.push(lastId);
            }
            await this.utils.dehydrateJSON(tableFile, tableData);
            return addedIds;
        } catch (error) {
            throw error;
        }
    }

    async addFileToServer(parametros) {
        try {
            const { servidor, tipo, origen, destino } = parametros;
            if (typeof servidor !== "string") {
                throw new Error("Required parameter «servidor» to be a string in order to «addFileToServer»");
            }
            if (!(servidor in this.servers)) {
                throw new Error("Required parameter «servidor» (" + servidor + ") to be a valid server identifier in order to «addFileToServer»");
            }
            if (typeof tipo !== "string") {
                throw new Error("Required parameter «tipo» to be a string in order to «addFileToServer»");
            }
            if (["fichero", "directorio"].indexOf(tipo) === -1) {
                throw new Error("Required parameter «tipo» to be 'fichero' or 'directorio' in order to «addFileToServer»");
            }
            if (typeof origen !== "string") {
                throw new Error("Required parameter «origen» to be a string in order to «addFileToServer»");
            }
            if (typeof destino !== "string") {
                throw new Error("Required parameter «destino» to be a string in order to «addFileToServer»");
            }
            const origenSanitized = path.resolve(process.cwd(), origen);
            const directorioServidor = path.resolve(this.servers[servidor].directorio);
            const destinoSanitized = path.resolve(directorioServidor, destino);
            if (tipo === "fichero") {
                await fs.promises.copyFile(origenSanitized, destinoSanitized);
            } else if (tipo === "directorio") {
                // @TODO: copiar recursivamente ficheros y carpetas.
            }
        } catch (error) {
            throw error;
        }
    }

    async addFileToApplication(parametros) {
        try {
            const { tipo, origen, destino } = parametros;
            if (typeof tipo !== "string") {
                throw new Error("Required parameter «tipo» to be a string in order to «addFileToApplication»");
            }
            if (["fichero", "directorio"].indexOf(tipo) === -1) {
                throw new Error("Required parameter «tipo» to be 'fichero' or 'directorio' in order to «addFileToApplication»");
            }
            if (typeof origen !== "string") {
                throw new Error("Required parameter «origen» to be a string in order to «addFileToApplication»");
            }
            if (typeof destino !== "string") {
                throw new Error("Required parameter «destino» to be a string in order to «addFileToApplication»");
            }
            const origenSanitized = path.resolve(process.cwd(), origen);
            const directorioServidor = path.resolve(this.configurations.directorioBase, "./statics");
            const destinoSanitized = path.resolve(directorioServidor, destino);
            if (tipo === "fichero") {
                await fs.promises.copyFile(origenSanitized, destinoSanitized);
            } else if (tipo === "directorio") {
                // @TODO: copiar recursivamente ficheros y carpetas.
            }
        } catch (error) {
            throw error;
        }
    }

    async addFileToProject(parametros) {
        try {
            const { proyecto, tipo, origen, destino } = parametros;
            if (typeof proyecto !== "object") {
                throw new Error("Required parameter «proyecto» to be an object in order to «addFileToProject»");
            }
            if (!Array.isArray(proyecto)) {
                throw new Error("Required parameter «proyecto» to be an array in order to «addFileToProject»");
            }
            if (proyecto.length !== 2) {
                throw new Error("Required parameter «proyecto» to be an array of 2 items in order to «addFileToProject»");
            }
            const proyectoId = proyecto.join("@");
            if (!(proyectoId in this.projects)) {
                throw new Error("Required parameter «proyecto» (" + proyectoId + ") to be a valid project identifier in order to «addFileToProject»");
            }
            if (typeof tipo !== "string") {
                throw new Error("Required parameter «tipo» to be a string in order to «addFileToProject»");
            }
            if (["fichero", "directorio"].indexOf(tipo) === -1) {
                throw new Error("Required parameter «tipo» to be 'fichero' or 'directorio' in order to «addFileToProject»");
            }
            if (typeof origen !== "string") {
                throw new Error("Required parameter «origen» to be a string in order to «addFileToProject»");
            }
            if (typeof destino !== "string") {
                throw new Error("Required parameter «destino» to be a string in order to «addFileToProject»");
            }
            const origenSanitized = path.resolve(process.cwd(), origen);
            const directorioProyecto = path.resolve(this.servers[proyecto[0]].directorio, "./src/data/projects/" + proyecto[1]);
            const destinoSanitized = path.resolve(directorioProyecto, destino);
            if(tipo === "fichero") {
                await fs.promises.copyFile(origenSanitized, destinoSanitized);
            } else if(tipo === "directorio") {
                // @TODO: copiar recursivamente ficheros y carpetas.
            }
        } catch(error) {
            throw error;
        }
    }

    generateSwitchCaseCodeForProcess(processId, processPath) {
        return `
                case ${JSON.stringify(processId)}: {
                    response = await require(__dirname + "/process/" + ${JSON.stringify(processPath)}).call(this.environment, publicParameters, privateParameters, configurations);
                    break;
                }`;
    }

    getAuthenticationSchemaAttributesFromProject(project) {
        if(project === null) {
            return undefined;
        }
        const [ serverId, projectName ] = project;
        const serverDirectory = this.servers[serverId].directorio;
        const serverSettingsPath = path.resolve(serverDirectory, "./src/security/settings.json");
        const serverSettings = JSON.parse(fs.readFileSync(serverSettingsPath).toString());
        return {
            url: `${serverSettings.SERVER_PROTOCOL}://${serverSettings.SERVER_HOST}:${serverSettings.SERVER_PORT}`,
            project: projectName,
        };
    }

    async getServerURL(serverId) {
        try {
            if(!(serverId in this.servers)) {
                throw new Error("Required parameter «serverId» to be a valid server identifier");
            }
            const settingsPath = path.resolve(this.servers[serverId].directorio, "./src/security/settings.json");
            const settingsData = await this.utils.hydrateJSON(settingsPath);
            return `${settingsData.SERVER_PROTOCOL}://${settingsData.SERVER_HOST}:${settingsData.SERVER_PORT}`;
        } catch (error) {
            throw error;
        }
    }

    async getAuthAdminTokenFromProject(project) {
        try {
            const [ projectServerId, projectName ] = project;
            const projectId = project.join("@");
            const projectData = this.projects[projectId];
            const projectAuthenticator = projectData.autentificador;
            let authServerId, authServerData, authProjectName, authProjectId, authProjectData;
            if(projectAuthenticator === null) {
                authServerId = projectServerId;
                authServerData = this.servers[authServerId];
                authProjectName = projectName;
                authProjectId = project.join("@");
                authProjectData = projectData;
            } else {
                authServerId = projectAuthenticator[0];
                authServerData = this.servers[authServerId];
                authProjectName = projectAuthenticator[0];
                authProjectId = projectAuthenticator.join("@");
                authProjectData = this.projects[authProjectId];
            }
            if(!(authProjectId in this.administrators)) {
                const authServerSettings = await this.utils.hydrateJSON(path.resolve(authServerData.directorio, "./src/security/settings.json"));
                const authURL = `${authServerSettings.SERVER_PROTOCOL}://${authServerSettings.SERVER_HOST}:${authServerSettings.SERVER_PORT}`;
                const adminUser = this.projects[authProjectId].configuraciones.administrator_name;
                const adminPassword = this.projects[authProjectId].configuraciones.administrator_password;
                const response = await this.requester.request("POST", authURL, {
                    project: authProjectName,
                    operation: "login"
                }, {
                    user: adminUser,
                    password: adminPassword,
                }, {}, true, false, "Login to project «" + authProjectId + "»");
                this.administrators[authProjectId] = { token: response.response.data.session.token };
            }
            return this.administrators[authProjectId].token;
        } catch(error) {
            throw error;
        }
    }

    async getServerPublicData(serverId) {
        try {
            const serverData = this.servers[serverId];
            const settingsPath = path.resolve(serverData.directorio, "./src/security/settings.json");
            const settingsData = await this.utils.hydrateJSON(settingsPath);
            const serverPublicData = {
                id: serverId,
                url: `${settingsData.SERVER_PROTOCOL}://${settingsData.SERVER_HOST}:${settingsData.SERVER_PORT}`,
                port: settingsData.SERVER_PORT,
                host: settingsData.SERVER_HOST,
                protocol: settingsData.SERVER_PROTOCOL,
            };
            return serverPublicData;
        } catch (error) {
            throw error;
        }
    }

    async buildSchema() {
        try {
            const projectIds = Object.keys(this.projects);
            const schema = { projects: {}, authProject: undefined, chatProject: undefined };
            for(let indexProject = 0; indexProject < projectIds.length; indexProject++) {
                const projectId = projectIds[indexProject];
                const projectData = this.projects[projectId];
                const [ serverId ] = projectId.split("@");
                const serverJson = await this.getServerPublicData(serverId);
                schema.projects[projectId] = { server: serverJson };
                if((projectData.autentificador === null) && (typeof(schema.authProject) === "undefined")) {
                    schema.authProject = projectId;
                }
            }
            if(this.configurations.servidorDeChat) {
                schema.chatProject = {
                    server: schema.chatProject
                };
            }
            const schemaPath = path.resolve(this.application.path, "./src/app/schema.json");
            await this.utils.dehydrateJSON(schemaPath, schema);
            return this;
        } catch(error) {
            throw error;
        }
    }

};

const una_red_de_servidores_http_rest_automaticos = function (deployerCallback) {
    if (typeof window === "object") {
        console.log("La gramática de redes de servidores HTTP REST automáticos solo tiene efecto en entornos Node.js");
    } else if (typeof global === "object") {
        return RestServersNetwork.buildNetwork(deployerCallback);
    }
};

module.exports = { RestServersNetwork, una_red_de_servidores_http_rest_automaticos };