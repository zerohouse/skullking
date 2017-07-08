function Type(name) {
    this.name = name;
    this[name] = true;
    if (this.red || this.blue || this.black || this.yellow)
        this.normal = true;
    else
        this.item = true;
}

module.exports = {
    red: new Type("red"),
    blue: new Type("blue"),
    black: new Type("black"),
    yellow: new Type("yellow"),
    pirate: new Type("pirate"),
    white: new Type("white"),
    king: new Type("king"),
    girl: new Type("girl"),
    pirateOR: new Type("pirateOR")
};

