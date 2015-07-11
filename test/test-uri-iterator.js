#!/usr/bin/env node

"use strict"




var UriIterator = require('../es5/uri-iterator')
var should      = require('should')






describe('UriIterator', function ( ) {

	describe('peekWhole( )', function ( ) {

		it('returns the entire path if no segments are removed', function ( ) {

			;[
				'/foo/bar',
				'/foo/bar/baz?a=1',
				'/foo/bar/baz?a=1&b=2',
				'/foo/bar/baz?a=1#hash'
			]
			.forEach(function (path) {

				var iter = UriIterator(path)

				iter.peekWhole( ).should.equal(path)
				iter.peekWhole( ).should.equal(path)

			})

		})

	})

	describe('getWhole( )', function ( ) {

		it('returns the entire path the first time, and undefined thereafter', function ( ) {

			;[
				'/foo/bar',
				'/foo/bar/baz?a=1',
				'/foo/bar/baz?a=1&b=2',
				'/foo/bar/baz?a=1#hash'
			]
			.forEach(function (path) {

				var iter = UriIterator(path)

				iter.getWhole( ).should.equal(path)
				iter.getWhole( ).should.be.undefined

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

		it('should yield each path in turn', function () {

			;[
				['/a',               ['a']],
				['/foo/bar',         ['foo', 'bar']],
				['/foo/bar?a=1&b=2', ['foo', 'bar']],
				['/a/b/?q=1',        ['a', 'b']]
			]
			.forEach(function (pair) {

				var iter = UriIterator(pair[0])

				pair[1].forEach(function (path) {
					iter.getNextPath( ).should.equal(path)
				})

			})

		})

	})

	describe('peekHash', function ( ) {

		it('should always return the hash', function () {

			;[
				['/a/b#123',          '123'],
				['/a/#123',           '123'],
				['/a/b/c/?a=1&b=2#3', '3']
			]
			.forEach(function (pair) {

				var iter = UriIterator(pair[0])

				iter.peekHash( ).should.equal(pair[1])
				iter.peekHash( ).should.equal(pair[1])

			})

		})

	})

	describe('getHash', function ( ) {
		it('should return the hash the first time', function ( ) {

			;[
				['/a/b#123',          '123'],
				['/a/#123',           '123'],
				['/a/b/c/?a=1&b=2#3', '3']
			]
			.forEach(function (pair) {

				var iter = UriIterator(pair[0])

				iter.getHash( ).should.equal(pair[1])
				should.not.exist(iter.getHash( ))

			})
		})

	})

	describe('peekWholeHash', function ( ) {

		it('should always return the hash', function () {

			;[
				['/a/b#123',          '#123'],
				['/a/#123',           '#123'],
				['/a/b/c/?a=1&b=2#3', '#3']
			]
			.forEach(function (pair) {

				var iter = UriIterator(pair[0])

				iter.peekWholeHash( ).should.equal(pair[1])
				iter.peekWholeHash( ).should.equal(pair[1])

			})

		})

	})

	describe('getWholeHash', function ( ) {
		it('should return the hash the first time', function ( ) {

			;[
				['/a/b#123',          '#123'],
				['/a/#123',           '#123'],
				['/a/b/c/?a=1&b=2#3', '#3']
			]
			.forEach(function (pair) {

				var iter = UriIterator(pair[0])

				iter.getWholeHash( ).should.equal(pair[1])
				should.not.exist(iter.getWholeHash( ))

			})
		})

	})



	describe('peekWholeParams', function ( ) {
		it('should return the full query string', function () {

			;[
				['/a/?param0=a&param1=b', '?param0=a&param1=b'],
				['/a?a=1',                '?a=1']
			]
			.forEach(function (pair) {

				var iter = UriIterator(pair[0])

				iter.peekWholeParams( ).should.equal(pair[1])
				iter.peekWholeParams( ).should.equal(pair[1])

			})

		})
	})

	describe('getWholeParams', function ( ) {
		it('should return the full query string once', function () {

			;[
				['/a/?param0=a&param1=b', '?param0=a&param1=b'],
				['/a?a=1',                '?a=1']
			]
			.forEach(function (pair) {

				var iter = UriIterator(pair[0])

				iter.getWholeParams( ).should.equal(pair[1])
				should.not.exist(iter.getWholeParams( ))

			})

		})
	})





	describe('getNextParam', function ( ) {
		it('should return each parametre in order', function ( ) {

			;[
				[ '/a/b?foo=0&bar=1', [{key: 'foo', value: '0'}, {key: 'bar', value: '1'}] ]
			]
			.forEach(function (pair) {

				var iter  = UriIterator(pair[0])

				pair[1].forEach(function (expected) {

					var param = iter.getNextParam( )

					param.key  .should.equal(expected.key)
					param.value.should.equal(expected.value)

				})
			})
		})
	})

	describe('peekNextParam', function ( ) {
		it('should return each parametre in order', function ( ) {

			;[
				[ '/a/b?foo=0&bar=1', [{key: 'foo', value: '0'}, {key: 'foo', value: '0'}] ]
			]
			.forEach(function (pair) {

				var iter  = UriIterator(pair[0])

				pair[1].forEach(function (expected) {

					var param = iter.peekNextParam( )

					param.key  .should.equal(expected.key)
					param.value.should.equal(expected.value)

				})
			})
		})
	})
})
