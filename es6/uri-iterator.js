
if (typeof process !== 'undefined' && module.exports) {
	var is = require('is')
}







var parseResource = raw => {

	var parts = { }

	if (raw.indexOf('#') !== -1) {

		parts.hash = raw.slice(raw.indexOf('#') + 1)
		raw        = raw.slice(0, raw.indexOf('#'))

	}

	if (raw.indexOf('?') !== -1) {

		var queryString = raw.slice(raw.indexOf('?') + 1)
		raw             = raw.slice(0, raw.indexOf('?'))

		parts.params = queryString
			.split('&')
			.map(pair => pair.split('='))
			.map(pair => {
				return {key: pair[0], value: pair[1]}
			})

	}

	parts.paths = raw.split('/').filter(part => part && part.length > 0)

	return parts
}















var UriIterator = function (raw) {

	if (!(this instanceof UriIterator)) {
		return new UriIterator(raw)
	}


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

	this.setNextPath = value => {

		if ( !is.undefined(this.peekNextPath( )) ) {
			this.data.paths[0] = value
		}

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

	this.setNextPaths = value => {

		this.data.paths = value
			.split('/')
			.filter(path => path.length > 0)

	}




	this.peekHash = ( ) => {

		if (!is.undefined(this.data.hash)) {
			return this.data.hash
		}

	}

	this.getHash = ( ) => {

		var result     = this.peekHash( )
		this.data.hash = undefined

		return result

	}

	this.setHash = value => {
		this.data.hash = value
	}





	this.peekWholeHash = ( ) => {

		if (!is.undefined(this.data.hash)) {
			return '#' + this.data.hash
		}

	}

	this.getWholeHash = ( ) => {

		var result     = this.peekWholeHash( )
		this.data.hash = undefined

		return result

	}

	this.setWholeHash = value => {
		this.data.hash = value.replace(/^[#]/g, '')
	}





	this.peekWholeParams = ( ) => {

		var isEmpty = is.undefined(this.data.params) || this.data.params.length === 0

		if (!isEmpty) {

			return '?' + this.data.params.map(pair => {
					return pair.key + '=' + pair.value
				})
				.join('&')

		}

	}

	this.getWholeParams = ( ) => {

		var params       = this.peekWholeParams( )
		this.data.params = undefined

		return params

	}

	this.setWholeParams = value => {

		this.data.params = is.undefined(value)
			? undefined
			: value.replace(/^[?]/g, '')
				.split('&')
				.map(pair => pair.split('='))
				.map(pair => {
					return {key: pair[0], value: pair[1]}
				})

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

	this.setNextParam = (key, value) => {

		if ( !is.undefined(this.peekNextParam( )) ) {
			this.data.params[0] = {key, value}
		}

	}




	this.peekParams = ( ) => {

		if ( !is.undefined(this.peekNextParam( )) ) {
			return this.data.params
		}

	}

	this.getParams = ( ) => {

		var result       = this.peekParams( )
		this.data.params = undefined

		return result

	}





	this.peekWhole = ( ) => {

		return [
			this.peekNextPaths( ),
			this.peekWholeParams( ),
			this.peekWholeHash( )
		]
		.filter(part => part && part.length > 0)
		.join('')

	}

	this.getWhole = ( ) => {

		var result = this.peekWhole( )

		;['hash', 'paths', 'params'].forEach(key => {
			this.data[key] = undefined
		})

		return result

	}

	this.setWhole = value => {

		var iter = UriIterator(value)
		this.data = iter.data

	}







	return this

}





UriIterator.fromUriIterator = iterator => {

	var raw = [
		iterator.peekNextPaths( ),
		iterator.peekWholeParams( ),
		iterator.peekHash( )
	]
	.filter(part => part && part.length > 0)
	.join('')

	return new UriIterator(raw)

}

UriIterator.fromLocation = location => {

	var raw = [
		location.pathname,
		location.search,
		location.hash
	]
	.filter(part => part && part.length > 0)
	.join('')

	return new UriIterator(raw)

}

UriIterator.fromPath = path => {
	return new UriIterator(path.getPath( ))
}




if (typeof process !== 'undefined' && module.exports) {
	module.exports = UriIterator
}
