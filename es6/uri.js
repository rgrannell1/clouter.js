
var Path = path => {

	if (is.string(path)) {

		return StringPath(path)

	} else if (is.location(path)) {

		return WindowPath(path)

	} else {
		throw TypeError('path method.')
	}

}




var StringPath = path => {

	var self = {
		data: path,

		getPath: ( ) => {
			return self.data
		},
		setPath: path => {
			return self.data = path
		}
	}

	return self

}

var WindowPath = path => {

	var self = {
		data: path,

		getPath: ( ) => {

			return [
				self.data.pathname,
				self.data.search,
				self.data.hash
			]
			.filter(part => part && part.length > 0)
			.join('')

		},
		setPath: path => {
			history.pushState(null, '', path)
		}
	}

	return self

}
