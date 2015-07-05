#!/usr/bin/env node

"use strict"



var is          = require('is')
var Router      = require('../es5/router')
var UriIterator = require('../es5/uri-iterator')
var should      = require('should')





describe('Router( )', function ( ) {

	it('triggers onLoad callbacks', function ( ) {

		var stub = {location: '/foo/bar'}
		var app  = Router(stub)

		app
		.onLoad(
			function ( ) {return true},
			function (query, next) {

				is.always.function(next)
				query.should.be.instanceof(UriIterator)

			}
		)
		.run( )

	})

})
