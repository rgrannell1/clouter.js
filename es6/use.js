
if (typeof process !== 'undefined' && module.exports) {
	var is = require('is')
}





var use =  { }




use.location = {

	isMatch: true,
	where:   {
		path: (condition, binding) => {

			use.location.parts.push({
				method: 'getNextPath',
				condition,
				binding
			})

			return use.location
		},
		paths: (condition, binding) => {

			use.location.parts.push({
				method: 'getNextPaths',
				condition,
				binding
			})

			return use.location

		},
		hash: (condition, binding) => {

			use.location.parts.push({
				method: 'getNextHash',
				condition,
				binding
			})

			return use.location

		},
		params: (condition, binding) => {

			use.location.parts.push({
				method: 'getNextParams',
				condition,
				binding
			})

			return use.location

		},
		param: (condition, binding) => {

			use.location.parts.push({
				method: 'getNextParam',
				condition,
				binding
			})

			return use.location

		},
		rest: (condition, binding) => {

			use.location.parts.push({
				method: 'getRest',
				condition,
				binding
			})

			return use.location

		}
	},
	parts: [ ],
	compile: function (debug) {
		return location => {

			var iterator = new UriIterator.fromLocation(location)

			for (var ith = 0; ith < this.parts.length; ++ith) {

				// -- for every matched part
				var part = this.parts[ith]

				var {method, condition} = part

				var clone = UriIterator.fromUriIterator(iterator)
				var value = iterator[method]( )




				if (is.undefined(value)) {
					// -- that part doesn't exist, so can never be matched.

					return {
						value: false,
						parts: this.parts
					}

				} else {
					// -- test the match

					var isMatch = isPartMatch(condition, clone, value)

					if (!isMatch) {
						return {
							value: false,
							parts: this.parts
						}
					}

				}
			}

			return {
				value: true,
				parts: this.parts
			}

		}
	}

}





var isPartMatch = (condition, clone, part) => {

	if (is.function(condition)) {

		var wrapped = ( ) => condition.call(clone, part, clone)

	} else if (is.string(condition)) {

		var wrapped = ( ) => condition === part

	} else if (is.regexp(condition)) {

		var wrapped = ( ) => condition.test(part)

	} else {
		throw TypeError('unimplemented')
	}

	return wrapped( )

}





if (typeof process !== 'undefined' && module.exports) {

	module.exports = use

}
