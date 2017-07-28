import IsBrowser from "./tools/is-browser";

const isWin = IsBrowser();
const supportSearchParams = isWin && 'URLSearchParams' in window;
const supportArrayBuffer  = isWin && 'ArrayBuffer' in window;

class AjaxJsonError extends Error
{
	constructor(message, name, code) {
		super(message);
		this.name = name;
		this.code = code;
	}
}

if (supportArrayBuffer) {
	const viewClasses = [
		'[object Int8Array]',
		'[object Uint8Array]',
		'[object Uint8ClampedArray]',
		'[object Int16Array]',
		'[object Uint16Array]',
		'[object Int32Array]',
		'[object Uint32Array]',
		'[object Float32Array]',
		'[object Float64Array]'
	];

	var isArrayBufferView = ArrayBuffer.isView || function(obj) { return obj && viewClasses.indexOf(Object.prototype.toString.call(obj)) > -1 }
}

function makeQueryValue(name, value, isArray)
{
	if( value === null || value === undefined ) {
		value = ''
	}
	else if( typeof value === 'boolean' ) {
		value = value ? '1' : '0'
	}

	if( isArray ) {
		name += '[]'
	}
	else {
		name = encodeURIComponent(name);
		if( Array.isArray(value) ) {
			name = value.map(val => makeQueryValue(name, val, true)).join('&')
		}
		else if( value ) {
			name += '=' + encodeURIComponent(String(value))
		}
	}

	return name
}

function makeQuery( data )
{
	return Object.keys(data).map(name => makeQueryValue(name, data[name], false)).join('&');
}

function makeForm( data )
{
	let value;
	let form = new FormData();
	let json = [];

	Object.keys(data).forEach((name) => {

		value = data[name];
		if( value === null || value === undefined ) {
			value = ''
		}
		else if( typeof value === 'object' ) { // array too
			// TODO add file
			json.push(name);
			value = JSON.stringify(value);
		}
		else if( typeof value === 'boolean' ) {
			value = value ? '1' : '0'
		}
		else {
			value = String( value )
		}

		form.append(name, value)
	});

	if( json.length ) {
		form.append('__json', json)
	}

	return form;
}

