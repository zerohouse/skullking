var Cards = require("./skullking.cards");
require("./../../app/app.prototype");
require('fs').writeFileSync("cards.json", JSON.stringify(Cards.newSet({})));