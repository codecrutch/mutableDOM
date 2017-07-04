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

  empty() {
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
    for (let i = 0; i < this.elements.length; i++) {
      console.log(this.elements[i].parentNode);
      if (this.elements[i].parentNode) {
        nodesList.push(this.elements[i].parentNode);
      }
    }

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

  on(eventName, callback) {
   this.forEach(node => {
     node.addEventListener(eventName, callback);
     const eventKey = `mutableEvent-${eventName}`;
     if (typeof node[eventKey] === "undefined") {
       node[eventKey] = [];
     }
     node[eventKey].push(callback);
   });
  }

  off(eventName) {
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

Window.prototype.$MD = function(selector) {

  const queue = [];

  if (typeof selector === 'function') {
    queue.push(selector);
  }

  document.addEventListener("DOMContentLoaded", function(event) {
    queue.forEach( func => func());
  });

  if (typeof selector === 'string') {
    let nodes = document.querySelectorAll(selector);
    return new MutableNodeList(Array.from(nodes));
  } else if (selector instanceof HTMLElement) {
    return new MutableNodeList([selector]);
  }
};

$MD.ajax = function(options) {
  console.log('AJAX REQUEST SENT');
};

$MD.extend = function(...objects) {
  return Object.assign(...objects);
};


$MD( () => {
});

/***/ })
/******/ ]);
//# sourceMappingURL=mutabledom.js.map