function normalizeName(name) {
	if (typeof name !== 'string') {
		name = String(name)
	}
	if (/[^a-z0-9\-#$%&'*+.\^_`|~]/i.test(name)) {
		throw new AjaxJsonError('Invalid character in header field name', 'argument', 200)
	}
	return name.toLowerCase()
}

function normalizeValue(value) {
	if (typeof value !== 'string') {
		value = String(value)
	}
	return value
}

// Build a destructive iterator for the value list
function iteratorFor(items) {
	return {
		next: function() {
			var value = items.shift();
			return {done: value === undefined, value: value}
		}
	};
}

function Headers(headers) {
	this.map = {};

	if (headers instanceof Headers) {
		headers.forEach(function(value, name) {
			this.append(name, value)
		}, this)

	} else if (headers) {
		Object.getOwnPropertyNames(headers).forEach(function(name) {
			this.append(name, headers[name])
		}, this)
	}
}

Headers.prototype.append = function(name, value) {
	name = normalizeName(name);
	value = normalizeValue(value);
	var oldValue = this.map[name];
	this.map[name] = oldValue ? oldValue+','+value : value
};

Headers.prototype['delete'] = function(name) {
	delete this.map[normalizeName(name)]
};

Headers.prototype.get = function(name) {
	name = normalizeName(name);
	return this.has(name) ? this.map[name] : null
};

Headers.prototype.has = function(name) {
	return this.map.hasOwnProperty(normalizeName(name))
};

Headers.prototype.set = function(name, value) {
	this.map[normalizeName(name)] = normalizeValue(value)
};

Headers.prototype.forEach = function(callback, thisArg) {
	for (var name in this.map) {
		if (this.map.hasOwnProperty(name)) {
			callback.call(thisArg, this.map[name], name, this)
		}
	}
};

Headers.prototype.keys = function() {
	var items = [];
	this.forEach(function(value, name) { items.push(name) });
	return iteratorFor(items)
};

Headers.prototype.values = function() {
	var items = [];
	this.forEach(function(value) { items.push(value) });
	return iteratorFor(items)
};

Headers.prototype.entries = function() {
	var items = [];
	this.forEach(function(value, name) { items.push([name, value]) });
	return iteratorFor(items)
};

function consumed(body) {
	if (body.bodyUsed) {
		return Promise.reject(new AjaxJsonError('Already read', 'argument', 201))
	}
	body.bodyUsed = true
}

function readArrayBufferAsText(buf) {
	var view = new Uint8Array(buf);
	var chars = new Array(view.length);

	for (var i = 0; i < view.length; i++) {
		chars[i] = String.fromCharCode(view[i])
	}
	return chars.join('')
}

function bufferClone(buf) {
	if (buf.slice) {
		return buf.slice(0)
	} else {
		var view = new Uint8Array(buf.byteLength);
		view.set(new Uint8Array(buf));
		return view.buffer
	}
}

function Body() {
	this.bodyUsed = false;

	this._initBody = function(body) {
		this._bodyInit = body;
		if (!body) {
			this._bodyText = ''
		} else if (typeof body === 'string') {
			this._bodyText = body
		} else if (supportSearchParams && URLSearchParams.prototype.isPrototypeOf(body)) {
			this._bodyText = body.toString()
		} else if (supportArrayBuffer && (ArrayBuffer.prototype.isPrototypeOf(body) || isArrayBufferView(body))) {
			this._bodyArrayBuffer = bufferClone(body)
		} else if(FormData.prototype.isPrototypeOf(body)) {
			this._bodyFormData = body
		} else {
			throw new Error('unsupported BodyInit type')
		}

		if (!this.headers.get('content-type')) {
			if (typeof body === 'string') {
				this.headers.set('content-type', 'text/plain;charset=UTF-8')
			} else if (supportSearchParams && URLSearchParams.prototype.isPrototypeOf(body)) {
				this.headers.set('content-type', 'application/x-www-form-urlencoded;charset=UTF-8')
			}
		}
	};

	this.text = function() {
		var rejected = consumed(this);
		if (rejected) {
			return rejected
		}

		if (this._bodyArrayBuffer) {
			return Promise.resolve(readArrayBufferAsText(this._bodyArrayBuffer))
		} else {
			return Promise.resolve(this._bodyText)
		}
	};

	this.json = function() {
		return this.text().then(JSON.parse)
	};

	return this
}

// HTTP methods whose capitalization should be normalized
const methods = ['DELETE', 'GET', 'HEAD', 'OPTIONS', 'POST', 'PUT'];

function normalizeMethod(method)
{
	var upcased = method.toUpperCase();
	return (methods.indexOf(upcased) > -1) ? upcased : method
}

function Request(input, options)
{
	options = options || {};
	var body = options.body;

	if (input instanceof Request) {
		if (input.bodyUsed) {
			throw new AjaxJsonError('Already read', 'argument', 201)
		}
		this.url = input.url;
		this.credentials = input.credentials;
		if (!options.headers) {
			this.headers = new Headers(input.headers)
		}
		this.method = input.method;
		this.mode = input.mode;
		if (!body && input._bodyInit != null) {
			body = input._bodyInit;
			input.bodyUsed = true
		}
	} else {
		this.url = String(input)
	}

	this.credentials = options.credentials || this.credentials || 'omit';
	if (options.headers || !this.headers) {
		this.headers = new Headers(options.headers)
	}
	this.method = normalizeMethod(options.method || this.method || 'GET');
	this.mode = options.mode || this.mode || null;
	this.referrer = null;
	this.timeout = null;

	if (typeof input.timeout == "number" && input.timeout > 0) {
		this.timeout = input.timeout;
	}

	if( body ) {
		let object = typeof body === "object";
		if( object && this.method === 'GET' ) {
			this.url += (~this.url.indexOf('?') ? '&' : '?') + makeQuery(body);
			body = null
		}
		else if ( this.method === 'GET' || this.method === 'HEAD' ) {
			throw new AjaxJsonError('Body not allowed for GET or HEAD requests', 'argument', 200)
		}
		else if(this.method === 'POST' && object ) {
			body = makeForm(body)
		}
	}

	this._initBody(body)
}

Request.prototype.clone = function()
{
	return new Request(this, { body: this._bodyInit })
};

function parseHeaders(rawHeaders)
{
	var headers = new Headers();
	rawHeaders.split(/\r?\n/).forEach(function(line) {
		var parts = line.split(':');
		var key = parts.shift().trim();
		if (key) {
			var value = parts.join(':').trim();
			headers.append(key, value)
		}
	});
	return headers
}

Body.call(Request.prototype);

function Response(bodyInit, options)
{
	if (!options) {
		options = {}
	}

	this.type = 'default';
	this.status = 'status' in options ? options.status : 200;
	this.ok = this.status >= 200 && this.status < 300;
	this.statusText = 'statusText' in options ? options.statusText : 'OK';
	this.headers = new Headers(options.headers);
	this.url = options.url || '';
	this._initBody(bodyInit)
}

Body.call(Response.prototype);

Response.prototype.clone = function()
{
	return new Response(this._bodyInit, {
		status: this.status,
		statusText: this.statusText,
		headers: new Headers(this.headers),
		url: this.url
	})
};

Response.error = function()
{
	var response = new Response(null, {status: 0, statusText: ''});
	response.type = 'error';
	return response
};

const redirectStatuses = [301, 302, 303, 307, 308];

Response.redirect = function(url, status)
{
	if (redirectStatuses.indexOf(status) === -1) {
		throw new RangeError('Invalid status code')
	}

	return new Response(null, {status: status, headers: {location: url}})
};

let queryStatus = 'complete';
let xhr;
let error;

let TriggerOnUrl = url => String(url);
let TriggerOnComplete = json => json;

const AjaxJson =
{
	set onUrl( trigger ) { if( typeof trigger === "function" ) TriggerOnUrl = trigger },
	set onComplete( trigger ) { if( typeof trigger === "function" ) TriggerOnComplete = trigger },

	get onUrl() { return TriggerOnUrl },
	get onComplete() { return TriggerOnComplete },

	abort()
	{
		if( queryStatus === 'progress' ) {
			queryStatus = 'abort';
			xhr.abort();
			xhr = error = null;
		}
		return this
	},

	get completed()
	{
		return queryStatus !== 'progress'
	},

	get status()
	{
		return queryStatus
	},

	query(input, init)
	{
		input = TriggerOnUrl(input);

		if( queryStatus === 'progress' ) {
			let e = error || function (e) { throw e };
			this.abort();
			e( new AjaxJsonError('User aborted', 'abort', 3) )
		}

		var request = new Request(input, init);
		xhr = new XMLHttpRequest();
		queryStatus = 'open';

		return new Promise((_resolve, _reject) => {

			let reject = error => {
				if( queryStatus === 'progress' ) queryStatus = 'failure';
				_reject(error)
			};

			let resolve = result => {
				queryStatus = 'success';
				try {
					result = TriggerOnComplete(result);
				}
				catch(err) {
					return _reject(err)
				}
				_resolve(result)
			};

			xhr.onload = function() {

				let options = {
					status: xhr.status,
					statusText: xhr.statusText,
					headers: parseHeaders(xhr.getAllResponseHeaders() || '')
				};

				options.url = 'responseURL' in xhr ? xhr.responseURL : options.headers.get('X-Request-URL');
				var body = 'response' in xhr ? xhr.response : xhr.responseText;

				(new Response(body, options))
					.json()
					.then(resolve)
					.catch(() => {
						reject(new AjaxJsonError('Unknown server answer [invalid JSON]', 'json', 100))
					})
			};

			xhr.onerror = function() {
				reject(new AjaxJsonError('Network request failed', 'network', 1))
			};

			xhr.ontimeout = function() {
				reject(new AjaxJsonError('Network request failed', 'timeout', 2))
			};

			xhr.open(request.method, request.url, true);

			if (request.credentials === 'include') {
				xhr.withCredentials = true
			}

			if (request.timeout > 0) {
				xhr.timeout = request.timeout;
			}

			request.headers.forEach((value, name) => {
				xhr.setRequestHeader(name, value)
			});

			queryStatus = 'progress';
			error = reject;
			xhr.send(typeof request._bodyInit === 'undefined' ? null : request._bodyInit)
		})
	}
};

export default AjaxJson;
