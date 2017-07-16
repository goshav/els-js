let Data = {};

import IsScalar from "./is-scalar";

class Emitter
{
	constructor(props = {})
	{
		this.reload(props)
	}

	get(name)
	{
		return this.data[name]
	}

	set(name, value, trigger = true)
	{
		let self     = this,
			data     = self.data,
			caller   = self.caller,
			triggers = self.triggers,
			scalar   = IsScalar(value);

		if( !self.getIs(name) || !scalar || !self.scalar[name] || value !== data[name] ) {
			data[name] = value;
			self.scalar[name] = scalar;

			if( trigger !== false && triggers.hasOwnProperty(name) && caller.indexOf(name) < 1 ) {
				caller.push(name);

				let evn = {
					get name() { return name },
					get value() { return data[name] }
				};

				for( let i = 0, length = triggers[name].length; i < length; i++ ) {
					triggers[name][i](evn)
				}

				let index = caller.indexOf(name);
				if( ~index ) {
					caller.splice(index, 1)
				}
			}
		}

		return self;
	}

	getIs(name)
	{
		return this.data.hasOwnProperty(name)
	}

	remove(name)
	{
		if( this.getIs(name) ) {
			delete this.data[name]
		}
		return this;
	}

	trigger(name, callback)
	{
		let triggers = this.triggers;
		if( ! triggers.hasOwnProperty(name) ) {
			Object.defineProperty(triggers, name, { value: [] })
		}
		triggers[name].push(callback);
		return this
	}

	off(name, callback)
	{
		let triggers = this.triggers;
		if( triggers.hasOwnProperty(name) ) {
			for(let items = triggers[name], index;;) {
				index = items.indexOf(callback);
				if( index > -1 ) {
					items.splice(index, 1)
				}
				else {
					break
				}
			}
			if( !triggers[name].length ) {
				delete triggers[name]
			}
		}
		return this
	}

	getData()
	{
		return this.data
	}

	clear()
	{
		this.reload()
	}

	reload(props = {})
	{
		this.data = props;
		this.triggers = {};
		this.scalar = {};
		this.caller = [];
	}

	/**
	 *
	 * @param name
	 * @returns {Emitter}
	 */
	static ready(name)
	{
		if( name instanceof Emitter ) {
			return name
		}
		if( ! Data.hasOwnProperty(name) ) {
			Object.defineProperty(Data, name, {
				value: new Emitter(),
				configurable: false,
				writable: false
			})
		}
		return Data[name]
	}
}

export default Emitter;