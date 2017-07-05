/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 1);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

class MutableNodeList {
  constructor(elements) {
    this.elements = elements;
  }

  html(html) {
    if (typeof html === "string") {
      this.forEach(node => node.innerHTML = html);
    } else {
      if (this.elements.length > 0) {
        return this.elements[0].innerHTML;
      }
    }
  }

  clearHTML() {
    this.html('');
  }

  append(children) {
    if (this.elements.length === 0) return;

    // ensure argument is coerced into MutableNodeList
    if (typeof children === 'object' && !(children instanceof MutableNodeList)) {
      children = $MD(children);
    }

    if (typeof children === "string") {
      this.forEach(node => node.innerHTML += children);
    } else if (children instanceof MutableNodeList) {
      // You can't append the same child node to multiple parents,
      // so we must duplicate the child nodes here.
      this.forEach(node => {
        // The argument to cloneNode indicates whether or not
        // all children should be cloned.
        children.forEach(childNode => {
          node.appendChild(childNode.cloneNode(true));
        });
      });
    }
  }

  attr(attribute, val) {
    if (val === undefined) {
      return this.elements[0].getAttribute(attribute);
    } else {
      for (var i = 0; i < this.elements.length; i++) {
        this.elements[i].setAttribute(attribute, val);
      }
    }
  }

  addClass(klass) {
    for (var i = 0; i < this.elements.length; i++) {
      this.elements[i].classList.add(klass);
    }
  }

  removeClass(klass) {
    for (var i = 0; i < this.elements.length; i++) {
      this.elements[i].classList.remove(klass);
    }
  }

  toggleClass(klass) {
    for (var i = 0; i < this.elements.length; i++) {
      this.elements[i].classList.toggle(klass);
    }
  }

  // TRAVERSAL

  children() {
    let nodesList = [];
    for (let i = 0; i < this.elements.length; i++) {
      if (this.elements[i].children) {
        nodesList.push(this.elements[i].children);
      }
    }

    return new MutableNodeList(Array.from(nodesList[0]));
  }

  parent() {
    let nodesList = [];
    this.forEach(({ parentNode }) => (
      parentNode.visited ? parentNodes.push(parentNode) : parentNode.visited = true
    ));

    parentNodes.forEach(node => node.visited = false)

    return new MutableNodeList(nodesList);
  }

  find(selector) {
    let nodesList = [];
    for (var i = 0; i < this.elements.length; i++) {
      let child = this.elements[i].querySelectorAll(selector);
      if (child.length > 0) nodesList.push(child);
    }

    return new MutableNodeList(Array.from(nodesList[0]));
  }

  remove() {
    for (var i = 0; i < this.elements.length; i++) {
      this.elements[i].parentNode.removeChild(this.elements[i]);
    }

    this.elements = new MutableNodeList();
  }

  listen(eventName, callback) {
    this.forEach(node => {
      node.addEventListener(eventName, callback);
      const eventKey = `mutableEvent-${eventName}`;
      if (typeof node[eventKey] === "undefined") {
        node[eventKey] = [];
      }
      node[eventKey].push(callback);
    });
  }

  forget(eventName) {
    this.forEach(node => {
      const eventKey = `mutableEvent-${eventName}`;
      if (node[eventKey]) {
        node[eventKey].forEach(callback => {
          node.removeEventListener(eventName, callback);
        });
      }
      node[eventKey] = [];
    });
  }

  forEach(cb) {
    this.elements.forEach(cb);
  }
}

module.exports = MutableNodeList;

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

const MutableNodeList = __webpack_require__(0);

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

/***/ })
/******/ ]);
//# sourceMappingURL=mutabledom.js.map