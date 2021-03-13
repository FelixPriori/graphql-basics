const User = {
  posts({id}, args, {db}, info) {
    return db.posts.filter(({author}) => author === id)
  },
  comments({id}, args, {db}, info) {
    return db.comments.filter(({author}) => author === id)
  },
}

export default User
