const { getJsonFromHtml, getJsonFromDom } = require("./functions/table");

exports.getJsonFromHtml = function (dom, clearFn) {
  return getJsonFromHtml(dom, clearFn);
};

exports.getJsonFromDom = function (dom, clearFn) {
  return getJsonFromDom(dom, clearFn);
};
