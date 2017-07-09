const Block = function (color, shape, back) {
    this.color = color;
    this.shape = shape;
    this.back = back;
};

Block.random = function () {
    const result = [];
    for (let i = 0; i < 3; i++)
        for (let j = 0; j < 3; j++)
            for (let k = 0; k < 3; k++)
                result.push([i, j, k]);

    const blocks = [];
    for (let l = 0; l < 9; l++) {
        const ran = result.splice(parseInt(Math.random() * result.length), 1)[0];
        blocks.push(new Block(ran[0], ran[1], ran[2]));
    }
    return blocks;
};

module.exports = Block;