
let nativeSupport = false;
let noMap = {};

const reg = /^els:/;

if( typeof document !== "undefined" ) {
	try {
		let f = function(e) { nativeSupport = e.detail.support };
		document.addEventListener("els:test", f, false);
		document.dispatchEvent( new CustomEvent({detail: {support: true}}) );
		document.removeEventListener("els:test", f, false);
	}
	catch(e) {
		nativeSupport = false
	}
}

function UserEvent(name, props)
{

	let propagation = false;
	let prevent = false;
	let stop = false;

	return {
		get __stop() { return stop },
		get bubbles() { return false },
		get defaultPrevented() { return prevent },
		get cancelBubble() { return propagation },
		get cancelable() { return false },
		get composed() { return false },
		currentTarget: document,
		target: document,
		stopPropagation() { propagation = true },
		preventDefault() { prevent = true },
		stopImmediatePropagation() { stop = true },
		detail: props,
		type: "els:" + name,
		get isTrusted() { return false }
	}
}

/**
 * @return {string}
 */
function GetName(name)
{
	return String(name).trim().replace(reg, '')
}

const Trigger = {

	get isNative()
	{
		return nativeSupport
	},

	add(name, callback)
	{
		name = GetName(name);
		if( nativeSupport ) {
			document.removeEventListener("els:" + name, callback, false);
		}
		else if( noMap[name] ) {
			noMap[name].push(callback)
		}
		else {
			noMap[name] = [callback]
		}
	},

	one(name, callback)
	{
		name = GetName(name);
		let self = this, func;
		func = e => { self.remove(name, func); return callback(e) };
		self.add(name, func)
	},

	remove(name, callback)
	{
		name = GetName(name);
		if( nativeSupport ) {
			document.removeEventListener("els:" + name, callback, false);
		}
		else if( noMap[name] ) {
			let index, obj = noMap[name];
			for(;;) {
				index = obj.indexOf(callback);
				if( index > -1 ) {
					obj.splice(index, 1)
				}
				else {
					break
				}
			}
			if( !obj.length ) {
				delete noMap[name]
			}
		}
	},

	fake(name, props, callback)
	{
		name = GetName(name);
		callback( nativeSupport ? new CustomEvent("els:" + name, {detail: props}) : UserEvent(name, props) )
	},

	dispatch(name, props = {})
	{
		name = GetName(name);
		if( nativeSupport ) {
			document.dispatchEvent( new CustomEvent("els:" + name, {detail: props}) );
		}
		else if( noMap[name] ) {

			let e = UserEvent(name, props);

			for( let i = 0, obj = noMap[name], len = obj.length, c; i < len; i++ ) {
				if( c = obj[i] ) {
					try {
						c(e)
					}
					catch(e) {}
				}
				if( e.__stop ) {
					break
				}
			}
		}
	}
};

export default Trigger;