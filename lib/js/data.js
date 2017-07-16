import Trigger from "./trigger";

let DataState = {};
let DataScalar = {};
let DispatchName = [];

const Scalar = ["number", "string", "boolean"];

function isScalar( value )
{
	return value === null || ~ Scalar.indexOf( typeof value )
}

const Data = {

	set(name, value)
	{
		if( value === undefined ) {
			this.destroy(name, value)
		}
		else {
			let scalar = isScalar(value);
			if( !this.getIs(name) || !scalar || !DataScalar[name] || value !== DataState[name] ) {
				DataState[name] = value;
				DataScalar[name] = scalar;

				if( DispatchName.indexOf( name ) < 1 ) {
					DispatchName.push(name);

					Trigger.dispatch('ChangeValue', {
						get name() { return name },
						get value() { return DataState[name] }
					});

					let index = DispatchName.indexOf(name);
					if( ~ index ) {
						DispatchName.splice(index, 1)
					}
				}
			}
		}

		return this
	},

	get(name)
	{
		return DataState[name]
	},

	getOr(name, defaultValue = false)
	{
		return this.getIs(name) ? DataState[name] : defaultValue
	},

	destroy(name)
	{
		if( this.getIs(name) ) {
			delete DataState[name];
			delete DataScalar[name]
		}

		return this
	},

	/**
	 * @deprecated
	 * @param name
	 * @returns {boolean}
	 */
	check(name)
	{
		return DataState[name] !== undefined
	},

	getIs(name)
	{
		return DataState.hasOwnProperty(name)
	},

	then( name, callback )
	{
		if( this.getIs(name) ) {
			Trigger.fake("ChangeValue", {name: name, value: DataState[name]}, callback)
		}
		else {
			let func;
			func = e => {
				if(e.detail.name === name) {
					Trigger.remove("ChangeValue", func);
					return callback(e)
				}
			};
			Trigger.add("ChangeValue", func)
		}

		return this
	}
};

export default Data;