
// loader

const regCss = /\.css(\?|$)/i;

let loader  = {};
let timeout = {};

function createLoaderPromise( file )
{
	timeout[file] = (new Date()).getTime()/1000;

	let success = [], errors = [], load = 0;
	let css = regCss.test( file );
	let script = document.createElement( css ? "link" : "script" );

	script.onload = function () {
		load = 1;
		success.forEach((call) => call());
		success = []
	};

	script.onerror = function () {
		load = 2;
		console.log("can't upload file " + file);
		errors.forEach((call) => call());
		errors = []
	};

	document.getElementsByTagName("head")[0].appendChild(script);

	if( css ) {
		script.setAttribute( "rel", "stylesheet" );
		script.setAttribute( "href", file )
	}
	else {
		script.src = file
	}

	return {

		then( callback )
		{
			if( load < 1 ) {
				success.push( callback )
			}
			else if( load === 1 ) {
				callback()
			}

			return this
		},

		catch( callback )
		{
			if( load < 1 ) {
				errors.push( callback )
			}
			else if( load === 2 ) {
				callback();
				let time = (new Date()).getTime()/1000;

				if( time - timeout[file] > 10 ) {
					setTimeout(function () {
						delete loader[file]; delete timeout[file]
					}, 1)
				}
			}

			return this
		}
	}
}

// state

export default function Load( src, success, error = false )
{
	if( typeof src == "string" ) {
		src = [src];
	}

	if( !error ) {
		error = function() {
			throw new Error("Can't upload all files")
		}
	}

	if( typeof document == "undefined" ) {
		return error()
	}

	let wait = src.length,
		err  = false,
		test = function(upload)
		{
			wait --;
			if( !upload ) {
				err = true
			}

			if( wait < 1 ) {
				err ? error() : success()
			}
		};

	if( !wait ) {
		error()
	}
	else {
		src.forEach((file) => {
			if( ! loader[file] ) {
				loader[file] = createLoaderPromise(file)
			}
			loader[file].then(() => test(true)).catch(() => test(false))
		})
	}
}