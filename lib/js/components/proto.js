import React from "react";
import Caller from "../caller";

const regLTrim = /^\s+/;
const docFocus = typeof document !== "undefined" && 'hasFocus' in document;

const Intents = ['default', 'primary', 'success', 'danger'];
const Dimensions = ['lg', 'sm', 'xs'];

let Properties = {};
let Events = {};
let HtmlBlockNames = {};

("accept,acceptCharset,accessKey,action,allowFullScreen,allowTransparency,alt,as,async,autoComplete,autoPlay,capture,cellPadding,cellSpacing,charSet,challenge,checked,cite,classID,className,cols,colSpan,content,contentEditable,contextMenu,controls,coords,crossOrigin,data,dateTime,default,defer,dir,disabled,download,draggable,encType,form,formAction,formEncType,formMethod,formNoValidate,formTarget,frameBorder,headers,height,hidden,high,href,hrefLang,htmlFor,httpEquiv,icon,id,inputMode,integrity,is,keyParams,keyType,kind,label,lang,list,loop,low,manifest,marginHeight,marginWidth,max,maxLength,media,mediaGroup,method,min,minLength,multiple,muted,name,nonce,noValidate,open,optimum,pattern,placeholder,playsInline,poster,preload,profile,radioGroup,readOnly,referrerPolicy,rel,required,reversed,role,rows,rowSpan,sandbox,scope,scoped,scrolling,seamless,selected,shape,size,sizes,span,spellCheck,src,srcDoc,srcLang,srcSet,start,step,style,summary,tabIndex,target,title,type,useMap,value,width,wmode,wrap,about,datatype,inlist,prefix,property,resource,typeof,vocab,autoCapitalize,autoCorrect,autoSave,color,itemProp,itemScope,itemType,itemID,itemRef,results,security,unselectable,class,for")
	.split(",")
	.forEach(name => Properties[name] = true);

("Abort,CanPlay,CanPlayThrough,DurationChange,Emptied,Encrypted,Ended,Error,Input,Invalid,Load,LoadedData,LoadedMetadata,LoadStart,Pause,Play,Playing,Progress,RateChange,Reset,Seeked,Seeking,Stalled,Submit,Suspend,TimeUpdate,VolumeChange,Waiting,KeyPress,KeyDown,KeyUp,Blur,Focus,Click,DoubleClick,MouseDown,MouseMove,MouseUp,MouseOut,MouseOver,ContextMenu,Drag,DragEnd,DragEnter,DragExit,DragLeave,DragOver,DragStart,Drop,TouchCancel,TouchEnd,TouchMove,TouchStart,AnimationEnd,AnimationIteration,AnimationStart,TransitionEnd,Scroll,Wheel,Copy,Cut,Paste,Change,CompositionEnd,CompositionStart,CompositionUpdate,SelectionChange,TextInput")
	.split(",")
	.forEach(name => Events['on'+name] = true);

('div,form,figure,blockquote,pre,p,h1,h2,h3,h4,h5,h6,address,article,aside,figure,footer,header,section,fieldset,figcaption,output,ul,ol,li,dd,dl,nav,hgroup,table,tfoot,thead,tbody,tr,th,td')
	.split(',')
	.forEach(name => HtmlBlockNames[name] = true);
//

function MergeClassName( props, className )
{
	if( Array.isArray(className) ) {
		className = className.join(" ")
	}

	if( !props.className ) {
		props.className = className
	}
	else {
		props.className = (props.className + " " + className).replace(regLTrim, '')
	}

	return props
}

function AssignSelect( toObj, fromObj, names )
{
	names.forEach(name => {
		if( fromObj[name] !== undefined ) {
			toObj[name] = fromObj[name]
		}
	});
	return toObj
}

function FilterState(props, def = {})
{
	Object.keys(props).forEach(name => {
		if( !Properties[name] && !Events[name] ) {
			def[name] = props[name];
		}
	});
	return def
}

function FilterProps(props, def = {}, ignore = [])
{
	let isIgnore = ignore.length > 0;
	Object.keys(props).forEach(name => {

		if( isIgnore && ~ ignore[name] ) {
			return
		}

		if( Events[name] ) {
			let value = props[name];

			if( typeof value === 'string' || Array.isArray(value) ) {
				def[name] = e => Caller.dispatch( value, e )
			}
			else {
				def[name] = value
			}
		}

		else if( Properties[name] ) {
			def[name] = props[name]
		}
	});

	return def
}

function Blur(props = {})
{
	if( docFocus && document.hasFocus() ) {

		let focus, timeout = 45;
		if( typeof props.timeout == "number" && !isNaN(props.timeout) && isFinite(props.timeout) && props.timeout > -1 ) {
			timeout = props.timeout
		}

		setTimeout(() => {
			focus = document.activeElement;
			if( focus ) {
				if( props.closest ) {
					focus = focus.closest(props.closest)
				}
				if( focus && props.not && focus.closest(props.not) ) {
					focus = false
				}
				if( focus ) {
					try { focus.blur() } catch (e) {}
				}
			}
		}, timeout)
	}
}

class InputDriver
{
	valid(value)
	{
		return true
	}

	filter(value)
	{
		return value
	}
}

class Proto extends React.Component
{
	constructor(props)
	{
		super(props);
		this.state = Object.assign({}, props)
	}

	componentWillReceiveProps(props)
	{
		this.setState(props)
	}
}

export { Intents, Dimensions, HtmlBlockNames, MergeClassName, AssignSelect, FilterState, FilterProps, Blur, InputDriver, Proto };