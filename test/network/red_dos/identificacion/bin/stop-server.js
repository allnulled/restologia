const { SERVER_PORT } = require(__dirname + "/../src/security/settings.json");
require("child_process").execSync(`fuser -n tcp -k ${SERVER_PORT}`);