# mutableDOM

Live demo [here][mutableDOM]!

[mutableDOM]: http://www.codecrutch.com/mutableDOM

### A simple dom manipulation library built using vanilla JavaScript.

## Features
* Select by id, class, tag
* Add and Remove Elements to page
* Add, Remove, and Toggle classes
* Traverse elements by parent and children
* Queue functions until DOM has been loaded
* Send AJAX requests, return Promises

## Getting Started
#### $MD(selector)

The $MD selector allows developers to select DOM elements by id, classname, or tagname.  The selector returns either a single element or a mutable node list of elements.  The selector can be used to chain functions together.

You can load this library by linking it to your html via a script tag.

``` html
<html>
  <head>
    <script type="text/javascript" src="../lib/mutabledom.js"></script>
  </head>
</html>
```
#
## API
Prefix commands with `$MD`
### DOM Traversal
* `forEach`
* `children`
* `parent`
### DOM Manipulation
* `html()` - get html in tag(s)
* `html(tag)` -- set html in tag(s)
* `clearHTML()` -- remove html
* `append(tag)` -- add element(s) to tag(s)
* `remove(tag)` -- remove element(s) from DOM
* `attr() attr(attr, val)` -- set or get tag attributes
* `style(attr, val)` -- set style
* `addClass("classname")` -- add css class to tag(s)
* `removeClass("classname)` -- remove certain class from tag(s)
* `toggleClass()` -- toggle class
### DOM Event Listeners
* `listen(event, action)`
* `forget(event, action)`
### Async Requests
* `promise(request)` -- use .then() for chaining on success/failure
* `getJSON(request)` -- returns request parsed into json objects

Example Request
``` js
{
    method: "GET",
    url: "http://api.icndb.com/jokes/random",
    data: { firstName: "Foobar", lastName; "Fizzbuzz" }
}
````
#
## Future Plans 