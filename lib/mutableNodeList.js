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
}

module.exports = MutableNodeList;