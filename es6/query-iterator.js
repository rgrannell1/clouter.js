





var parseResource = raw => {

	var parts = { }

	if (raw.indexOf('#') !== -1) {

		parts.hash = raw.slice(raw.indexOf('#') + 1)
		raw        = raw.slice(0, raw.indexOf('#'))

		if (raw.indexOf('?') !== -1) {

			var queryString = raw.slice(raw.indexOf('?') + 1)
			raw             = raw.slice(0, raw.indexOf('?'))

			parts.params = queryString
				.split('&')
				.map(pairs => pairs.split('='))

		}

	}

	parts.paths = raw.split('/').filter(part => part.length > 0)

	return parts
}















var QueryIterator = function (raw) {

	var self  = { }

	this.data = parseResource(raw)





	this.peekNextPath = ( ) => {

		var isEmpty = is.undefined(this.data.paths) || this.data.paths.length === 0

		if (!isEmpty) {
			return this.data.paths[0]
		}

	}

	this.getNextPath = ( ) => {

		var result = this.peekNextPath( )

		if (!is.undefined(result)) {
			this.data.paths.shift( )
		}

		return result

	}





	this.peekNextPaths = ( ) => {

		var isEmpty = is.undefined(this.data.paths) || this.data.paths.length === 0

		if (!isEmpty) {
			return '/' + this.data.paths.join('/')
		}

	}

	this.getNextPaths = ( ) => {

		var result      = this.peekNextPaths( )
		this.data.paths = undefined

		return result

	}




	this.peekNextHash = ( ) => {

		if (!is.undefined(this.data.hash)) {
			return '#' + this.data.hash
		}

	}

	this.getNextHash = ( ) => {

		var result     = this.peekNextHash( )
		this.data.hash = undefined

		return result

	}




	this.peekNextParams = ( ) => {

		var isEmpty = is.undefined(this.data.params) || this.data.params.length === 0

		if (!isEmpty) {

			return '?' + this.data.params.map(pair => {
					return pair.join('=')
				})
				.join('&')

		}

	}

	this.getNextParams = ( ) => {

		var params       = this.peekNextParams( )
		this.data.params = undefined

		return params

	}





	this.peekNextParam = ( ) => {

		var isEmpty = is.undefined(this.data.params) || this.data.params.length === 0

		if (!isEmpty) {
			return this.data.params[0]
		}

	}

	this.getNextParam = ( ) => {

		var result = this.peekNextParam( )

		var isEmpty = is.undefined(this.data.params) || this.data.params.length === 0

		if (!isEmpty) {
			this.data.params.shift( )
		}

		return result

	}

	this.peekRest = ( ) => {

		return [
			this.peekNextPaths( ),
			this.peekNextParams( ),
			this.peekNextHash( )
		]
		.filter(part => part.length > 0)
		.join('')

	}

	this.getRest = ( ) => {

		var result = this.peekRest( )

		;['hash', 'paths', 'params'].forEach(key => {
			this.data[key] = undefined
		})

		return result

	}







	return this

}





QueryIterator.fromQueryIterator = iterator => {

	var raw = [
		iterator.peekNextPaths( ),
		iterator.peekNextParams( ),
		iterator.peekNextHash( )
	]
	.filter(part => part && part.length > 0)
	.join('')

	return new QueryIterator(raw)

}

QueryIterator.fromLocation = location => {

	var raw = [
		location.pathname,
		location.search,
		location.hash
	]
	.filter(part => part.length > 0)
	.join('')

	return new QueryIterator(raw)

}
