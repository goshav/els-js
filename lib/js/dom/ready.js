
let docIsReady = false;
let docCall = [];

function docLoad()
{
	if( !docIsReady ) {
		detach();
		docIsReady = true
	}

	for( let i = 0, len = docCall.length; i < len; i++ ) {
		try {
			docCall[i]()
		}
		catch(e) { console.log("Fatal ready callback error", e) }
	}

	docCall = []
}

function detach()
{
	if ( document.addEventListener ) {
		document.removeEventListener( "DOMContentLoaded", docLoad );
		window.removeEventListener( "load", docLoad );
	}
	else {
		document.detachEvent( "onreadystatechange", docLoad );
		window.detachEvent( "onload", docLoad );
	}
}

if( typeof window !== "undefined" && typeof document !== "undefined" )
{
	if( document.readyState === "complete" || ( document.readyState !== "loading" && ! document.documentElement.doScroll ) ) {
		setTimeout( docLoad, 0 )
	}

	else if ( document.addEventListener ) {
		document.addEventListener( "DOMContentLoaded", docLoad );
		window.addEventListener( "load", docLoad )
	}

	else {
		document.attachEvent( "onreadystatechange", docLoad );
		window.attachEvent( "onload", docLoad );

		// If IE and not a frame
		// continually check to see if the document is ready
		let top = false;

		try {
			top = window.frameElement == null && document.documentElement;
		} catch ( e ) {}

		if ( top && top.doScroll ) {
			( function doScrollCheck() {
				if ( !docIsReady ) {

					try { top.doScroll( "left" ); }
					catch ( e ) { return window.setTimeout( doScrollCheck, 50 ) }

					docLoad();
				}
			} )();
		}
	}
}

export default function( callback )
{
	if( docIsReady ) setTimeout( callback, 0 );
	else docCall.push( callback )
}