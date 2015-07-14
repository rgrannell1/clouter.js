"use strict";

var Path = function (path) {

	if (is.string(path)) {

		return StringPath(path);
	} else if (is.location(path)) {

		return WindowPath(path);
	} else {
		throw TypeError("path method.");
	}
};

var StringPath = function (path) {

	var self = {
		data: path,

		getPath: function () {
			return self.data;
		},
		setPath: function (path) {
			return self.data = path;
		}
	};

	return self;
};

var WindowPath = function (path) {

	var self = {
		data: path,

		getPath: function () {

			return [self.data.pathname, self.data.search, self.data.hash].filter(function (part) {
				return part && part.length > 0;
			}).join("");
		},
		setPath: function (path) {
			history.pushState(null, "", path);
		}
	};

	return self;
};