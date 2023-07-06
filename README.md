install
```
pnpm i
```

run
```
pnpm start
```

query

```graphql
query ExampleQuery {
  books {
    id
    title
    author
  }

  bookWithComments(bookId: 1) {
    book {
      id
      author
    }
    comments {
      id
      body
    }
  }
}
```