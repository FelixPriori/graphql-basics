const Comment = {
  author({author}, args, {db}, info) {
    return db.users.find(({id}) => id === author)
  },
  post({post}, args, {db}, info) {
    return db.posts.find(({id}) => id === post)
  },
}

export default Comment
