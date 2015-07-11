"use strict";

if (typeof process !== "undefined" && module.exports) {
	var is = require("is");
}

var use = {};

use.location = {

	isMatch: true,
	where: {
		path: function (condition, binding) {

			use.location.parts.push({
				method: "getNextPath",
				condition: condition,
				binding: binding
			});

			return use.location;
		},
		paths: function (condition, binding) {

			use.location.parts.push({
				method: "getNextPaths",
				condition: condition,
				binding: binding
			});

			return use.location;
		},
		hash: function (condition, binding) {

			use.location.parts.push({
				method: "getHash",
				condition: condition,
				binding: binding
			});

			return use.location;
		},
		params: function (condition, binding) {

			use.location.parts.push({
				method: "getNextParams",
				condition: condition,
				binding: binding
			});

			return use.location;
		},
		param: function (condition, binding) {

			use.location.parts.push({
				method: "getNextParam",
				condition: condition,
				binding: binding
			});

			return use.location;
		},
		rest: function (condition, binding) {

			use.location.parts.push({
				method: "getWhole",
				condition: condition,
				binding: binding
			});

			return use.location;
		}
	},
	parts: [],
	compile: function compile(debug) {
		var _this = this;

		return function (location) {

			var iterator = new UriIterator.fromLocation(location);

			for (var ith = 0; ith < _this.parts.length; ++ith) {

				// -- for every matched part
				var part = _this.parts[ith];

				var method = part.method;
				var condition = part.condition;

				var clone = UriIterator.fromUriIterator(iterator);
				var value = iterator[method]();

				if (is.undefined(value)) {
					// -- that part doesn't exist, so can never be matched.

					return {
						value: false,
						parts: _this.parts
					};
				} else {
					// -- test the match

					var isMatch = isPartMatch(condition, clone, value);

					if (!isMatch) {
						return {
							value: false,
							parts: _this.parts
						};
					}
				}
			}

			return {
				value: true,
				parts: _this.parts
			};
		};
	}

};

var isPartMatch = function (condition, clone, part) {

	if (is["function"](condition)) {

		var wrapped = function () {
			return condition.call(clone, part, clone);
		};
	} else if (is.string(condition)) {

		var wrapped = function () {
			return condition === part;
		};
	} else if (is.regexp(condition)) {

		var wrapped = function () {
			return condition.test(part);
		};
	} else {
		throw TypeError("unimplemented");
	}

	return wrapped();
};

if (typeof process !== "undefined" && module.exports) {

	module.exports = use;
}