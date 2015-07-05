
# clouter.js

Clouter is a small library that adds four things:

- A client-side router for triggering callbacks when the page loads, when a url is updated,
or when part of the url changes.

- An iterator-like data-structure for parsing URI paths.

- A predicate languge for describing route patterns.

- A selector language for selecting part of a route to watch for changes.







## Router( )

```js
var app = Router({location: window.location})

app
.onChange(

    use.location
    .where.path('bookmarks')
    .compile( ),

    (query, next) => {

        console.log( query )

    }

)
.run( )

```