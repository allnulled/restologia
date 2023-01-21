class Response {

    constructor(originalResponse, request, environment) {
        this.originalResponse = originalResponse;
        this.request = request;
        this.environment = environment;
        this.environment.utils.trace("Response.constructor");
    }

    async dispatch() {
        try {
            this.environment.utils.trace("Response.dispatch");
            await this.request.digest();
            const operationId = this.request.getParameters.operation;
            if(this.request.originalRequest.method.toLowerCase() === "options") {
                this.originalResponse.setHeader("Content-type", "application/json");
                this.originalResponse.setHeader("Access-Control-Allow-Origin", "*");
                this.originalResponse.setHeader("Access-Control-Allow-Headers", "*");
                this.originalResponse.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, OPTIONS");
                this.originalResponse.write(JSON.stringify({ message: "OK" }));
                this.originalResponse.end();
                return;
            }
            switch (operationId) {
                case "create-project": {
                    this.environment.utils.trace("Response.dispatch:createProject");
                    const operation = new this.environment.database.CreateProject(this.environment);
                    const operationResponse = await operation.execute(this.request.getParameters, this.request.postParameters, this.request.httpHeaders);
                    const formattedResponse = this.environment.utils.formatResponse(operationResponse, this.request.getParameters, this.request.postParameters);
                    this.originalResponse.setHeader("Content-type", "application/json");
                    this.originalResponse.setHeader("Access-Control-Allow-Origin", "*");
                    this.originalResponse.setHeader("Access-Control-Allow-Headers", "*");
                    this.originalResponse.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, OPTIONS");
                    this.originalResponse.write(JSON.stringify(formattedResponse));
                    this.originalResponse.end();
                    return;
                }
                case "delete-project": {
                    this.environment.utils.trace("Response.dispatch:deleteProject");
                    const operation = new this.environment.database.DeleteProject(this.environment);
                    const operationResponse = await operation.execute(this.request.getParameters, this.request.postParameters, this.request.httpHeaders);
                    const formattedResponse = this.environment.utils.formatResponse(operationResponse, this.request.getParameters, this.request.postParameters);
                    this.originalResponse.setHeader("Content-type", "application/json");
                    this.originalResponse.setHeader("Access-Control-Allow-Origin", "*");
                    this.originalResponse.setHeader("Access-Control-Allow-Headers", "*");
                    this.originalResponse.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, OPTIONS");
                    this.originalResponse.write(JSON.stringify(formattedResponse));
                    this.originalResponse.end();
                    return;
                }
                case "login": {
                    this.environment.utils.trace("Response.dispatch:login");
                    const operation = new this.environment.database.Login(this.environment);
                    const operationResponse = await operation.execute(this.request.getParameters, this.request.postParameters, this.request.httpHeaders);
                    const formattedResponse = this.environment.utils.formatResponse(operationResponse, this.request.getParameters, this.request.postParameters);
                    this.originalResponse.setHeader("Content-type", "application/json");
                    this.originalResponse.setHeader("Access-Control-Allow-Origin", "*");
                    this.originalResponse.setHeader("Access-Control-Allow-Headers", "*");
                    this.originalResponse.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, OPTIONS");
                    this.originalResponse.write(JSON.stringify(formattedResponse));
                    this.originalResponse.end();
                    return;
                }
                case "logout": {
                    this.environment.utils.trace("Response.dispatch:logout");
                    const operation = new this.environment.database.Logout(this.environment);
                    const operationResponse = await operation.execute(this.request.getParameters, this.request.postParameters, this.request.httpHeaders);
                    const formattedResponse = this.environment.utils.formatResponse(operationResponse, this.request.getParameters, this.request.postParameters);
                    this.originalResponse.setHeader("Content-type", "application/json");
                    this.originalResponse.setHeader("Access-Control-Allow-Origin", "*");
                    this.originalResponse.setHeader("Access-Control-Allow-Headers", "*");
                    this.originalResponse.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, OPTIONS");
                    this.originalResponse.write(JSON.stringify(formattedResponse));
                    this.originalResponse.end();
                    return;
                }
                case "authenticate": {
                    this.environment.utils.trace("Response.dispatch:authenticate");
                    const operation = new this.environment.database.Authenticate(this.environment);
                    const operationResponse = await operation.execute(this.request.getParameters, this.request.postParameters, this.request.httpHeaders);
                    const formattedResponse = this.environment.utils.formatResponse(operationResponse, this.request.getParameters, this.request.postParameters);
                    this.originalResponse.setHeader("Content-type", "application/json");
                    this.originalResponse.setHeader("Access-Control-Allow-Origin", "*");
                    this.originalResponse.setHeader("Access-Control-Allow-Headers", "*");
                    this.originalResponse.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, OPTIONS");
                    this.originalResponse.write(JSON.stringify(formattedResponse));
                    this.originalResponse.end();
                    return;
                }
                case "select": {
                    this.environment.utils.trace("Response.dispatch:select");
                    const operation = new this.environment.database.SelectRows(this.environment);
                    const operationResponse = await operation.execute(this.request.getParameters, this.request.postParameters, this.request.httpHeaders);
                    const formattedResponse = this.environment.utils.formatResponse(operationResponse, this.request.getParameters, this.request.postParameters);
                    this.originalResponse.setHeader("Content-type", "application/json");
                    this.originalResponse.setHeader("Access-Control-Allow-Origin", "*");
                    this.originalResponse.setHeader("Access-Control-Allow-Headers", "*");
                    this.originalResponse.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, OPTIONS");
                    this.originalResponse.write(JSON.stringify(formattedResponse));
                    this.originalResponse.end();
                    return;
                }
                case "insert": {
                    this.environment.utils.trace("Response.dispatch:insert");
                    const operation = new this.environment.database.InsertRow(this.environment);
                    const operationResponse = await operation.execute(this.request.getParameters, this.request.postParameters, this.request.httpHeaders);
                    const formattedResponse = this.environment.utils.formatResponse(operationResponse, this.request.getParameters, this.request.postParameters);
                    this.originalResponse.setHeader("Content-type", "application/json");
                    this.originalResponse.setHeader("Access-Control-Allow-Origin", "*");
                    this.originalResponse.setHeader("Access-Control-Allow-Headers", "*");
                    this.originalResponse.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, OPTIONS");
                    this.originalResponse.write(JSON.stringify(formattedResponse));
                    this.originalResponse.end();
                    return;
                }
                case "update": {
                    this.environment.utils.trace("Response.dispatch:update");
                    const operation = new this.environment.database.UpdateRow(this.environment);
                    const operationResponse = await operation.execute(this.request.getParameters, this.request.postParameters, this.request.httpHeaders);
                    const formattedResponse = this.environment.utils.formatResponse(operationResponse, this.request.getParameters, this.request.postParameters);
                    this.originalResponse.setHeader("Content-type", "application/json");
                    this.originalResponse.setHeader("Access-Control-Allow-Origin", "*");
                    this.originalResponse.setHeader("Access-Control-Allow-Headers", "*");
                    this.originalResponse.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, OPTIONS");
                    this.originalResponse.write(JSON.stringify(formattedResponse));
                    this.originalResponse.end();
                    return;
                }
                case "delete": {
                    this.environment.utils.trace("Response.dispatch:delete");
                    const operation = new this.environment.database.DeleteRow(this.environment);
                    const operationResponse = await operation.execute(this.request.getParameters, this.request.postParameters, this.request.httpHeaders);
                    const formattedResponse = this.environment.utils.formatResponse(operationResponse, this.request.getParameters, this.request.postParameters);
                    this.originalResponse.setHeader("Content-type", "application/json");
                    this.originalResponse.setHeader("Access-Control-Allow-Origin", "*");
                    this.originalResponse.setHeader("Access-Control-Allow-Headers", "*");
                    this.originalResponse.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, OPTIONS");
                    this.originalResponse.write(JSON.stringify(formattedResponse));
                    this.originalResponse.end();
                    return;
                }
                case "view-schema": {
                    this.environment.utils.trace("Response.dispatch:viewSchema");
                    const operation = new this.environment.database.ViewSchema(this.environment);
                    const operationResponse = await operation.execute(this.request.getParameters, this.request.postParameters, this.request.httpHeaders);
                    const formattedResponse = this.environment.utils.formatResponse(operationResponse, this.request.getParameters, this.request.postParameters);
                    this.originalResponse.setHeader("Content-type", "application/json");
                    this.originalResponse.setHeader("Access-Control-Allow-Origin", "*");
                    this.originalResponse.setHeader("Access-Control-Allow-Headers", "*");
                    this.originalResponse.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, OPTIONS");
                    this.originalResponse.write(JSON.stringify(formattedResponse));
                    this.originalResponse.end();
                    return;
                }
                case "process": {
                    this.environment.utils.trace("Response.dispatch:process");
                    const operation = new this.environment.database.Process(this.environment);
                    const operationResponse = await operation.execute(this.request.getParameters, this.request.postParameters, this.request.httpHeaders);
                    const formattedResponse = this.environment.utils.formatResponse(operationResponse, this.request.getParameters, this.request.postParameters);
                    this.originalResponse.setHeader("Content-type", "application/json");
                    this.originalResponse.setHeader("Access-Control-Allow-Origin", "*");
                    this.originalResponse.setHeader("Access-Control-Allow-Headers", "*");
                    this.originalResponse.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, OPTIONS");
                    this.originalResponse.write(JSON.stringify(formattedResponse));
                    this.originalResponse.end();
                    return;
                }
                case "add-table": {
                    this.environment.utils.trace("Response.dispatch:addTable");
                    const operation = new this.environment.database.AddTable(this.environment);
                    const operationResponse = await operation.execute(this.request.getParameters, this.request.postParameters, this.request.httpHeaders);
                    const formattedResponse = this.environment.utils.formatResponse(operationResponse, this.request.getParameters, this.request.postParameters);
                    this.originalResponse.setHeader("Content-type", "application/json");
                    this.originalResponse.setHeader("Access-Control-Allow-Origin", "*");
                    this.originalResponse.setHeader("Access-Control-Allow-Headers", "*");
                    this.originalResponse.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, OPTIONS");
                    this.originalResponse.write(JSON.stringify(formattedResponse));
                    this.originalResponse.end();
                    return;
                }
                case "add-column": {
                    this.environment.utils.trace("Response.dispatch;addColumn");
                    const operation = new this.environment.database.AddColumn(this.environment);
                    const operationResponse = await operation.execute(this.request.getParameters, this.request.postParameters, this.request.httpHeaders);
                    const formattedResponse = this.environment.utils.formatResponse(operationResponse, this.request.getParameters, this.request.postParameters);
                    this.originalResponse.setHeader("Content-type", "application/json");
                    this.originalResponse.setHeader("Access-Control-Allow-Origin", "*");
                    this.originalResponse.setHeader("Access-Control-Allow-Headers", "*");
                    this.originalResponse.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, OPTIONS");
                    this.originalResponse.write(JSON.stringify(formattedResponse));
                    this.originalResponse.end();
                    return;
                }
                case "add-protector": {
                    this.environment.utils.trace("Response.dispatch:addProtector");
                    const operation = new this.environment.database.AddProtector(this.environment);
                    const operationResponse = await operation.execute(this.request.getParameters, this.request.postParameters, this.request.httpHeaders);
                    const formattedResponse = this.environment.utils.formatResponse(operationResponse, this.request.getParameters, this.request.postParameters);
                    this.originalResponse.setHeader("Content-type", "application/json");
                    this.originalResponse.setHeader("Access-Control-Allow-Origin", "*");
                    this.originalResponse.setHeader("Access-Control-Allow-Headers", "*");
                    this.originalResponse.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, OPTIONS");
                    this.originalResponse.write(JSON.stringify(formattedResponse));
                    this.originalResponse.end();
                    return;
                }
                case "update-table": {
                    this.environment.utils.trace("Response.dispatch:updateTable");
                    const operation = new this.environment.database.UpdateTable(this.environment);
                    const operationResponse = await operation.execute(this.request.getParameters, this.request.postParameters, this.request.httpHeaders);
                    const formattedResponse = this.environment.utils.formatResponse(operationResponse, this.request.getParameters, this.request.postParameters);
                    this.originalResponse.setHeader("Content-type", "application/json");
                    this.originalResponse.setHeader("Access-Control-Allow-Origin", "*");
                    this.originalResponse.setHeader("Access-Control-Allow-Headers", "*");
                    this.originalResponse.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, OPTIONS");
                    this.originalResponse.write(JSON.stringify(formattedResponse));
                    this.originalResponse.end();
                    return;
                }
                case "update-column": {
                    this.environment.utils.trace("Response.dispatch:updateColumn");
                    const operation = new this.environment.database.UpdateColumn(this.environment);
                    const operationResponse = await operation.execute(this.request.getParameters, this.request.postParameters, this.request.httpHeaders);
                    const formattedResponse = this.environment.utils.formatResponse(operationResponse, this.request.getParameters, this.request.postParameters);
                    this.originalResponse.setHeader("Content-type", "application/json");
                    this.originalResponse.setHeader("Access-Control-Allow-Origin", "*");
                    this.originalResponse.setHeader("Access-Control-Allow-Headers", "*");
                    this.originalResponse.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, OPTIONS");
                    this.originalResponse.write(JSON.stringify(formattedResponse));
                    this.originalResponse.end();
                    return;
                }
                case "update-protector": {
                    this.environment.utils.trace("Response.dispatch:updateProtector");
                    const operation = new this.environment.database.UpdateProtector(this.environment);
                    const operationResponse = await operation.execute(this.request.getParameters, this.request.postParameters, this.request.httpHeaders);
                    const formattedResponse = this.environment.utils.formatResponse(operationResponse, this.request.getParameters, this.request.postParameters);
                    this.originalResponse.setHeader("Content-type", "application/json");
                    this.originalResponse.setHeader("Access-Control-Allow-Origin", "*");
                    this.originalResponse.setHeader("Access-Control-Allow-Headers", "*");
                    this.originalResponse.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, OPTIONS");
                    this.originalResponse.write(JSON.stringify(formattedResponse));
                    this.originalResponse.end();
                    return;
                }
                case "delete-table": {
                    this.environment.utils.trace("Response.dispatch:deleteTable");
                    const operation = new this.environment.database.DeleteTable(this.environment);
                    const operationResponse = await operation.execute(this.request.getParameters, this.request.postParameters, this.request.httpHeaders);
                    const formattedResponse = this.environment.utils.formatResponse(operationResponse, this.request.getParameters, this.request.postParameters);
                    this.originalResponse.setHeader("Content-type", "application/json");
                    this.originalResponse.setHeader("Access-Control-Allow-Origin", "*");
                    this.originalResponse.setHeader("Access-Control-Allow-Headers", "*");
                    this.originalResponse.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, OPTIONS");
                    this.originalResponse.write(JSON.stringify(formattedResponse));
                    this.originalResponse.end();
                    return;
                }
                case "delete-column": {
                    this.environment.utils.trace("Response.dispatch:deleteColumn");
                    const operation = new this.environment.database.DeleteColumn(this.environment);
                    const operationResponse = await operation.execute(this.request.getParameters, this.request.postParameters, this.request.httpHeaders);
                    const formattedResponse = this.environment.utils.formatResponse(operationResponse, this.request.getParameters, this.request.postParameters);
                    this.originalResponse.setHeader("Content-type", "application/json");
                    this.originalResponse.setHeader("Access-Control-Allow-Origin", "*");
                    this.originalResponse.setHeader("Access-Control-Allow-Headers", "*");
                    this.originalResponse.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, OPTIONS");
                    this.originalResponse.write(JSON.stringify(formattedResponse));
                    this.originalResponse.end();
                    return;
                }
                case "delete-protector": {
                    this.environment.utils.trace("Response.dispatch:deleteProtector");
                    const operation = new this.environment.database.DeleteProtector(this.environment);
                    const operationResponse = await operation.execute(this.request.getParameters, this.request.postParameters, this.request.httpHeaders);
                    const formattedResponse = this.environment.utils.formatResponse(operationResponse, this.request.getParameters, this.request.postParameters);
                    this.originalResponse.setHeader("Content-type", "application/json");
                    this.originalResponse.setHeader("Access-Control-Allow-Origin", "*");
                    this.originalResponse.setHeader("Access-Control-Allow-Headers", "*");
                    this.originalResponse.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, OPTIONS");
                    this.originalResponse.write(JSON.stringify(formattedResponse));
                    this.originalResponse.end();
                    return;
                }
                case "get-file": {
                    this.environment.utils.trace("Response.dispatch:getFile");
                    const operation = new this.environment.database.GetFile(this.environment);
                    return await operation.execute(this.request.getParameters, this.request.postParameters, this.request.httpHeaders, this.originalResponse);
                }
                case "set-file": {
                    this.environment.utils.trace("Response.dispatch:setFile");
                    const operation = new this.environment.database.SetFile(this.environment);
                    const operationResponse = await operation.execute(this.request.getParameters, this.request.postParameters, this.request.httpHeaders, this.request.originalRequest);
                    const formattedResponse = this.environment.utils.formatResponse(operationResponse, this.request.getParameters, this.request.postParameters);
                    this.originalResponse.setHeader("Content-type", "application/json");
                    this.originalResponse.setHeader("Access-Control-Allow-Origin", "*");
                    this.originalResponse.setHeader("Access-Control-Allow-Headers", "*");
                    this.originalResponse.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, OPTIONS");
                    this.originalResponse.write(JSON.stringify(formattedResponse));
                    this.originalResponse.end();
                    return;
                }
                default: {
                    this.environment.utils.trace("Response.dispatch:default");
                    const baseURL = this.environment.utils.getBaseURL();
                    this.originalResponse.setHeader("Content-type", "application/json");
                    this.originalResponse.setHeader("Access-Control-Allow-Origin", "*");
                    this.originalResponse.setHeader("Access-Control-Allow-Headers", "*");
                    this.originalResponse.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, OPTIONS");
                    this.originalResponse.write(JSON.stringify(this.environment.utils.formatResponse({
                        "message": "The specified operation is not identified. The standard help message is served instead.",
                        "help": {
                            "instructions": [
                                "This is a private «HTTP REST API» application endpoint fully served as «JSON HTTP API».",
                                "All the «HTTP REST API» operations are served by the same endpoint: «" + baseURL + "»",
                                "The «parameters» that are defined as '*' MUST BE provided by «querystring parameters».",
                                "The «parameters» that are defined as '@@' MUST BE provided by «body parameters».",
                                "The «operations» that DO NOT require «body parameters» MUST BE requested by «GET HTTP requests».",
                                "The «operations» that DO require «body parameters» MUST BE requested by «POST HTTP requests».",
                                "The «body» of the «POST HTTP requests» MUST BE a «stringified JSON».",
                                "The «operations» that require «authentication» are preceded by '!'.",
                                "The «authentication» MUST BE provided by an «HTTP header» of 'authorization' filled with the «session token» provided by the «login operation».",
                            ],
                            "operations": {
                                // Authentication:
                                "login": baseURL + "?operation=login&user=@@&password=@@",
                                "logout": "!" + baseURL + "?operation=logout",
                                // Data:
                                "select": "!" + baseURL + "?operation=select&project=*&table=*&where=*&sort=*&paginate=*",
                                "insert": "!" + baseURL + "?operation=insert&project=*&table=@@&value=@@",
                                "update": "!" + baseURL + "?operation=update&project=*&table=@@&id=@@&value=@@",
                                "delete": "!" + baseURL + "?operation=delete&project=*&table=@@&id=@@",
                                // Schema:
                                "view-schema": "!" + baseURL + "?operation=view-schema&project=*",
                                // Schema tables:
                                "add-table": "!" + baseURL + "?operation=add-table&project=*&table=@@&attributes=@@&properties=@@&columns=@@",
                                "update-table": "!" + baseURL + "?operation=update-table&project=*&table=@@&attributes=@@&properties=@@",
                                "delete-table": "!" + baseURL + "?operation=delete-table&project=*&table=@@",
                                // Schema columns:
                                "add-column": "!" + baseURL + "?operation=add-column&project=*&table=@@&column=@@&attributes=@@&properties=@@",
                                "update-column": "!" + baseURL + "?operation=update-column&project=*&table=@@&column=@@&attributes=@@&properties=@@",
                                "delete-column": "!" + baseURL + "?operation=delete-column&project=*&table=@@&column=@@",
                                // Table protectors:
                                "add-protector": "!" + baseURL + "?operation=add-protector&project=*&table=@@&protector_position=@@&protector_value=@@",
                                "update-protector": "!" + baseURL + "?operation=update-protector&project=*&table=@@&protector_position=@@&protector_value=@@",
                                "delete-protector": "!" + baseURL + "?operation=delete-protector&project=*&table=@@&protector_position=@@&protector_value=@@",
                                // Projects:
                                "create-project": "!" + baseURL + "?operation=create-project&project=*&user=@@&password=@@&administrator_name=@@&administrator_email=@@&administrator_password=@@",
                                "delete-project": "!" + baseURL + "?operation=delete-project&project=*&user=@@&password=@@",
                            }
                        }
                    })));
                    this.originalResponse.end();
                    return;
                }
            }
        } catch(error) {
            this.environment.utils.debugError("Response.dispatch", error);
            this.originalResponse.setHeader("Content-type", "application/json");
            this.originalResponse.setHeader("Access-Control-Allow-Origin", "*");
            this.originalResponse.setHeader("Access-Control-Allow-Headers", "*");
            this.originalResponse.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, OPTIONS");
            this.originalResponse.write(JSON.stringify(this.environment.utils.formatErrorResponse({
                "name": "Operation failed error",
                "message": (typeof error === "object") ? error.message : error
            })));
            this.originalResponse.end();
        }
    }

}

module.exports = Response;