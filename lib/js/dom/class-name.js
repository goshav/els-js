
const reg = /^([+\-?!~:])(.+?)$/;
const regSplit = /\s+/;

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

function check(e)
{
	if( native ) {
		return e && e.classList && e.nodeType === 1
	}
	else {
		return e && e.nodeType === 1
	}
}

function checkGetName(e, name)
{
	return check(e) ? getName(name) : false;
}

function getName(name)
{
	return String(name).trim()
}

// no native

function contains(e, name)
{
	lastCurrent = e.className ? getName(name).split(regSplit) : [];
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

export default
{
	set(e, name)
	{
		if( check(e) ) {
			e.className = name === undefined || name === null ? "" : getName(name)
		}
		return this
	},

	add(e, name)
	{
		name = checkGetName(e, name);
		if( name ) {
			if( native ) {
				e.classList.add(name)
			}
			else if( !contains(e, name) ) {
				addClass(e, name)
			}
		}
		return this
	},

	remove(e, name)
	{
		name = checkGetName(e, name);
		if( name ) {
			if( native ) {
				e.classList.remove(name)
			}
			else if( contains(e, name) ) {
				removeClass(e)
			}
		}
		return this
	},

	toggle(e, name)
	{
		name = checkGetName(e, name);
		if( name ) {
			if( native ) {
				e.classList.toggle(name)
			}
			else if( contains(e, name) ) {
				removeClass(e)
			}
			else {
				addClass(e.name)
			}
		}
		return this
	},

	has(e, name, callback = null)
	{
		let result = false;
		name = checkGetName(e, name);
		if( name ) {
			result = native ? e.classList.contains(name) : contains(e, name);
			if( result && callback ) {
				callback(e)
			}
		}
		return result
	},

	not(e, name, callback = null)
	{
		let result = false;
		name = checkGetName(e, name);
		if( name ) {
			result = ! (native ? e.classList.contains(name) : contains(e, name));
			if( result && callback ) {
				callback(e)
			}
		}
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