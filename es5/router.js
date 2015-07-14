"use strict";

if (typeof process !== "undefined" && module.exports) {

	var is = require("is");
	var UriIterator = require("./uri-iterator");
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

			var query = UriIterator(location.getPath());
			var clone = UriIterator.fromUriIterator(query);

			for (var ith = 0; ith < routes.length; ++ith) {
				var route;
				var isMatch;

				var _ret2 = (function (ith) {
					route = routes[ith];

					// -- either a boolean, or a route object describing how to
					// -- bind the result of the location.

					isMatch = route.pattern(location.getPath());

					if (is.boolean(isMatch) && isMatch) {

						middleware.forEach(function (response) {
							response(location.getPath());
						});

						route.response(query, function () {
							dispatchRoutes(location.getPath(), routes.slice(ith + 1), middleware);
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
			is.always.object(location);
		};

		var dispatchAlteredRoutes = function (location, routes, middleware) {

			var currentLocation = location.getPath();

			for (var ith = 0; ith < routes.length; ++ith) {
				var route;
				var part;
				var isMatch;

				var _ret2 = (function (ith) {
					route = routes[ith];
					part = route.projection(UriIterator(currentLocation));

					// -- if the part hasn't changed, continue
					if (part === routes[ith].previous) {
						return "continue";
					}

					// -- update the previous part to the current.
					routes[ith].previous = part;

					// -- either a boolean, or a route object describing how to
					// -- bind the result of the location.

					isMatch = route.pattern(currentLocation);

					if (is.boolean(isMatch) && isMatch) {

						middleware.forEach(function (response) {
							response(currentLocation);
						});

						route.response(UriIterator(currentLocation), function () {
							dispatchRoutes(UriIterator(currentLocation), routes.slice(ith + 1), middleware);
						});

						return {
							v: undefined
						};
					} else if (is.object(isMatch)) {

						if (isMatch.hasOwnProperty("value") && isMatch.hasOwnProperty("parts")) {

							middleware.forEach(function (response) {
								response(bindLocation(isMatch, clone));
							});

							route.response(UriIterator(currentLocation), function () {
								dispatchRoutes(bindLocation(isMatch, clone), routes.slice(ith + 1), middleware);
							});
						} else {
							throw new Error("invalid object");
						}
					}
				})(ith);

				switch (_ret2) {
					case "continue":
						continue;

					default:
						if (typeof _ret2 === "object") return _ret2.v;
				}
			}
		};

		var onLocationChange = function (location, callback) {

			var previous;

			setInterval(function () {

				var currentURL = location.getPath();

				if (previous !== currentURL) {

					previous = currentURL;
					callback();
				}
			}, 100);
		};

		Router = function Router(_ref) {
			var location = _ref.location;

			var self = {
				location: Path(location),
				routes: {
					onLoad: [],
					onChange: [],
					onAlter: []
				},
				middleware: []

			};

			var onLoad = function onLoad(pattern, response) {

				self.routes.onLoad.push({ pattern: pattern, response: response });

				return {
					routes: self.routes,
					middleware: self.middleware,

					onChange: onChange,
					onLoad: onLoad,
					onAlter: onAlter,
					use: use,

					run: run
				};
			};

			var onAlter = function onAlter(projection, pattern, response) {

				self.routes.onAlter.push({ projection: projection, pattern: pattern, response: response, previous: undefined });

				return {
					routes: self.routes,
					middleware: self.middleware,

					onChange: onChange,
					onLoad: onLoad,
					onAlter: onAlter,

					use: use,
					run: run
				};
			};

			var onChange = function onChange(pattern, response) {

				self.routes.onChange.push({ pattern: pattern, response: response });

				return {
					routes: self.routes,
					middleware: self.middleware,

					onChange: onChange,
					onLoad: onLoad,
					onAlter: onAlter,
					use: use,

					run: run
				};
			};

			onChange.precond = function (pattern, response) {};

			var use = function use(response) {

				self.middleware.push(response);

				return {
					routes: self.routes,
					middleware: self.middleware,

					onChange: onChange,
					onLoad: onLoad,
					onAlter: onAlter,
					use: use,

					run: run
				};
			};

			var run = function run() {

				dispatchRoutes(self.location, self.routes.onLoad, self.middleware);

				onLocationChange(self.location, function () {
					dispatchRoutes(self.location, self.routes.onChange, self.middleware);
				});

				onLocationChange(self.location, function () {
					dispatchAlteredRoutes(self.location, self.routes.onAlter, self.middleware);
				});
			};

			self.url = {};

			self.url.clearPaths = function () {
				self.url.setPaths(undefined);
			};

			self.url.clearHash = function () {
				self.url.setHash(undefined);
			};

			self.url.clearPath = function () {
				self.url.setPath(undefined);
			};

			self.url.clearParam = function () {
				self.url.setParam(undefined);
			};

			self.url.clearParams = function () {
				self.url.setParams(undefined);
			};

			self.url.clearResource = function () {
				self.url.setResource(undefined);
			};

			self.url.clearFilter = function () {
				self.url.setFilter(undefined);
			};

			self.url.clear = function () {
				self.url.location.setPath("");
			};

			self.url.setPaths = function (value) {

				var iter = UriIterator.fromPath(self.location);
				iter.setPaths(value);

				self.url.set(iter.peekWhole());
			};

			self.url.setHash = function (value) {

				var iter = UriIterator.fromPath(self.location);
				iter.setHash(value);

				self.url.set(iter.peekWhole());
			};

			self.url.setParams = function (value) {

				var iter = UriIterator.fromPath(self.location);
				iter.setWholeParams(value);

				self.url.set(iter.peekWhole());
			};

			self.url.setResource = function (value) {};

			self.url.setFilter = function (value) {};

			self.url.set = function (path) {
				self.location.setPath(path);
			};

			self.url.addPath = function () {};

			self.url.addParam = function () {};

			self.url.asIterator = function () {
				return UriIterator(self.location.getPath());
			};

			self.onLoad = onLoad;
			self.onChange = onChange;
			self.onAlter = onAlter;

			self.use = use;
			self.run = run;

			return self;
		};
	})();
}

if (typeof process !== "undefined" && module.exports) {
	module.exports = Router;
}