"use strict";
exports.__esModule = true;
/**
 * @file 缓存的中间件hook
 */
var vue_1 = require("vue");
var cache = {};
var useSWR = function (key, promise, initialValue) {
    if (initialValue === void 0) { initialValue = null; }
    var state = vue_1.reactive({
        data: (cache[key] ? cache[key] : null) || (localStorage.getItem("swr-" + key)
            ? JSON.parse(localStorage.getItem("swr-" + key))
            : initialValue),
        isRevalidating: true,
        isError: false,
        error: null
    });
    promise.then(function (response) {
        cache[key] = response;
        state.data = response;
        state.isRevalidating = false;
    })["catch"](function (err) {
        state.isRevalidating = false;
        state.isError = true;
        state.error = err.message;
    });
    vue_1.watchEffect(function () {
        try {
            localStorage.setItem("swr-" + key, JSON.stringify(state.data));
        }
        catch (err) {
            console.log(err);
        }
        ;
    });
    return vue_1.readonly(vue_1.toRefs(state));
};
exports["default"] = useSWR;
