import IsBrowser from "../tools/is-browser";

let tof = typeof Node, IsNode = () => false;

if( IsBrowser() ) {

	let isNodeNative = tof === 'object';
	if( ! isNodeNative && tof === 'function' && typeof document !== "undefined" ) {
		isNodeNative = document.createElement("span") instanceof Node;
	}

	IsNode = isNodeNative
		? object => object instanceof Node
		: object => object && typeof object === "object" && typeof object.nodeType === "number" && typeof object.nodeName === "string";
}

export default IsNode