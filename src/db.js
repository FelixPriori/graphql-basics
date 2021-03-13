import {v4 as uuidv4} from 'uuid'

const userIDs = {
  felix: uuidv4(),
  kim: uuidv4(),
  kent: uuidv4(),
}

const users = [
  {
    id: userIDs.felix,
    name: 'Felix',
    email: 'felix@example.com',
    age: '29',
  },
  {
    id: userIDs.kim,
    name: 'Kim',
    email: 'kim@example.com',
    age: '33',
  },
  {
    id: userIDs.kent,
    name: 'Kent',
    email: 'kent@example.com',
    age: '51',
  },
]

const posts = [
  {
    id: '1',
    title: 'How to do stuff',
    body: 'You do it and then its done lol',
    published: true,
    author: userIDs.felix,
  },
  {
    id: '2',
    title: 'How eat stuff',
    body: 'Use a fork dummy lol',
    published: false,
    author: userIDs.kent,
  },
  {
    id: '3',
    title: 'How build stuff',
    body: 'Just pile them lol',
    published: false,
    author: userIDs.felix,
  },
]

const comments = [
  {
    id: '11',
    text: 'This is the best post',
    author: userIDs.kim,
    post: '1',
  },
  {
    id: '12',
    text: 'This is the worst post',
    author: userIDs.kent,
    post: '1',
  },
  {
    id: '13',
    text: 'I dont know if its good or bad',
    author: userIDs.felix,
    post: '3',
  },
  {
    id: '14',
    text: 'what am i doing here',
    author: userIDs.kim,
    post: '2',
  },
]

const db = {
  users,
  posts,
  comments,
}

export default db
