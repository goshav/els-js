let isBrowser = (new Function("try{return this===window}catch(e){return false}"))();

export default function () {
	return isBrowser
}