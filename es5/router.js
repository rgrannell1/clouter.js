"use strict";

if (typeof process !== "undefined" && module.exports) {
	var is = require("is");
}

{
	var Router;

	(function () {

		var bindLocation = function (parts, iterator) {

			var bound = {};

			parts.forEach(function (_ref) {
				var binding = _ref.binding;
				var condition = _ref.condition;
				var method = _ref.method;

				var value = iterator[method];

				if (is.string(binding)) {
					bound[binding] = value;
				} else if (is["function"](binding)) {
					bound[binding(value)] = value;
				}
			});

			return bound;
		};

		var dispatchRoutes = function (location, routes, middleware) {

			dispatchRoutes.precond(location, routes, middleware);

			var query = UriIterator.fromLocation(location);
			var clone = UriIterator.fromUriIterator(query);

			for (var ith = 0; ith < routes.length; ++ith) {
				var route;
				var isMatch;

				var _ret2 = (function (ith) {
					route = routes[ith];

					// -- either a boolean, or a route object describing how to
					// -- bind the result of the location.

					isMatch = route.pattern(location);

					if (is.boolean(isMatch) && isMatch) {

						middleware.forEach(function (response) {
							response(location);
						});

						route.response(query, function () {
							dispatchRoutes(location, routes.slice(ith + 1), middleware);
						});

						return {
							v: undefined
						};
					} else if (is.object(isMatch)) {

						if (isMatch.hasOwnProperty("value") && isMatch.hasOwnProperty("parts")) {

							middleware.forEach(function (response) {
								response(bindLocation(isMatch, clone));
							});

							route.response(query, function () {
								dispatchRoutes(bindLocation(isMatch, clone), routes.slice(ith + 1), middleware);
							});
						} else {
							throw new Error("invalid object");
						}
					}
				})(ith);

				if (typeof _ret2 === "object") return _ret2.v;
			}
		};

		dispatchRoutes.precond = function (location, routes, middleware) {

			is.always.array(routes);
			is.always.array(middleware);
		};

		var onLocationChange = function (location, callback) {

			var previous;

			setInterval(function () {

				if (previous !== location) {

					previous = location;
					callback();
				}
			}, 100);
		};

		Router = function Router(_ref) {
			var location = _ref.location;

			var self = {
				routes: {
					onLoad: [],
					onChange: []
				},
				middleware: [] };

			var onLoad = (function (_onLoad) {
				var _onLoadWrapper = function onLoad(_x, _x2) {
					return _onLoad.apply(this, arguments);
				};

				_onLoadWrapper.toString = function () {
					return _onLoad.toString();
				};

				return _onLoadWrapper;
			})(function (pattern, response) {

				self.routes.onLoad.push({ pattern: pattern, response: response });

				return {
					routes: self.routes,
					middleware: self.middleware,

					onChange: onChange,
					onLoad: onLoad,
					use: use,

					run: run
				};
			});

			var onChange = (function (_onChange) {
				var _onChangeWrapper = function onChange(_x, _x2) {
					return _onChange.apply(this, arguments);
				};

				_onChangeWrapper.toString = function () {
					return _onChange.toString();
				};

				return _onChangeWrapper;
			})(function (pattern, response) {

				self.routes.onChange.push({ pattern: pattern, response: response });

				return {
					routes: self.routes,
					middleware: self.middleware,

					onChange: onChange,
					onLoad: onLoad,
					use: use,

					run: run
				};
			});

			onChange.precond = function (pattern, response) {};

			var use = (function (_use) {
				var _useWrapper = function use(_x) {
					return _use.apply(this, arguments);
				};

				_useWrapper.toString = function () {
					return _use.toString();
				};

				return _useWrapper;
			})(function (response) {

				self.middleware.push(response);

				return {
					routes: self.routes,
					middleware: self.middleware,

					onChange: onChange,
					onLoad: onLoad,
					use: use,

					run: run
				};
			});

			var run = function run() {

				$(function () {
					dispatchRoutes(location, self.routes.onLoad, self.middleware);
				});

				onLocationChange(location, function () {
					dispatchRoutes(location, self.routes.onChange, self.middleware);
				});
			};

			self.onLoad = onLoad;
			self.onChange = onChange;

			self.use = use;
			self.run = run;

			return self;
		};
	})();
}

if (typeof process !== "undefined" && module.exports) {
	module.exports = Router;
}