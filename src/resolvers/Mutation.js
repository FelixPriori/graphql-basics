import {v4 as uuidv4} from 'uuid'

const Mutation = {
  createUser(parent, args, {db}, info) {
    const emailTaken = db.users.some(({email}) => args.data.email === email)

    if (emailTaken) throw new Error('Email taken')

    const user = {
      ...args.data,
      id: uuidv4(),
    }

    db.users.push(user)

    return user
  },
  deleteUser(parent, args, {db}, info) {
    const userIndex = db.users.findIndex(({id}) => id === args.id)

    if (userIndex < 0) throw new Error('User not found')

    const deletedUser = db.users.splice(userIndex, 1) // remove user

    // clean up posts from deleted user
    db.posts = db.posts.filter((post) => {
      const match = post.author === args.id

      // clean up comments on deleted posts
      if (match) db.comments = db.comments.filter(({post}) => post !== post.id)

      return !match
    })

    // clean up comments from deleted user
    db.comments = db.comments.filter(({author}) => author !== args.id)

    return deletedUser[0]
  },
  updateUser(parent, {id, data}, {db}, info) {
    const {email, name, age} = data
    const user = db.users.find((user) => user.id === id)

    if (!user) throw new Error('User not found')

    if (typeof email === 'string') {
      const emailTaken = db.users.some((user) => user.email === email)
      if (emailTaken) throw new Error('Email taken')
      user.email = email
    }

    if (typeof name === 'string') user.name = name

    if (typeof age !== 'undefined') user.age = age

    return user
  },
  createPost(parent, args, {db}, info) {
    const userExists = db.users.some((user) => user.id === args.data.author)

    if (!userExists) throw new Error('User not found')

    const post = {
      ...args.data,
      id: uuidv4(),
    }

    db.posts.push(post)

    return post
  },
  deletePost(parent, args, {db}, info) {
    const postIndex = db.posts.findIndex(({id}) => String(id) === args.id)

    if (postIndex < 0) throw new Error('Post not found')

    const deletedPost = db.posts.splice(postIndex, 1) // remove post

    // clean up comments on deleted post
    db.comments = db.comments.filter((comment) => String(comment.post) === args.id)

    return deletedPost[0]
  },
  updatePost(parent, {id, data}, {db}, info) {
    const {title, body, published} = data
    const post = db.posts.find((post) => String(post.id) === id)

    if (!post) throw new Error('Post not found')

    if (typeof title === 'string') post.title = title
    if (typeof body === 'string') post.body = body
    if (typeof published === 'boolean') post.published = published

    return post
  },
  createComment(parent, args, {db}, info) {
    const userExists = db.users.some((user) => user.id === args.data.author)
    const postExists = db.posts.some((post) => post.id === args.data.post)
    const postPublished = db.posts.some((post) => post.id === args.data.post && post.published)

    if (!userExists) throw new Error('User not found')
    if (!postExists) throw new Error('Post not found')
    if (!postPublished) throw new Error('Post not published')

    const comment = {
      ...args.data,
      id: uuidv4(),
    }

    db.comments.push(comment)

    return comment
  },
  deleteComment(parent, args, {db}, info) {
    const commentIndex = db.comments.findIndex(({id}) => String(id) === args.id)

    if (commentIndex < 0) throw new Error('Comment not found')

    const deletedComment = db.comments.splice(commentIndex, 1) // remove comment

    return deletedComment[0]
  },
  updateComment(parent, {id, data}, {db}, info) {
    const {text} = data
    const comment = db.comments.find((comment) => String(comment.id) === id)

    if (!comment) throw new Error('Comment not found')

    if (typeof text === 'string') comment.text = text

    return comment
  },
}

export default Mutation
