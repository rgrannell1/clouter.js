
if (typeof process !== 'undefined' && module.exports) {

	var is          = require('is')
	var UriIterator = require('./uri-iterator')

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

		var query = UriIterator(location.getPath( ))
		var clone = UriIterator.fromUriIterator(query)




		for (let ith = 0; ith < routes.length; ++ith) {

			var route = routes[ith]

			// -- either a boolean, or a route object describing how to
			// -- bind the result of the location.

			var isMatch = route.pattern(location.getPath( ))

			if (is.boolean(isMatch) && isMatch) {

				middleware.forEach(response => {
					response(location.getPath( ))
				})

				route.response(query, ( ) => {
					dispatchRoutes(location.getPath( ), routes.slice(ith + 1), middleware)
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
		is.always.object(location)

	}




	let dispatchAlteredRoutes = (location, routes, middleware) => {

		var currentLocation = location.getPath( )

		for (let ith = 0; ith < routes.length; ++ith) {

			var route = routes[ith]
			var part  = route.projection(UriIterator(currentLocation))

			// -- if the part hasn't changed, continue
			if (part === routes[ith].previous) {
				continue
			}

			// -- update the previous part to the current.
			routes[ith].previous = part

			// -- either a boolean, or a route object describing how to
			// -- bind the result of the location.

			var isMatch = route.pattern(currentLocation)

			if (is.boolean(isMatch) && isMatch) {

				middleware.forEach(response => {
					response(currentLocation)
				})

				route.response(UriIterator(currentLocation), ( ) => {
					dispatchRoutes(UriIterator(currentLocation), routes.slice(ith + 1), middleware)
				})

				return

			} else if (is.object(isMatch)) {

				if (isMatch.hasOwnProperty('value') && isMatch.hasOwnProperty('parts')) {

					middleware.forEach(response => {
						response(bindLocation(isMatch, clone))
					})

					route.response(UriIterator(currentLocation), ( ) => {
						dispatchRoutes(bindLocation(isMatch, clone), routes.slice(ith + 1), middleware)
					})

				} else {
					throw new Error('invalid object')
				}

			}

		}

	}





	let onLocationChange = (location, callback) => {

		var previous

		setInterval(( ) => {

			var currentURL = location.getPath( )

			if (previous !== currentURL) {

				previous = currentURL
				callback( )

			}

		}, 100)

	}

	var Router = function ({location}) {

		var self = {
			location: Path(location),
			routes: {
				onLoad:   [ ],
				onChange: [ ],
				onAlter:  [ ]
			},
			middleware:   [ ]

		}


		var onLoad = function (pattern, response) {

			self.routes.onLoad.push({pattern, response})

			return {
				routes:     self.routes,
				middleware: self.middleware,

				onChange,
				onLoad,
				onAlter,
				use,

				run
			}

		}

		var onAlter  = function (projection, pattern, response) {

			self.routes.onAlter.push({projection, pattern, response, previous: undefined})

			return {
				routes:     self.routes,
				middleware: self.middleware,

				onChange,
				onLoad,
				onAlter,

				use,
				run
			}

		}

		var onChange = function (pattern, response) {

			self.routes.onChange.push({pattern, response})

			return {
				routes:     self.routes,
				middleware: self.middleware,

				onChange,
				onLoad,
				onAlter,
				use,

				run
			}

		}

		onChange.precond = (pattern, response) => {

		}

		var use = function (response) {

			self.middleware.push(response)

			return {
				routes:     self.routes,
				middleware: self.middleware,

				onChange,
				onLoad,
				onAlter,
				use,

				run
			}

		}

		var run = function ( ) {

			dispatchRoutes(self.location, self.routes.onLoad, self.middleware)

			onLocationChange(self.location, ( ) => {
				dispatchRoutes(self.location, self.routes.onChange, self.middleware)
			})

			onLocationChange(self.location, ( ) => {
				dispatchAlteredRoutes(self.location, self.routes.onAlter, self.middleware)
			})


		}



		self.url = { }

		self.url.clearPaths    = ( ) => {
			self.url.setPaths(undefined)
		}

		self.url.clearHash     = ( ) => {
			self.url.setHash(undefined)
		}

		self.url.clearPath     = ( ) => {
			self.url.setPath(undefined)
		}

		self.url.clearParam    = ( ) => {
			self.url.setParam(undefined)
		}

		self.url.clearParams   = ( ) => {
			self.url.setParams(undefined)
		}

		self.url.clearResource = ( ) => {
			self.url.setResource(undefined)
		}

		self.url.clearFilter   = ( ) => {
			self.url.setFilter(undefined)
		}

		self.url.clear         = ( ) => {
			self.url.location.setPath('')
		}




		self.url.setPaths    = value => {

			var iter = UriIterator.fromPath(self.location)
			iter.setPaths(value)

			self.url.set(iter.peekWhole( ))

		}

		self.url.setHash     = value => {

			var iter = UriIterator.fromPath(self.location)
			iter.setHash(value)

			self.url.set(iter.peekWhole( ))

		}

		self.url.setParams   = value => {

			var iter = UriIterator.fromPath(self.location)
			iter.setWholeParams(value)

			self.url.set(iter.peekWhole( ))

		}

		self.url.setResource = value => {

		}

		self.url.setFilter   = value => {

		}


		self.url.set         = (path)  =>{
			self.location.setPath(path)
		}





		self.url.addPath  = ( ) => {

		}

		self.url.addParam = ( ) => {

		}




		self.url.asIterator = ( ) => {
			return UriIterator(self.location.getPath( ))
		}





		self.onLoad   = onLoad
		self.onChange = onChange
		self.onAlter  = onAlter

		self.use      = use
		self.run      = run

		return self

	}

}





if (typeof process !== 'undefined' && module.exports) {
	module.exports = Router
}
