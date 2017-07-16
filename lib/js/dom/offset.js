import Page from "./page";

let offset;

if( typeof document !== "undefined" && document.createElement("span").getBoundingClientRect ) {

	offset = function(element, fixed = false)
	{
		let box = element.getBoundingClientRect(),
			ref = {
				top:    Math.round( box.top ),
				left:   Math.round( box.left ),
				width:  box.right  - box.left,
				height: box.bottom - box.top
			};

		if( !fixed ) {
			ref.top  += Page.top;
			ref.left += Page.left;
		}

		return ref
	}
}
else {

	offset = function(element, fixed = false)
	{
		var top = 0, left = 0;

		while(element) {
			top  += element.offsetTop;
			left += element.offsetLeft;
			element = element.offsetParent
		}

		if( fixed ) {
			top  -= Page.top;
			left -= Page.left;
		}

		return {
			top:    Math.round(top),
			left:   Math.round(left),
			width:  element.offsetWidth,
			height: element.offsetHeight
		}
	}
}

export default function (element, fixed = false) {
	if( element && element.nodeType == 1 ) {
		return offset(element, fixed)
	}
	else {
		return {
			width: 0, height: 0, top: 0, left: 0
		}
	}
}