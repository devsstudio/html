const { generateAlias } = require("@devs-studio/string");

exports.getJsonFromHtml = (html, clearFn) => {
  var DomParser = require("dom-parser");
  var parser = new DomParser();

  const dom = parser.parseFromString(html, clearFn);
  return this.getJsonFromDom(dom);
};

exports.getJsonFromDom = (dom, clearFn) => {
  var json = [];
  var meta = { level: 0, depth: 0, rowspan: [] };
  var spec = {};

  for (let domTr of dom.getElementsByTagName("tr")) {
    const domCells = domTr.getElementsByTagName("td");

    if (domCells.length > 0) {
      if (meta.level + domCells.length > meta.depth) {
        meta.depth = meta.level + domCells.length;
      }

      if (meta.level === 0) {
        spec = processSpec(domCells, 0, clearFn)[0];
      } else {
        for (var j = meta.level - 1; j >= 0; j--) {
          meta.rowspan[j]--;
        }
        add(spec, processSpec(domCells, 0, clearFn), 0, meta);
      }

      for (let domTd of domCells) {
        if (domTd.getAttribute("rowspan") > 1) {
          meta.rowspan[meta.level] = domTd.getAttribute("rowspan") - 1;
          meta.level++;
        }
      }

      for (var k = meta.level - 1; k >= 0; k--) {
        if (meta.rowspan[k] === 0) {
          meta.level--;
        }
      }

      if (meta.level === 0) {
        json.push(spec);
      }
    }
  }

  return {
    depth: meta.depth,
    json: json,
  };
};

const processSpec = (domCells, index, clearFn) => {
  const text = domCells[index].textContent;

  if (index < domCells.length - 1) {
    return [
      {
        alias: generateAlias(text),
        label: text,
        values: processSpec(domCells, index + 1, clearFn),
      },
    ];
  } else {
    if (clearFn) {
      return clearFn(text);
    } else {
      return clearValues(text);
    }
  }
};

const add = (spec, node, level, meta) => {
  if (level < meta.level - 1) {
    add(spec.values[spec.values.length - 1], node, level + 1, meta);
  } else {
    spec.values = [...spec.values, ...node];
  }
};

const clearValues = (value) => {
  return [value];
};
