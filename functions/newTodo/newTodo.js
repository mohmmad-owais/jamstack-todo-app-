const { ApolloServer, gql } = require('apollo-server-lambda')
var faunadb = require('faunadb'),
  q = faunadb.query;

const typeDefs = gql`
  type Query {
    todos: [Todo!]
  }
  type Mutation {
    addTodo(task: String!): Todo
    deleteTodo(id: ID!): Todo
  }
  type Todo {
    id: ID!
    task: String
    title: String
    status: Boolean
  }
`

const resolvers = {
  Query: {
    todos: async (root, args, context) => {
      try {
        var adminClient = new faunadb.Client({ secret: 'fnAEG3BqOfACATgo-H6sTqN0ZSM3LGQrbzyHCws2' });
        const result = await adminClient.query(
          q.Map(
            q.Paginate(q.Documents(q.Collection('todos'))),
            q.Lambda(x => q.Get(x))
          ));

        console.log(result.data)

        return result.data.map((d)=>{
          return {
            id: d.ref.id,
            status: d.data.status,
            task: d.data.task,
            title: d.data.title
          }
        })
      }
      catch (err) {
        console.log(err)
      }
    }
    // authorByName: (root, args, context) => {
    //   console.log('hihhihi', args.name)
    //   return authors.find(x => x.name === args.name) || 'NOTFOUND'
    // },
  },
  Mutation: {
    addTodo: async (_, { task }) => {
      try {
        var adminClient = new faunadb.Client({ secret: 'fnAEG3BqOfACATgo-H6sTqN0ZSM3LGQrbzyHCws2' });
        const result = await adminClient.query(
          q.Create(
            q.Collection('todos'),
            {
              data: {
                task: task,
                status: true
              }
            },
          )
        )
        return result.ref.data;
      }
      catch (err) {
        console.log(err)
      }
    },
    deleteTodo: async(_, {id}) => {
      try{
        var adminClient = new faunadb.Client({ secret: 'fnAEG3BqOfACATgo-H6sTqN0ZSM3LGQrbzyHCws2' });

        const result = await adminClient.query(
          q.Delete
            (q.Ref
              (q.Collection('todos'), id))
        )

        console.log('id', id)
        console.log(result)
        
      }
      catch(error){
        console.log(error)
      }
    }
  }
}

const server = new ApolloServer({
  typeDefs,
  resolvers,
})

exports.handler = server.createHandler()
