
var use =  { }




use.location = {

	isMatch: true,
	where:   {
		path: condition => {

			use.location.parts.push({
				method: 'getNextPath',
				condition
			})

			return use.location
		},
		paths: condition => {

			use.location.parts.push({
				method: 'getNextPaths',
				condition
			})

			return use.location

		},
		hash: condition => {

			use.location.parts.push({
				method: 'getNextHash',
				condition
			})

			return use.location

		},
		params: condition => {

			use.location.parts.push({
				method: 'getNextParams',
				condition
			})

			return use.location

		},
		param: condition => {

			use.location.parts.push({
				method: 'getNextParam',
				condition
			})

			return use.location

		},
		rest: condition => {

			use.location.parts.push({
				method: 'getRest',
				condition
			})

			return use.location

		}
	},
	parts: [ ],
	compile: function (debug) {
		return location => {

			var iterator = new QueryIterator.fromLocation(location)

			for (var ith = 0; ith < this.parts.length; ++ith) {

				// -- for every matched part
				var part = this.parts[ith]

				var {method, condition} = part

				var clone = QueryIterator.fromQueryIterator(iterator)
				var value = iterator[method]( )




				if (is.undefined(value)) {
					// -- that part doesn't exist, so can never be matched.
					return false
				} else {
					// -- test the match

					var isMatch = isPartMatch(condition, clone, value)

					if (!isMatch) {
						return false
					}

				}
			}

			return true

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
