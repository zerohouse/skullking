function Type(name, desc) {
    this.name = name;
    this[name] = true;
    if (this.red || this.blue || this.black || this.yellow)
        this.normal = true;
    else
        this.item = true;
    this.desc = desc || this.name;
}

module.exports = {
    red: new Type("red"),
    blue: new Type("blue"),
    black: new Type("black"),
    yellow: new Type("yellow"),
    pirate: new Type("pirate","해적"),
    white: new Type("white","도망가자"),
    king: new Type("king","해적왕"),
    girl: new Type("girl","여해적"),
    pirateOR: new Type("pirateOR", "해적/도망")
};

