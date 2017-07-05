const MutableNodeList = require('./mutableNodeList.js');

const _docReadyCallbacks = [];
let _docReady = false;

window.$MD = (selector) => {
  switch (typeof (selector)) {
    case "function":
      return registerDocReadyCallback(selector);
    case "string":
      return getNodesFromDom(selector);
    case "object":
      if (selector instanceof HTMLElement) {
        return new MutableNodeList([selector]);
      }
  }
};

$MD.promise = (options) => {
  return new Promise((resolve, reject) => {

    const request = new XMLHttpRequest();
    const defaults = {
      contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
      method: "GET",
      url: "",
      success: () => {},
      error: () => {},
      data: {},
    };
    options = $MD.mergeOptions(defaults, options);
    options.method = options.method.toUpperCase();

    if (options.method === "GET") {
      options.url += "?" + toQueryString(options.data);
    }

    request.open(options.method, options.url, true);

    request.onload = e => {
      if (request.status === 200) {
        options.success(request.response);
        resolve(request.response);
      } else {
        options.error(request.response);
        reject(request.response);
      }
    };

    request.onerror = () => reject(Error("Network Error"));

    request.send(JSON.stringify(options.data));
  });
};

$MD.getJSON = (options) => {
  return new Promise((resolve, reject) => {

    const request = new XMLHttpRequest();
    const defaults = {
      contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
      method: "GET",
      url: "",
      success: () => {},
      error: () => {},
      data: {},
    };
    options = $MD.mergeOptions(defaults, options);
    options.method = options.method.toUpperCase();

    if (options.method === "GET") {
      options.url += "?" + toQueryString(options.data);
    }

    request.open(options.method, options.url, true);

    request.onload = e => {
      if (request.status === 200) {
        options.success(request.response);
        resolve(JSON.parse(request.response));
      } else {
        options.error(request.response);
        reject(JSON.parse(request.response));
      }
    };

    request.onerror = () => reject(Error("Network Error"));

    request.send(JSON.stringify(options.data));
  });
};


$MD.mergeOptions = (base, ...otherObjs) => {
  otherObjs.forEach(obj => {
    for (let prop in obj) {
      base[prop] = obj[prop];
    }
  });
  return base;
};

//helper methods
toQueryString = obj => {
  let result = "";
  for (let prop in obj) {
    if (obj.hasOwnProperty(prop)) {
      result += prop + "=" + obj[prop] + "&";
    }
  }
  return result.substring(0, result.length - 1);
};

registerDocReadyCallback = func => {
  if (!_docReady) {
    _docReadyCallbacks.push(func);
  } else {
    func();
  }
};

getNodesFromDom = selector => {
  const nodes = document.querySelectorAll(selector);
  const nodes_array = Array.from(nodes);
  return new MutableNodeList(nodes_array);
};

document.addEventListener('DOMContentLoaded', () => {
  _docReady = true;
  _docReadyCallbacks.forEach(func => func());
});