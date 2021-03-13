import {v4 as uuidv4} from 'uuid'

const Mutation = {
  createUser(parent, {data}, {db}, info) {
    const emailTaken = db.users.some(({email}) => data.email === email)

    if (emailTaken) throw new Error('Email taken')

    const user = {
      ...data,
      id: uuidv4(),
    }

    db.users.push(user)

    return user
  },
  deleteUser(parent, args, {db}, info) {
    const userIndex = db.users.findIndex(({id}) => id === args.id)

    if (userIndex < 0) throw new Error('User not found')

    const [user] = db.users.splice(userIndex, 1) // remove user

    // clean up posts from deleted user
    db.posts = db.posts.filter((post) => {
      const match = post.author === args.id

      // clean up comments on deleted posts
      if (match) db.comments = db.comments.filter(({post}) => post !== post.id)

      return !match
    })

    // clean up comments from deleted user
    db.comments = db.comments.filter(({author}) => author !== args.id)

    return user
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
  createPost(parent, {data}, {db, pubsub}, info) {
    const userExists = db.users.some((user) => user.id === data.author)

    if (!userExists) throw new Error('User not found')

    const post = {
      ...data,
      id: uuidv4(),
    }

    db.posts.push(post)

    if (data.published)
      pubsub.publish(`post`, {
        post: {
          mutation: 'CREATED',
          data: post,
        },
      })

    return post
  },
  deletePost(parent, args, {db, pubsub}, info) {
    const postIndex = db.posts.findIndex(({id}) => id === args.id)

    if (postIndex < 0) throw new Error('Post not found')

    const [post] = db.posts.splice(postIndex, 1) // remove post

    // clean up comments on deleted post
    db.comments = db.comments.filter((comment) => comment.post === args.id)

    if (post.published)
      pubsub.publish(`post`, {
        post: {
          mutation: 'DELETED',
          data: post,
        },
      })

    return post
  },
  updatePost(parent, {id, data}, {db, pubsub}, info) {
    const {title, body, published} = data
    const post = db.posts.find((post) => post.id === id)

    const originalPost = {...post}

    if (!post) throw new Error('Post not found')

    if (typeof title === 'string') post.title = title
    if (typeof body === 'string') post.body = body
    if (typeof published === 'boolean') {
      post.published = published

      if (originalPost.published && !post.published) {
        // deleted
        pubsub.publish(`post`, {
          post: {
            mutation: 'DELETED',
            data: originalPost,
          },
        })
      } else if (!originalPost.published && post.published) {
        // created
        pubsub.publish(`post`, {
          post: {
            mutation: 'CREATED',
            data: post,
          },
        })
      }
    } else if (post.published) {
      // updated
      pubsub.publish(`post`, {
        post: {
          mutation: 'UPDATED',
          data: post,
        },
      })
    }

    return post
  },
  createComment(parent, {data}, {db, pubsub}, info) {
    const userExists = db.users.some((user) => user.id === data.author)
    const postExists = db.posts.some((post) => post.id === data.post)
    const postPublished = db.posts.some((post) => post.id === data.post && post.published)

    if (!userExists) throw new Error('User not found')
    if (!postExists) throw new Error('Post not found')
    if (!postPublished) throw new Error('Post not published')

    const comment = {
      ...data,
      id: uuidv4(),
    }

    db.comments.push(comment)

    pubsub.publish(`comment ${data.post}`, {
      comment: {
        mutation: 'CREATED',
        data: comment,
      },
    })

    return comment
  },
  deleteComment(parent, args, {db, pubsub}, info) {
    const commentIndex = db.comments.findIndex(({id}) => id === args.id)

    if (commentIndex < 0) throw new Error('Comment not found')

    const [comment] = db.comments.splice(commentIndex, 1) // remove comment

    pubsub.publish(`comment ${comment.post}`, {
      comment: {
        mutation: 'DELETED',
        data: comment,
      },
    })

    return comment
  },
  updateComment(parent, {id, data}, {db, pubsub}, info) {
    const {text} = data
    const comment = db.comments.find((comment) => comment.id === id)

    if (!comment) throw new Error('Comment not found')

    if (typeof text === 'string') comment.text = text

    pubsub.publish(`comment ${comment.post}`, {
      comment: {
        mutation: 'UPDATED',
        data: comment,
      },
    })

    return comment
  },
}

export default Mutation
