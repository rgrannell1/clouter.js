#!/usr/bin/env node

"use strict"



var is          = require('is')
var Router      = require('../es5/router')
var UriIterator = require('../es5/uri-iterator')
var should      = require('should')





describe('Router( )', function ( ) {

	it('triggers all onLoad callbacks', function ( ) {

		var stub = {location: function ( ) {
			return '/foo/bar'
		}}

		var app  = Router(stub)

		app
		.onLoad(
			function ( ) {return true},
			function (query, next) {

				is.always.function(next)
				query.should.be.instanceof(UriIterator)

			}
		)
		.onLoad(
			function ( ) {return true},
			function (query, next) {

				is.always.function(next)
				query.should.be.instanceof(UriIterator)

			}
		)
		.run( )

	})

	it('triggers all onChange callbacks', function (done) {

		var window = {location: '/foo/bar'}
		var stub   = {
			location: function ( ) {
				return window.location
			}
		}

		var count = 0
		var app   = Router(stub)

		app
		.onChange(
			function ( ) {
				return true
			},
			function (query, next) {
				count++
			}
		)
		.run( )


		window.location = '/foo/bar/baz'

		setTimeout(function ( ) {

			window.location = ''

		}, 1000)

		setTimeout(function ( ) {

			count.should.equal(2)
			done( )

		}, 1500)

	})

	it('triggers all onAlter callbacks', function (done) {

		var window = {location: '/foo/bar'}
		var stub   = {
			location: function ( ) {
				return window.location
			}
		}

		var app = Router(stub)

		app
		.onAlter(
			function (query) {
				return query.peekNextQuery( )
			},
			function (query) {
				return true
			},
			function (query, next) {
				return query
			}
		)
		.run( )

		done( )

	})

})
