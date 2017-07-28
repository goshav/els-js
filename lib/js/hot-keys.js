// hot-keys

if( typeof window !== "undefined" ) {
	window.addEventListener('keydown', keyDown, false);
}

let codes = {8:"back_space",9:"tab",12:"clear",13:"enter",14:"enter_special",16:"shift",17:"control",18:"alt",19:"pause",20:"caps_lock",21:"kana",22:"eisu",23:"junja",24:"final",25:"hanja",27:"escape",28:"convert",29:"nonconvert",30:"accept",31:"modechange",32:"space",33:"page_up",34:"page_down",35:"end",36:"home",37:"left",38:"up",39:"right",40:"down",41:"select",42:"print",43:"execute",44:"printscreen",45:"insert",46:"delete",48:"0",49:"1",50:"2",51:"3",52:"4",53:"5",54:"6",55:"7",56:"8",57:"9",58:"colon",59:"semicolon",60:"less_than",61:"equals",62:"greater_than",63:"question_mark",64:"at",65:"a",66:"b",67:"c",68:"d",69:"e",70:"f",71:"g",72:"h",73:"i",74:"j",75:"k",76:"l",77:"m",78:"n",79:"o",80:"p",81:"q",82:"r",83:"s",84:"t",85:"u",86:"v",87:"w",88:"x",89:"y",90:"z",91:"os_key",93:"context_menu",95:"sleep",96:"num0",97:"num1",98:"num2",99:"num3",100:"num4",101:"num5",102:"num6",103:"num7",104:"num8",105:"num9",106:"multiply",107:"add",108:"separator",109:"subtract",110:"decimal",111:"divide",112:"f1",113:"f2",114:"f3",115:"f4",116:"f5",117:"f6",118:"f7",119:"f8",120:"f9",121:"f10",122:"f11",123:"f12",124:"f13",125:"f14",126:"f15",127:"f16",128:"f17",129:"f18",130:"f19",131:"f20",132:"f21",133:"f22",134:"f23",135:"f24",144:"num_lock",145:"scroll_lock",160:"circumflex",161:"exclamation",162:"double_quote",163:"hash",164:"dollar",165:"percent",166:"ampersand",167:"underscore",168:"open_paren",169:"close_paren",170:"asterisk",171:"plus",172:"pipe",173:"hyphen_minus",174:"open_curly_bracket",175:"close_curly_bracket",176:"tilde",186:"semicolon",187:"equals",188:"comma",189:"minus",190:"period",191:"slash",192:"back_quote",219:"open_bracket",220:"back_slash",221:"close_bracket",222:"quote",224:"meta",225:"altgr"};
let standart = {'save': 'control+s', 'apply': 'shift+control+s', 'back': 'escape', 'esc': 'escape', 'search': 'control+f', 'help': 'control+h'};
let register = {};
let names = {};
let index = 1;

function keyDown(e)
{
	let code = ( e.which || e.keyCode ), key;
	if( code && codes[code] ) {
		key = codes[code];
		if( e.altKey )      key = 'alt+' + key;
		if( e.shiftKey )    key = 'shift+' + key;
		if( e.ctrlKey )     key = 'control+' + key;

		if( register[key] ) {
			register[key][0].event();
			e.preventDefault();
			e.stopPropagation();
			return false
		}
	}
}

export default {

	bind(key, event)
	{
		key = String(key).toLowerCase();
		if( standart[key] ) key = standart[key];
		if( !register[key] ) register[key] = [];
		names[index] = key;
		register[key].unshift({ index: index, event: event });
		return index++;
	},

	remove(key)
	{
		key = String(key).toLowerCase();
		if( standart[key] ) key = standart[key];
		if( register[key] ) {
			register[key].forEach((e) => { delete names[e.index] });
			delete register[key]
		}
	},

	unbind(index)
	{
		let key = names[index] || null;
		if(key) {
			if( register[key] ) {
				for( let i = 0; i < register[key].length; i++ ) {
					if( register[key][i].index == index ) {
						register[key].splice( i, 1 ); break
					}
				}
				if( !register[key].length ) {
					delete register[key]
				}
			}
			delete names[index]
		}
	}
}