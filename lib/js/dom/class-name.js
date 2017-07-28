import Collection from "./collection";

const reg = /^([+\-?!~:])(.+?)$/;
const regSplit = /\s+/g;

let native = false;
let lastCurrent;
let lastCurrentIndex;

if( typeof document !== "undefined" ) {
	try {
		let e = document.createElement("span"), cl = e.classList || null;

		if( cl ) {
			e.className = "a";
			try {
				cl.remove("a");
				cl.add("b");
				native = ! cl.contains("a") && cl.contains("b")
			}
			catch (e) {}
		}
	}
	catch(er) {}
}

function getName(name)
{
	return name === undefined || name === null ? "" : String(name).trim()
}

// no native

function contains(e, name)
{
	lastCurrent = e.className ? getName(e.className).split(regSplit) : [];
	lastCurrentIndex = lastCurrent.length ? lastCurrent.indexOf(name) : -1;
	return lastCurrentIndex > -1;
}

function addClass(e, name)
{
	lastCurrent.push(name);
	e.className = lastCurrent.join(" ")
}

function removeClass(e)
{
	if( lastCurrent.length > 1 ) {
		lastCurrent.splice(lastCurrentIndex, 1);
		e.className = lastCurrent.join(" ")
	}
	else {
		e.className = "";
	}
}

// for remap

function CollectionSet(e, name)
{
	e.className = name.length == 1 ? name[0] : name.join(" ")
}

function CollectionAdd(e, name)
{
	for(let i = 0, length = name.length; i < length; i++) {
		if( native ) {
			e.classList.add(name[i])
		}
		else if( !contains(e, name[i]) ) {
			addClass(e, name[i])
		}
	}
}

function CollectionRemove(e, name)
{
	for(let i = 0, length = name.length; i < length; i++) {
		if( native ) {
			e.classList.remove(name[i])
		}
		else if( contains(e, name[i]) ) {
			removeClass(e, name[i])
		}
	}
}

function CollectionToggle(e, name)
{
	for(let i = 0, length = name.length; i < length; i++) {
		if( native ) {
			e.classList.toggle(name[i])
		}
		else if( contains(e, name[i]) ) {
			removeClass(e, name[i])
		}
		else {
			addClass(e, name[i])
		}
	}
}

/**
 * @return {boolean}
 */
function CollectionContains(e, name)
{
	for( let i = 0, length = name.length; i < length; i++ ) {
		if( !( native ? e.classList.contains(name[i]) : contains(e, name[i]) ) ) return false
	}
	return true
}

// map callback

function map(callback, lst, name, ignoreName = false)
{
	lst = Collection(lst, false);
	if(lst) {
		name = getName(name);
		if(name || ignoreName) {
			name = name.split(regSplit);
			for(let i = 0, length = lst.length; i < length; i++) {
				callback(lst[i], name)
			}
		}
	}
}

function mapResult(callback, lst, name, result)
{
	lst = Collection(lst, false);
	if(lst) {
		name = getName(name);
		if(name) {
			name = name.split(regSplit);
			for(let i = 0, length = lst.length; i < length; i++) {
				if( callback(lst[i], name) != result ) {
					return false
				}
			}
			return true
		}
	}
	return false
}

export default
{
	set(e, name)
	{
		map(CollectionSet, e, name, true);
		return this
	},

	add(e, name)
	{
		map(CollectionAdd, e, name);
		return this
	},

	remove(e, name)
	{
		map(CollectionRemove, e, name);
		return this
	},

	toggle(e, name)
	{
		map(CollectionToggle, e, name);
		return this
	},

	has(e, name, callback = null)
	{
		let result = mapResult(CollectionContains, e, name, true);
		result && callback && callback(e);
		return result
	},

	not(e, name, callback = null)
	{
		let result = mapResult(CollectionContains, e, name, false);
		result && callback && callback(e);
		return result
	},

	dispatch(e, value, callback = null)
	{
		let m = String(value).match(reg), self = this;
		if(m) {
			value = m[2];
			switch(m[1]) {
				case '+': return self.add(e, value);
				case '-': return self.remove(e, value);
				case '~': return self.toggle(e, value);
				case '!': return self.not(e, value, callback);
				case '?': return self.has(e, value, callback);
				case ':': return self.set(e, value);
			}
		}
		return self;
	}
}
