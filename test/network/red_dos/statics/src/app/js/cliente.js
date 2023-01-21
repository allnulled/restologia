
window.$Restologia = class {static create(extensiones = {}){return new this(extensiones);}
constructor(extensiones = {}){this.schemaData = undefined;
this.rootComponent = undefined;
this.authentication = undefined;
this.axiosClient = axios.create({baseUrl:window.location.href});
this.authProject = undefined;
Object.assign(this, extensiones);}
setRootComponent($rootComponent){this.rootComponent = $rootComponent;}
getProjectURLOfProject(projectId){if((!(projectId in this.schemaData.projects))) {
throw new Error("Required parameter «projectId» to be a valid project in order to «$rest.getProjectURLOfProject»");
}
return this.schemaData.projects[projectId].server.url;}
getProjectNameOfProject(projectId){if((!(projectId in this.schemaData.projects))) {
throw new Error("Required parameter «projectId» to be a valid project in order to «$rest.getProjectNameOfProject»");
}
return this.schemaData.projects[projectId].project.name;}
getReferredProjectAndTableByColumn(projectId, table, column){try {if((!(projectId in this.schemaData.projects))) {
throw new Error("Required parameter «project» (" + projectId + ") to be a known project full-identifier in order to «$rest.getProjectAndTableByExternalizedColumn»");
}
if((!(table in this.schemaData.projects[projectId].project.schema.tables))) {
throw new Error("Required parameter «table» (" + table + ") to be a known table identifier in «project» (" + projectId + ") in order to «$rest.getProjectAndTableByExternalizedColumn»");
}
if((!(column in this.schemaData.projects[projectId].project.schema.tables[table].columns))) {
throw new Error("Required parameter «column» (" + column + ") to be a known column identifier in «project» (" + projectId + ") and «table» (" + table + ") in order to «$rest.getProjectAndTableByExternalizedColumn»");
}
const columnData = this.schemaData.projects[projectId].project.schema.tables[table].columns[column];
if((!(typeof columnData.attributes.isReferenceOf === 'string'))) {
throw new Error("Required parameter «project.table.column» (" + projectId + "." + table + "." + column + ") to be a reference of other table in order to «$rest.getProjectAndTableByExternalizedColumn»");
}
if((!(columnData.attributes.isReferenceOf in this.schemaData.projects[projectId].project.schema.tables))) {
throw new Error("Required configuration «isReferenceOf» in «column» (" + projectId + "." + table + "." + column + ") to have attribute «isReferenceOf» (" + columnData.attributes.isReferenceOf + ") pointing to a valid own table in order to «$rest.getProjectAndTableByExternalizedColumn»");
}
const referencedTable = this.schemaData.projects[projectId].project.schema.tables[columnData.attributes.isReferenceOf];
const externalization = referencedTable.attributes.isExternalizedBy;
if((!(externalization))) {
return {project:projectId, table:columnData.attributes.isReferenceOf};
}
return (() => {
const externalHost = externalization.host;
const externalProject = externalization.project;
const externalTable = externalization.table;
let isExternalTableOfProject = false;
for(let projectId2 in this.schemaData.projects) {
const projectData = this.schemaData.projects[projectId2];
const projectUrl = projectData.server.url;
if(projectUrl === externalHost) {
isExternalTableOfProject = projectData;
if((!(externalTable in projectData.project.schema.tables))) {
throw new Error("Required configuration «isExternalizedBy» on «host» (" + externalization.host + ") and «table» (" + externalization.table + ") parameters to refer to a valid table in schema in order to «$rest.getProjectAndTableByExternalizedColumn»");
}
}}

if(isExternalTableOfProject === false) {
throw new Error("Required parameter «project.table.column» (" + projectId + "." + table + "." + column + ") to be a valid reference of other table in the same project in order to «$rest.getProjectAndTableByExternalizedColumn»");
}
if((!(externalTable in isExternalTableOfProject.project.schema.tables))) {
throw new Error("Missing table (" + externalTable + ") on «project.host» (" + externalProject + "." + externalHost + ") due to externalized «host.table» (" + externalization.host + "." + externalization.table + ") on «project.table.column» (" + projectId + "." + table + "." + column + ") in order to «getProjectAndTableByExternalizedColumn» ");
}
return {project:isExternalTableOfProject.project.id, table:externalTable};})();}catch(error) {
console.log(error);
this.rootComponent.$notificaciones.error(error);
throw error;}}
getFileUrl(project, table, id, column){try {const projectName = this.getProjectNameOfProject(project);
const projectUrl = this.getProjectURLOfProject(project);
const parametrosQuerystring = new URLSearchParams({operation:"get-file", project:projectName, table:table, column:column, id:id, nocache:Vue.prototype.$utilidades.getRandomId(10), authorization:this.rootComponent.authentication.token}).toString();
return projectUrl + "?" + parametrosQuerystring;}catch(error) {
console.log(error);
this.rootComponent.$notificaciones.error(error, "$restologia.getFileUrl");
throw error;}}
async schema(fullSchema = false){try {const respuestaSchema = (await Castelog.metodos.una_peticion_http("/schema.json", "GET", {}, {}, this.axiosClient, null));
if(respuestaSchema.data.error) {
throw new Error(respuestaSchema.data.error.message);
}
this.schemaServers = respuestaSchema.data;
if((!(fullSchema))) {
return this.schemaServers;
}
const allSchemas = Object.assign({}, this.schemaServers);
for(const projectId in this.schemaServers.projects) {
const projectServerData = this.schemaServers.projects[projectId].server;
const [ serverName, projectName ] = projectId.split("@");
const parametrosQuerystring = new URLSearchParams({operation:"view-schema", project:projectName}).toString();
const projectUrl = projectServerData.url + "?" + parametrosQuerystring;
const respuestaProjectSchema = (await Castelog.metodos.una_peticion_http(projectUrl, "GET", {}, {}, this.axiosClient, null));
const projectSchema = respuestaProjectSchema.data.data.schema;
allSchemas.projects[projectId].project = {name:projectName, id:projectId, schema:projectSchema};}

this.schemaData = allSchemas;
this.rootComponent.schema = this.schemaData;
this.authProject = this.schemaData.projects[this.schemaData.authProject];
return this.schemaData;}catch(error) {
console.log(error);
this.rootComponent.$notificaciones.error(error, "$restologia.schema");
throw error;}}
async login(user, password){try {if(((!(this.schemaServers))) || ((!(this.schemaServers.authProject)))) {
throw new Error("Required to have «schema» in order to «login»");
}
const authProjectId = this.schemaServers.authProject;
const authProjectName = authProjectId.split("@")[1];
const authUrl = this.schemaServers.projects[authProjectId].server.url;
const respuestaLogin = (await Castelog.metodos.una_peticion_http(authUrl + `?project=${authProjectName}&operation=login`, "POST", {user, password}, {}, this.axiosClient, null));
if(respuestaLogin.data.error) {
throw new Error(respuestaLogin.data.error.message);
}
this.authentication = {token:respuestaLogin.data.data.session.token, user:respuestaLogin.data.data.session.authentication.user, groups:respuestaLogin.data.data.session.authentication.groups, privileges:respuestaLogin.data.data.session.authentication.privileges};
this.rootComponent.authentication = this.authentication;
this.axiosClient.defaults.headers.common.Authorization = respuestaLogin.data.data.session.token;
return this.authentication;}catch(error) {
console.log(error);
this.rootComponent.$notificaciones.error(error, "$rest.login");
throw error;}}
async logout(){try {const authUrl = this.authProject.server.url;
const respuestaLogout = (await Castelog.metodos.una_peticion_http(authUrl + `?project=${this.authProject.project.name}&operation=logout`, "POST", {}, {}, this.axiosClient, null));
if(respuestaLogout.data.error) {
throw new Error(respuestaLogout.data.error.message);
}
this.rootComponent.authentication = undefined;
this.authentication = undefined;
delete this.axiosClient.defaults.headers.common.Authorization;
return this.authentication;}catch(error) {
console.log(error);
this.rootComponent.$notificaciones.error(error, "$restologia.logout");
throw error;}}
async select(project, table, where, order, paginate, search){try {const projectUrl = this.getProjectURLOfProject(project);
const projectName = this.getProjectNameOfProject(project);
const parametrosQuerystring = new URLSearchParams({operation:"select", project:projectName, table:table, where:JSON.stringify(where, null, 2), sort:JSON.stringify(order, null, 2), paginate:JSON.stringify(paginate, null, 2), search:JSON.stringify(search, null, 2)}).toString();
const respuestaSelect = (await Castelog.metodos.una_peticion_http(projectUrl + "?" + parametrosQuerystring, "GET", {}, {}, this.axiosClient, null));
if(respuestaSelect.data.error) {
throw new Error(respuestaSelect.data.error.message);
}
return respuestaSelect;}catch(error) {
console.log(error);
this.rootComponent.$notificaciones.error(error, "$restologia.select");
throw error;}}
async insert(project, table, value){try {const projectUrl = this.getProjectURLOfProject(project);
const projectName = this.getProjectNameOfProject(project);
const parametrosQuerystring = new URLSearchParams({operation:"insert", project:projectName}).toString();
const respuestaInsert = (await Castelog.metodos.una_peticion_http(projectUrl + "?" + parametrosQuerystring, "POST", {table:table, value:JSON.stringify(value, null, 2)}, {}, this.axiosClient, null));
if(respuestaInsert.data.error) {
throw new Error(respuestaInsert.data.error.message);
}
return respuestaInsert;}catch(error) {
console.log(error);
this.rootComponent.$notificaciones.error(error, "$restologia.insert");
throw error;}}
async update(project, table, id, value){try {const projectUrl = this.getProjectURLOfProject(project);
const projectName = this.getProjectNameOfProject(project);
const parametrosQuerystring = new URLSearchParams({operation:"update", project:projectName}).toString();
const respuestaInsert = (await Castelog.metodos.una_peticion_http(projectUrl + "?" + parametrosQuerystring, "POST", {table:table, id:id, value:JSON.stringify(value, null, 2)}, {}, this.axiosClient, null));
if(respuestaInsert.data.error) {
throw new Error(respuestaInsert.data.error.message);
}
return respuestaInsert;}catch(error) {
console.log(error);
this.rootComponent.$notificaciones.error(error, "$restologia.update");
throw error;}}
async delete(project, table, id){try {const projectUrl = this.getProjectURLOfProject(project);
const projectName = this.getProjectNameOfProject(project);
const parametrosQuerystring = new URLSearchParams({operation:"delete", project:projectName}).toString();
const respuestaInsert = (await Castelog.metodos.una_peticion_http(projectUrl + "?" + parametrosQuerystring, "POST", {table:table, id:id}, {}, this.axiosClient, null));
if(respuestaInsert.data.error) {
throw new Error(respuestaInsert.data.error.message);
}
return respuestaInsert;}catch(error) {
console.log(error);
this.rootComponent.$notificaciones.error(error, "$restologia.delete");
throw error;}}
async setFile(project, table, id, column, fileInputs = []){try {const projectName = this.getProjectNameOfProject(project);
const projectUrl = this.getProjectURLOfProject(project);
const parametrosQuerystring = new URLSearchParams({operation:"set-file", project:projectName, table:table, column:column, id:id}).toString();
const actionUrl = projectUrl + "?" + parametrosQuerystring;
const formData = new FormData();
let hasOne = false;
const fileKeys = Object.keys(fileInputs);
for(let keyIndex of fileKeys) {
const fileKey = fileKeys[keyIndex];
const fileInput = fileInputs[fileKey];
if(typeof fileInput === 'undefined') {
throw new Error("Required parameter «fileInputs» on index «" + keyIndex + "» to not be undefined in order to «$restologia.setFile» from front");
}
if((!(fileInput instanceof HTMLElement))) {
throw new Error("Required parameter «fileInputs» on index «" + keyIndex + "» to be an «HTMLElement» instance in order to «$restologia.setFile» from front");
}
if((!(fileInput instanceof HTMLInputElement))) {
throw new Error("Required parameter «fileInputs» on index «" + keyIndex + "» to be an «HTMLInputElement» instance in order to «$restologia.setFile» from front");
}
if(typeof fileInput.files === 'undefined') {
throw new Error("Required parameter «fileInputs» on index «" + keyIndex + "» to have a «files» property in order to «$restologia.setFile» from front");
}
if(typeof fileInput.files[0] === 'undefined') {
throw new Error("Required parameter «fileInputs» on index «" + keyIndex + "» to have at least 1 «File» instance in order to «$restologia.setFile» from front");
}
const fileItem = fileInput.files[0];
formData.append("files[]", fileItem);
if((!(hasOne === true))) {
hasOne = true;
}}

if(hasOne === false) {
throw new Error("Required parameter «fileInputs» to have at least 1 item in order to «$restologia.setFile» from front");
}
const respuestaSetFile = (await Castelog.metodos.una_peticion_http(actionUrl, "POST", formData, {"Content-type":"multipart/formdata"}, this.axiosClient, null));
if(respuestaSetFile.data.error) {
throw new Error(respuestaSetFile.data.error.message);
}
return respuestaSetFile;}catch(error) {
console.log(error);
this.rootComponent.$notificaciones.error(error, "$restologia.setFile");
throw error;}}
async getFile(project, table, id, column){try {const projectUrl = this.getFileUrl(project, table, id, column);
const respuestaGetFile = (await Castelog.metodos.una_peticion_http(this.getFileUrl(this.getProjectNameOfProject(project), table, column, id), "GET", {}, {}, this.axiosClient, null));
if(respuestaGetFile.data.error) {
throw new Error(respuestaGetFile.data.error.message);
}
return respuestaGetFile;}catch(error) {
console.log(error);
this.rootComponent.$notificaciones.error(error, "$restologia.getFile");
throw error;}}
async insertTable(project, table){try {const projectUrl = this.getProjectURLOfProject(project);
const projectName = this.getProjectNameOfProject(project);
const parametrosQuerystring = new URLSearchParams({operation:"add-table", project:projectName}).toString();
const actionUrl = projectUrl + "?" + parametrosQuerystring;
const respuestaInsertTable = (await Castelog.metodos.una_peticion_http(actionUrl, "POST", {table:table, attributes:JSON.stringify({}, null, 2), properties:JSON.stringify({}, null, 2)}, {}, this.axiosClient, null));
if(respuestaInsertTable.data.error) {
throw new Error(respuestaInsertTable.data.error.message);
}
return respuestaInsertTable;}catch(error) {
console.log(error);
this.rootComponent.$notificaciones.error(error, "$restologia.insertTable");
throw error;}}
async updateTable(project, table, attributes, properties){try {const projectUrl = this.getProjectURLOfProject(project);
const projectName = this.getProjectNameOfProject(project);
const parametrosQuerystring = new URLSearchParams({operation:"update-table", project:projectName}).toString();
const actionUrl = projectUrl + "?" + parametrosQuerystring;
const respuestaUpdateTable = (await Castelog.metodos.una_peticion_http(actionUrl, "POST", {table:table, attributes:JSON.stringify(attributes, null, 2), properties:JSON.stringify(properties, null, 2)}, {}, this.axiosClient, null));
if(respuestaUpdateTable.data.error) {
throw new Error(respuestaUpdateTable.data.error.message);
}
return respuestaUpdateTable;}catch(error) {
console.log(error);
this.rootComponent.$notificaciones.error(error, "$restologia.updateTable");
throw error;}}};
window.$restologia = window.$Restologia.create();