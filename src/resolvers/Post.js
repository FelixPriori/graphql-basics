const Post = {
  author({author}, args, {db}, info) {
    return db.users.find(({id}) => id === author)
  },
  comments({id}, args, {db}, info) {
    return db.comments.filter(({post}) => post === id)
  },
}

export default Post
