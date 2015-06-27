
{

	let dispatchRoutes = (routes, middleware) => {

		dispatchRoutes.precond(routes, middleware)

		var location = window.location
		var query    = QueryIterator.fromLocation(location)




		for (let ith = 0; ith < routes.length; ++ith) {

			var route = routes[ith]

			var isMatch = route.pattern(location)

			if (isMatch) {

				middleware.forEach(response => {
					response(location)
				})

				route.response(query, ( ) => {
					dispatchRoutes(routes.slice(ith + 1), middleware)
				})

				return

			}

		}

	}

	dispatchRoutes.precond = (routes, middleware) => {

		is.always.array(routes)
		is.always.array(middleware)

	}





	let onLocationChange = callback => {

		var previous

		setInterval(( ) => {

			if (previous !== window.location.href) {

				previous = window.location.href
				callback( )

			}

		}, 100)

	}





	var Router = function ( ) {

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
				dispatchRoutes(self.routes.onLoad, self.middleware)
			})

			onLocationChange(( ) => {
				dispatchRoutes(self.routes.onChange, self.middleware)
			})

		}




		self.onLoad   = onLoad
		self.onChange = onChange

		self.use      = use
		self.run      = run

		return self

	}

}
