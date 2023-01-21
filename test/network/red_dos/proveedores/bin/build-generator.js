const fs = require("fs");
const path = require("path");

const getTree = function(directory, isRoot = true, rootDirectory = undefined) {
    const files = fs.readdirSync(directory).reduce(function(output, filenode) {
        const filenodePath = path.resolve(directory, filenode);
        const isGeneratorFile = ["generator.cli.js", "generator.js"].indexOf(filenode) !== -1;
        const isJsFile = filenodePath.endsWith(".js");
        const hasCaloFile = isJsFile ? fs.existsSync(filenodePath.replace(/\.js$/g, ".calo")) : false;
        if (isGeneratorFile) {} else {
            const isDirectory = fs.lstatSync(filenodePath).isDirectory();
            if (isJsFile && hasCaloFile) {
                // output[filenode] = isDirectory ? {} : fs.readFileSync(filenodePath).toString();
            } else if (isJsFile) {
                output[filenode] = isDirectory ? {} : fs.readFileSync(filenodePath).toString();
            } else {
                output[filenode] = isDirectory ? {} : fs.readFileSync(filenodePath).toString();
            }
        }
        return output;
    }, {});
    const subnodeIds = Object.keys(files);
    for(let index = 0; index < subnodeIds.length; index++) {
        const subnodeId = subnodeIds[index];
        const subnode = files[subnodeId];
        if(typeof subnode === "object") {
            const currentRootDirectory = (typeof rootDirectory === "undefined") ? directory : rootDirectory;
            const subnodePath = path.resolve(directory, subnodeId);
            console.log("Importing: " + subnodePath)
            files[subnodeId] = getTree(subnodePath, false, currentRootDirectory);
        }
    }
    if(!isRoot) {
        return files;
    }
    return { files, directory };
};

const generateSourceCode = function(tree) {
    const { files, directory } = tree;
    let output = '';
    output += 'const fs = require("fs");\n';
    output += 'const path = require("path");\n';
    output += 'const baseDirectory = process.argv[2];\n';
    output += 'if(typeof baseDirectory === "undefined") throw new Error("Required argument to know the destination of the project");\n';
    output += 'if(path.resolve(baseDirectory) === path.resolve(__dirname)) throw new Error("Required argument to not be the same directory of the generator file");\n';
    output += '';
    let index = 0;
    const generateSourceCodeForNode = function(treeNode, treeNodePath = ["."]) {
        let outputForNode = "";
        if(typeof treeNode === "string") {
            let nodeIndex = index++;
            const treeNodePathToParametersString = treeNodePath.length ? treeNodePath.map(n => JSON.stringify(n)).join(', ') : '"."';
            outputForNode += '\nconst node_' + nodeIndex + ' = path.resolve(baseDirectory, ' + treeNodePathToParametersString + ');';
            outputForNode += '\nconst node_contents_' + nodeIndex + ' = ' + JSON.stringify(treeNode) + ';';
            outputForNode += '\nfs.writeFileSync(node_' + nodeIndex + ', node_contents_' + nodeIndex + ', "utf8");\n';
        } else if(typeof treeNode === "object") {
            let nodeIndex = index++;
            const treeNodePathToParametersString = treeNodePath.length ? treeNodePath.map(n => JSON.stringify(n)).join(', ') : '"."';
            outputForNode += '\nconst node_' + nodeIndex + ' = path.resolve(baseDirectory, ' + treeNodePathToParametersString + ');';
            outputForNode += '\nfs.mkdirSync(node_' + nodeIndex + ');\n';
            outputForNode += Object.keys(treeNode).map(subnode => generateSourceCodeForNode(treeNode[subnode], treeNodePath.concat([subnode]))).join('');
        }
        return outputForNode;
    };
    output += generateSourceCodeForNode(tree.files);
    return output;
};

const generatorTree = getTree(path.resolve(__dirname, ".."));
const generatorSourceCode = generateSourceCode(generatorTree);
const generatorSrcPath = path.resolve(__dirname, "..", "generator.cli.js");
fs.writeFileSync(generatorSrcPath, generatorSourceCode, "utf8");

try {
    const generatorDstPath = "/home/carlos/Escritorio/Castelog/official/src/lib/401.castelog.v1.variables.generador_de_proyecto_rest.part.js";
    const generatorDst2Path = path.resolve(__dirname, "..", "generator.js");
    let output = "";
    output += "Castelog.variables.generador_de_proyector_rest = function(baseDirectoryArg) {\n";
    output += "\n";
    output += generatorSourceCode.replace('const baseDirectory = process.argv[2];', 'const baseDirectory = path.resolve(baseDirectoryArg);');
    output += "";
    output += "};";
    fs.writeFileSync(generatorDstPath, output, "utf8");
    output = output.replace("Castelog.variables.generador_de_proyector_rest", "module.exports");
    fs.writeFileSync(generatorDst2Path, output, "utf8");
} catch(error) {
    
}