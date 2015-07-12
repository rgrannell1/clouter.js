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

			var query = UriIterator.fromLocation(location.getPath());
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
					part = route.projection(UriIterator.fromLocation(currentLocation));

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

						route.response(UriIterator.fromLocation(currentLocation), function () {
							dispatchRoutes(UriIterator.fromLocation(currentLocation), routes.slice(ith + 1), middleware);
						});

						return {
							v: undefined
						};
					} else if (is.object(isMatch)) {

						if (isMatch.hasOwnProperty("value") && isMatch.hasOwnProperty("parts")) {

							middleware.forEach(function (response) {
								response(bindLocation(isMatch, clone));
							});

							route.response(UriIterator.fromLocation(currentLocation), function () {
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

			var clearPaths = function clearPaths() {};

			var clearHash = function clearHash() {};

			var clearPath = function clearPath() {};

			var clearParam = function clearParam() {};

			var clearParams = function clearParams() {};

			var clearResource = function clearResource() {};

			var clearFilter = function clearFilter() {};

			var clear = function clear() {};

			var setPaths = function setPaths() {};

			var setHash = function setHash() {};

			var setPath = function setPath() {};

			var setParam = function setParam() {};

			var setParams = function setParams() {};

			var setResource = function setResource() {};

			var setFilter = function setFilter() {};

			var set = function set() {};

			var addPath = function addPath() {};

			var addParam = function addParam() {};

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