# els-js

Elastic javascript &amp; css ui package

Todo description

## Installation

install with [npm](https://www.npmjs.com/):

```bin
$ npm install els-js
```

## Base library

| Name | Type | Description |
|---|---|---|
| `Version` | Number | System version |
| `ElsJs` | Function | Function return global ElsObject |
| `Extend` | Function | Add new element to ElsObject |
| `AjaxJson` | Object | - |
| `Caller` | Object | Application callbacks |
| `Component` | Object | Work with React UI components |
| `Components` | Object | Core React UI components |
| `Cookie` | Object | - |
| `Data` | Object | - |
| `History` | Object | - |
| `HotKeys` | Object | - |
| `Load` | Function | Connecting javascript and css styles files to the page |
| `Storage` | Object | - |
| `Trigger` | Object | - |
| `Tools` | Object | - |
| `Dom` | Object | HTML Dom manipulations |

## Example

### Create & usage window ElsObject 

```js
import { Extend, ElsJs } from "els-js";

// add custom function in ElsObject
Extend("init", () => {
	// your function ...
})

window.ElsJs = ElsJs();
ElsJs.init();
```

### Dom, Cookie

```js
import { Dom, Cookie } from "els-js";

var Element = Dom.Element;

var app1 = Element.byId("app"); // document.getElementById("app")
var app2 = Element.byQuery("#app"); // document.querySelectorAll("#app")
var app3 = Element.create(); // document.createElement("div")

var app4 = Element.create({name: "span", className: "my-app", style: {display: "block"}});
// equivalent
// var app4 = document.createElement("span");
// app4.className = "my-app";
// app4.style.display = "block";

// set, get cookie
Cookie.set("myCookie", "value");
var myCookie = Cookie.get("myCookie");
```