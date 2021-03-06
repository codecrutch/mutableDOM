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

  style(attr, val) {
    this.forEach(el => {
      el.style[attr] = val;
    })
  }

  forEach(cb) {
    this.elements.forEach(cb);
  }
}

module.exports = MutableNodeList;