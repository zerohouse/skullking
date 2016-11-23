module.exports = {
    html: ['<%= config.dist %>/{,*/}*.html'],
    css: ['<%= config.dist %>/{,*/}*.css'],
    js: ['<%= config.dist %>/{,*/}*.js'],
    options: {
        // cdn 된 것들은 유지하고 치환함.
        blockReplacements: {
            js: (block) => {
                var scripts = [];
                block.src.forEach((src)=> {
                    if (src.startsWith("//"))
                        scripts.push(getScript(src));
                });
                scripts.push(getScript(block.dest));
                return scripts.join(require('os').EOL);

                function getScript(input) {
                    return '<script src="' + input + '"></script>';
                }
            }
        }
    }
};