#!/usr/bin/env node

"use strict"




var Router = require('../es5/router')
var should = require('should')





describe('Router( )', function ( ) {

	it('takes a location reference', function ( ) {

		var stub = {location: '/foo/bar'}
		var app  = Router(stub)

		app
		.onLoad(
			function ( ) {return true},
			function ( ) {

			}
		)
		.run( )

	})

})
