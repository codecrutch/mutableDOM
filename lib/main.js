const MutableNodeList = require('./mutableNodeList.js');

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