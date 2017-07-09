if (!Array.prototype.find) {
    Array.prototype.find = function (callback, thisArg) {
        "use strict";
        var arr = this,
            arrLen = arr.length,
            i;
        for (i = 0; i < arrLen; i += 1) {
            if (callback.call(thisArg, arr[i], i, arr)) {
                return arr[i];
            }
        }
        return undefined;
    };
}

Array.prototype.next = function (el) {
    var index = this.indexOf(el) + 1;
    if (this.length <= index)
        index = 0;
    return this[index];
};

Date.prototype.format = function (f) {
    return moment().format(f);
};

Date.prototype.getDateTime = function () {
    return this.getDateString() + " (" + this.getDayKR() + ") " + this.getTimeString();
};

Date.prototype.toYMD = function () {
    if (new Date().isSameDay(this))
        return this.fromNow();
    return this.getDateTime();
};


Number.prototype.toYMD = function () {
    return new Date(this).toYMD();
};

Date.prototype.getDateString = function () {
    if (this.getFullYear() === new Date().getFullYear())
        return moment(this).format("M. D");
    return moment(this).format("YYYY. M. D.");
};

Date.prototype.isPast = function () {
    return this.getTime() < new Date().getTime();
};

Date.prototype.fromNow = function () {
    return moment(this).fromNow();
};

Date.prototype.getTimeString = function () {
    return moment(this).format("HH:mm");
};

Date.prototype.isSameDay = function (date) {
    if (!date)
        return false;
    return this.getFullYear() === date.getFullYear() && this.getMonth() === date.getMonth() && this.getDate() === date.getDate();
};


Date.prototype.range = function (date) {
    var early, late;
    if (this <= date) {
        early = this;
        late = date;
    } else {
        early = date;
        late = this;
    }
    if (this.isSameDay(date))
        return this.getDateString() + " (" + this.getDayKR() + ") " + early.getTimeString() + " ~ " + late.getTimeString();
    return early.toYMD() + " ~ " + late.toYMD();
};

if (!Array.prototype.contains) {
    Array.prototype.contains = function (searchElement /*, fromIndex*/) {
        'use strict';
        var O = Object(this);
        var len = parseInt(O.length) || 0;
        if (len === 0) {
            return false;
        }
        var n = parseInt(arguments[1]) || 0;
        var k;
        if (n >= 0) {
            k = n;
        } else {
            k = len + n;
            if (k < 0) {
                k = 0;
            }
        }
        var currentElement;
        while (k < len) {
            currentElement = O[k];
            if (searchElement === currentElement ||
                (searchElement !== searchElement && currentElement !== currentElement)) {
                return true;
            }
            k++;
        }
        return false;
    };
}

/* jshint ignore:start */
Array.prototype.ignoreTypeContains = function (searchElement /*, fromIndex*/) {
    'use strict';
    var O = Object(this);
    var len = parseInt(O.length) || 0;
    if (len === 0) {
        return false;
    }
    var n = parseInt(arguments[1]) || 0;
    var k;
    if (n >= 0) {
        k = n;
    } else {
        k = len + n;
        if (k < 0) {
            k = 0;
        }
    }
    var currentElement;
    while (k < len) {
        currentElement = O[k];
        if (searchElement == currentElement ||
            (searchElement != searchElement && currentElement != currentElement)) {
            return true;
        }
        k++;
    }
    return false;
};


Array.prototype.toggle = function (el) {
    if (this.contains(el)) {
        this.remove(el);
        return;
    }
    this.push(el);
};


Array.prototype.remove = function (el) {
    if (!this.contains(el))
        return;
    this.splice(this.indexOf(el), 1);
};

Array.prototype.pushIfNotExist = function (el) {
    if (this.contains(el))
        return;
    this.push(el);
};

Array.prototype.findById = function (id) {
    return this.findBy("id", id);
};

Array.prototype.findBy = function (name, value) {
    return this.find(function (el) {
        return el[name] == value;
    });
};

Array.prototype.removeBy = function (name, id) {
    return this.remove(this.findBy(name, id));
};

Array.prototype.removeById = function (id) {
    return this.remove(this.findBy("id", id));
};

Array.prototype.pushAll = function (array) {
    if (!array || !array.forEach)
        return;
    array.forEach(each => {
        this.push(each);
    });
};

Array.prototype.removeAll = function (array) {
    if (!array || !array.forEach)
        return;
    array.forEach(each => {
        this.remove(each);
    });
};

Array.prototype.last = function () {
    if (!this.length)
        return;
    return this[this.length - 1];
};

Array.prototype.random = function () {
    return this[Math.floor(Math.random() * this.length)];
};

Array.prototype.pushInto = function (index, val) {
    var tail = this.splice(index);
    this.push(val);
    this.pushAll(tail);
};

Number.prototype.toDay = function () {
    return ["월", "화", "수", "목", "금", "토", "일"][this % 7];
};

Number.prototype.toArray = function () {
    var result = [];
    for (var i = 0; i < this; i++) {
        result.push(i);
    }
    return result;
};


String.prototype.newLine = function () {
    return this.replace(/\n/g, '<br>');
};

String.prototype.removeTags = function () {
    return this.replace(/(<([^>]+)>)|(<[^<]+)$/ig, "");
};

Number.prototype.withSuffix = function () {
    var j = this % 10,
        k = this % 100;
    if (j == 1 && k != 11) {
        return this + "st";
    }
    if (j == 2 && k != 12) {
        return this + "nd";
    }
    if (j == 3 && k != 13) {
        return this + "rd";
    }
    return this + "th";
};
/* jshint ignore:end */