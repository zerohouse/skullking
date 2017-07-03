var randomNames = [
    "둘기",
    "리",
    "치",
    "수리",
    "매기",
    "추라기",
    "루미",
    "비",
    "마귀",
    "뻐꾸기",
    "꿩",
    "닭",
    "고니",
    "기러기",
    "논병아리",
    "딱따구리",
    "올빼미",
    "부엉이",
    "느시",
    "뜸부기",
    "매",
    "솔개",
    "조롱이",
    "말똥가리",
    "병아리",
    "가마우지",
    "왜가리",
    "해오라기",
    "따오기",
    "아비",
    "어치",
    "꾀꼬리",
    "할미새사촌",
    "직박구리",
    "지빠귀",
    "찌르레기",
    "동고비",
    "나무발발이",
    "곤줄박이",
    "오목눈이",
    "종다리"
];

function Player(id) {
    this.id = id;
    this.cards = [];
    this.win = 0;
    this.point = 0;
    this.points = [];
    this.name = randomNames.random();
}

Player.prototype.nextRound = function (game) {
    for (var i = 0; i < game.round; i++)
        this.drawCard(game);
    this.win = 0;
    this.prediction = null;
    this.submitCard = null;
};

Player.prototype.drawCard = function (game) {
    var card = game.cards.random();
    card.player = this.id;
    this.cards.push(card);
    game.cards.remove(card);
};

Player.prototype.error = function (word) {
    throw word;
};

Player.prototype.getName = function () {
    return this.name;
};

Player.prototype.submit = function (game, id, stepDone, roundDone, arg2) {
    if (game.phase !== "submit") {
        this.error('제출 단계가 아닙니다.');
        return;
    }
    if (!this.turn) {
        this.error("내 차례가 아닙니다.");
        return;
    }
    var submitCard = this.cards.findById(id);
    if (!submitCard) {
        this.error("없는 카드입니다.");
        return;
    }
    if (submitCard.type.name === 'pirateOR') {
        if (arg2)
            this.pirate = true;
    }
    if (!submitCard.type.item) {
        var prime = game.rounds.last().steps.last().prime;
        if (prime !== null && prime !== submitCard.type.name && this.cards.find(c => c.type.name === prime)) {
            this.error(`${prime} 타입의 일반 카드를 먼저 내야합니다.`);
            return;
        }
    }
    this.cards.remove(submitCard);
    this.submitCard = submitCard;
    game.submit(submitCard, stepDone, roundDone);
};

Player.prototype.predict = function (game, no, predictionDone) {
    if (game.phase !== "prediction") {
        this.error("예측 단계가 아닙니다.");
        return;
    }
    if (no < 0 || no > game.round) {
        this.error(`예측 범위는 0~${game.round}입니다.`);
        return;
    }
    if (isNaN(no)) {
        this.error('예측은 숫자로 해야 합니다.');
        return;
    }
    this.prediction = parseInt(no);
    game.predictionDone(predictionDone);
};

Player.prototype.addPoint = function (name, point) {
    this.point += point;
    this.points.push(new PointLog(name, point));
};

function PointLog(name, point) {
    this.name = name;
    this.point = point;
}

module.exports = Player;