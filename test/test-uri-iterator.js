#!/usr/bin/env node

"use strict"




var UriIterator = require('../es5/uri-iterator')
var should      = require('should')






describe('UriIterator', function ( ) {

	describe('peekRest( )', function ( ) {

		it('returns the entire uri if no segments are removed', function ( ) {

			;[
				'/foo/bar',
				'/foo/bar/baz?a=1',
				'/foo/bar/baz?a=1&b=2',
				'/foo/bar/baz?a=1#hash'
			]
			.forEach(function (uri) {

				var iter = UriIterator(uri)

				iter.peekRest( ).should.equal(uri)
				iter.peekRest( ).should.equal(uri)

			})

		})

	})

})
