




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

var WindowPath = ( ) => {

	var self = {
		data: window.location,

		getPath: ( ) => {
			return self.data.href
		},
		setPath: path => {
			self.data.pathname = path
		}
	}

	return self

}
