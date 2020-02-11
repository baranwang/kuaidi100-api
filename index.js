"use strict";
exports.__esModule = true;
var axios_1 = require("axios");
var querystring = require("querystring");
var crypto = require("crypto");
var default_1 = /** @class */ (function () {
    function default_1(key, customer) {
        this.key = key;
        this.customer = customer;
    }
    default_1.prototype.query = function (com, num, options) {
        if (options === void 0) { options = {}; }
        var customer = this.customer;
        var phone = options.phone, from = options.from, to = options.to, resultv2 = options.resultv2, order = options.order;
        var show;
        switch (options.show) {
            case "xml":
                show = 1;
                break;
            case "html":
                show = 2;
                break;
            case "text":
                show = 3;
                break;
            case "json":
            default:
                show = 0;
                break;
        }
        var paramData = { com: com, num: num, phone: phone, from: from, to: to, resultv2: resultv2, show: show, order: order };
        Object.entries(paramData).forEach(function (res) {
            var _a = res, k = _a[0], v = _a[1];
            if (!v)
                delete paramData[k];
        });
        var param = JSON.stringify(paramData);
        var sign = crypto
            .createHash("md5")
            .update("" + param + this.key + customer)
            .digest("hex")
            .toUpperCase();
        axios_1["default"]
            .post("https://poll.kuaidi100.com/poll/query.do", querystring.stringify({ customer: customer, sign: sign, param: param }))
            .then(function (res) {
            console.log(res.data);
        });
    };
    return default_1;
}());
exports["default"] = default_1;
