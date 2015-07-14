"use strict";

if (typeof process !== "undefined" && module.exports) {
	var is = require("is");
}

var parseResource = function (raw) {

	var parts = {};

	if (raw.indexOf("#") !== -1) {

		parts.hash = raw.slice(raw.indexOf("#") + 1);
		raw = raw.slice(0, raw.indexOf("#"));
	}

	if (raw.indexOf("?") !== -1) {

		var queryString = raw.slice(raw.indexOf("?") + 1);
		raw = raw.slice(0, raw.indexOf("?"));

		parts.params = queryString.split("&").map(function (pair) {
			return pair.split("=");
		}).map(function (pair) {
			return { key: pair[0], value: pair[1] };
		});
	}

	parts.paths = raw.split("/").filter(function (part) {
		return part && part.length > 0;
	});

	return parts;
};

var UriIterator = (function (_UriIterator) {
	var _UriIteratorWrapper = function UriIterator(_x) {
		return _UriIterator.apply(this, arguments);
	};

	_UriIteratorWrapper.toString = function () {
		return _UriIterator.toString();
	};

	return _UriIteratorWrapper;
})(function (raw) {
	var _this = this;

	if (!(this instanceof UriIterator)) {
		return new UriIterator(raw);
	}

	this.data = parseResource(raw);

	this.peekNextPath = function () {

		var isEmpty = is.undefined(_this.data.paths) || _this.data.paths.length === 0;

		if (!isEmpty) {
			return _this.data.paths[0];
		}
	};

	this.getNextPath = function () {

		var result = _this.peekNextPath();

		if (!is.undefined(result)) {
			_this.data.paths.shift();
		}

		return result;
	};

	this.setNextPath = function (value) {

		if (!is.undefined(_this.peekNextPath())) {
			_this.data.paths[0] = value;
		}
	};

	this.peekNextPaths = function () {

		var isEmpty = is.undefined(_this.data.paths) || _this.data.paths.length === 0;

		if (!isEmpty) {
			return "/" + _this.data.paths.join("/");
		}
	};

	this.getNextPaths = function () {

		var result = _this.peekNextPaths();
		_this.data.paths = undefined;

		return result;
	};

	this.setNextPaths = function (value) {

		_this.data.paths = value.split("/").filter(function (path) {
			return path.length > 0;
		});
	};

	this.peekHash = function () {

		if (!is.undefined(_this.data.hash)) {
			return _this.data.hash;
		}
	};

	this.getHash = function () {

		var result = _this.peekHash();
		_this.data.hash = undefined;

		return result;
	};

	this.setHash = function (value) {
		_this.data.hash = value;
	};

	this.peekWholeHash = function () {

		if (!is.undefined(_this.data.hash)) {
			return "#" + _this.data.hash;
		}
	};

	this.getWholeHash = function () {

		var result = _this.peekWholeHash();
		_this.data.hash = undefined;

		return result;
	};

	this.setWholeHash = function (value) {
		_this.data.hash = value.replace(/^[#]/g, "");
	};

	this.peekWholeParams = function () {

		var isEmpty = is.undefined(_this.data.params) || _this.data.params.length === 0;

		if (!isEmpty) {

			return "?" + _this.data.params.map(function (pair) {
				return pair.key + "=" + pair.value;
			}).join("&");
		}
	};

	this.getWholeParams = function () {

		var params = _this.peekWholeParams();
		_this.data.params = undefined;

		return params;
	};

	this.setWholeParams = function (value) {

		_this.data.params = is.undefined(value) ? undefined : value.replace(/^[?]/g, "").split("&").map(function (pair) {
			return pair.split("=");
		}).map(function (pair) {
			return { key: pair[0], value: pair[1] };
		});
	};

	this.peekNextParam = function () {

		var isEmpty = is.undefined(_this.data.params) || _this.data.params.length === 0;

		if (!isEmpty) {
			return _this.data.params[0];
		}
	};

	this.getNextParam = function () {

		var result = _this.peekNextParam();

		var isEmpty = is.undefined(_this.data.params) || _this.data.params.length === 0;

		if (!isEmpty) {
			_this.data.params.shift();
		}

		return result;
	};

	this.setNextParam = function (key, value) {

		if (!is.undefined(_this.peekNextParam())) {
			_this.data.params[0] = { key: key, value: value };
		}
	};

	this.peekParams = function () {

		if (!is.undefined(_this.peekNextParam())) {
			return _this.data.params;
		}
	};

	this.getParams = function () {

		var result = _this.peekParams();
		_this.data.params = undefined;

		return result;
	};

	this.peekWhole = function () {

		return [_this.peekNextPaths(), _this.peekWholeParams(), _this.peekWholeHash()].filter(function (part) {
			return part && part.length > 0;
		}).join("");
	};

	this.getWhole = function () {

		var result = _this.peekWhole();["hash", "paths", "params"].forEach(function (key) {
			_this.data[key] = undefined;
		});

		return result;
	};

	this.setWhole = function (value) {

		var iter = UriIterator(value);
		_this.data = iter.data;
	};

	return this;
});

UriIterator.fromUriIterator = function (iterator) {

	var raw = [iterator.peekNextPaths(), iterator.peekWholeParams(), iterator.peekHash()].filter(function (part) {
		return part && part.length > 0;
	}).join("");

	return new UriIterator(raw);
};

UriIterator.fromLocation = function (location) {

	var raw = [location.pathname, location.search, location.hash].filter(function (part) {
		return part && part.length > 0;
	}).join("");

	return new UriIterator(raw);
};

UriIterator.fromPath = function (path) {
	return new UriIterator(path.getPath());
};

if (typeof process !== "undefined" && module.exports) {
	module.exports = UriIterator;
}