
if (typeof process !== 'undefined' && module.exports) {
	var is = require('is')
}





{

	let bindLocation = (parts, iterator) => {

		var bound = { }



		parts.forEach(({binding, condition, method}) => {

			var value = iterator[method]

			if (is.string(binding)) {
				bound[binding]        = value
			} else if (is.function(binding)) {
				bound[binding(value)] = value
			}

		})

		return bound

	}





	let dispatchRoutes = (location, routes, middleware) => {

		dispatchRoutes.precond(location, routes, middleware)

		var query = UriIterator.fromLocation(location)
		var clone = UriIterator.fromUriIterator(query)




		for (let ith = 0; ith < routes.length; ++ith) {

			var route = routes[ith]

			// -- either a boolean, or a route object describing how to
			// -- bind the result of the location.

			var isMatch = route.pattern(location)

			if (is.boolean(isMatch) && isMatch) {

				middleware.forEach(response => {
					response(location)
				})

				route.response(query, ( ) => {
					dispatchRoutes(location, routes.slice(ith + 1), middleware)
				})

				return

			} else if (is.object(isMatch)) {

				if (isMatch.hasOwnProperty('value') && isMatch.hasOwnProperty('parts')) {

					middleware.forEach(response => {
						response(bindLocation(isMatch, clone))
					})

					route.response(query, ( ) => {
						dispatchRoutes(bindLocation(isMatch, clone), routes.slice(ith + 1), middleware)
					})

				} else {
					throw new Error('invalid object')
				}

			}

		}

	}

	dispatchRoutes.precond = (location, routes, middleware) => {

		is.always.array(routes)
		is.always.array(middleware)

	}





	let onLocationChange = (location, callback) => {

		var previous

		setInterval(( ) => {

			if (previous !== location) {

				previous = location
				callback( )

			}

		}, 100)

	}





	var Router = function ({location}) {

		var self = {
			routes: {
				onLoad:   [ ],
				onChange: [ ]
			},
			middleware:   [ ],

		}





		var onLoad = function (pattern, response) {

			self.routes.onLoad.push({pattern, response})

			return {
				routes:     self.routes,
				middleware: self.middleware,

				onChange:   onChange,
				onLoad:     onLoad,
				use:        use,

				run:        run
			}

		}

		var onChange = function (pattern, response) {

			self.routes.onChange.push({pattern, response})

			return {
				routes:     self.routes,
				middleware: self.middleware,

				onChange:   onChange,
				onLoad:     onLoad,
				use:        use,

				run:        run
			}

		}

		onChange.precond = (pattern, response) => {

		}

		var use = function (response) {

			self.middleware.push(response)

			return {
				routes:     self.routes,
				middleware: self.middleware,

				onChange:   onChange,
				onLoad:     onLoad,
				use:        use,

				run:        run
			}

		}

		var run = function ( ) {

			$(( ) => {
				dispatchRoutes(location, self.routes.onLoad, self.middleware)
			})

			onLocationChange(location, ( ) => {
				dispatchRoutes(location, self.routes.onChange, self.middleware)
			})

		}




		self.onLoad   = onLoad
		self.onChange = onChange

		self.use      = use
		self.run      = run

		return self

	}

}





if (typeof process !== 'undefined' && module.exports) {
	module.exports = Router
}
