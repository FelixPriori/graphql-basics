const Query = {
  users(parent, {query}, {db}, info) {
    if (query) return db.users.filter(({name}) => name.toLowerCase().includes(query.toLowerCase()))
    return db.users
  },
  posts(parent, {query}, {db}, info) {
    if (query)
      return db.posts.filter(
        ({title, body}) =>
          title.toLowerCase().includes(query.toLowerCase()) || body.toLowerCase().includes(query.toLowerCase()),
      )
    return db.posts
  },
  comments(parent, {query}, {db}, info) {
    if (query) return db.comments.filter(({text}) => text.toLowerCase().includes(query.toLowerCase()))
    return db.comments
  },
}

export default Query
