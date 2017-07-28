let isNode = (new Function("try{return this===global}catch(e){return false}"))();

if( !isNode ) {
	isNode = !! (typeof module !== 'undefined' && module.exports)
}

export default function () {
	return isNode
}