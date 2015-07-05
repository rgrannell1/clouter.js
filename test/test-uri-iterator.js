#!/usr/bin/env node

"use strict"




var UriIterator = require('../es5/uri-iterator')
var should      = require('should')






describe('UriIterator', function ( ) {

	describe('peekRest( )', function ( ) {

		it('returns the entire path if no segments are removed', function ( ) {

			;[
				'/foo/bar',
				'/foo/bar/baz?a=1',
				'/foo/bar/baz?a=1&b=2',
				'/foo/bar/baz?a=1#hash'
			]
			.forEach(function (path) {

				var iter = UriIterator(path)

				iter.peekRest( ).should.equal(path)
				iter.peekRest( ).should.equal(path)

			})

		})

	})

	describe('getRest( )', function ( ) {

		it('returns the entire path the first time, and undefined thereafter', function ( ) {

			;[
				'/foo/bar',
				'/foo/bar/baz?a=1',
				'/foo/bar/baz?a=1&b=2',
				'/foo/bar/baz?a=1#hash'
			]
			.forEach(function (path) {

				var iter = UriIterator(path)

				iter.getRest( ).should.equal(path)
				iter.getRest( ).should.be.undefined

			})

		})

	})





	describe('peekNextPaths', function ( ) {

		it('returns all the paths', function () {

			;[
				['/a',               '/a'],
				['/foo/bar',         '/foo/bar'],
				['/foo/bar?a=1&b=2', '/foo/bar'],
				['/a/b/?q=1',        '/a/b']
			]
			.forEach(function (pair) {

				var iter = UriIterator(pair[0])

				iter.peekNextPaths( ).should.equal(pair[1])
				iter.peekNextPaths( ).should.equal(pair[1])

			})

		})

	})

	describe('getNextPaths', function ( ) {

		it('should return all paths, once', function () {

			;[
				['/a',               '/a'],
				['/foo/bar',         '/foo/bar'],
				['/foo/bar?a=1&b=2', '/foo/bar'],
				['/a/b/?q=1',        '/a/b']
			]
			.forEach(function (pair) {

				var iter = UriIterator(pair[0])

				iter.getNextPaths( ).should.equal(pair[1])
				should.not.exist(iter.getNextPaths( ))

			})

		})

	})





	describe('peekNextPath', function ( ) {

		it('should show the first path', function () {

			;[
				['/a',               'a'],
				['/foo/bar',         'foo'],
				['/foo/bar?a=1&b=2', 'foo'],
				['/a/b/?q=1',        'a']
			]
			.forEach(function (pair) {

				var iter = UriIterator(pair[0])

				iter.peekNextPath( ).should.equal(pair[1])
				iter.peekNextPath( ).should.equal(pair[1])

			})

		})

	})

	describe('getNextPath', function ( ) {

		it('', function () {

		})

	})




})
