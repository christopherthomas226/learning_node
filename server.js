const express = require('express')

const mongooose = require('mongoose')

const bodyParser = require('body-parser')

const path = require('path')

const cors = require('cors')

const jwt = require('jsonwebtoken')

require('dotenv').config({path:'variables.env'})

const Recipe = require('./models/Recipe')
const User = require('./models/User')

//Bring in GraphQL - Express Middleware
const {graphiqlExpress, graphqlExpress} = require('apollo-server-express')
const {makeExecutableSchema} = require('graphql-tools')
const{typeDefs} = require('./schema')
const{resolvers} = require('./resolvers')

// Create schema
const schema = makeExecutableSchema({
    typeDefs,
    resolvers
})
//connects to database
mongooose.connect(process.env.MONGO_URI).then(()=> console.log('DB connected')).catch(err => console.error(err))


//intializes application
const app = express()

const corsOptions = {
    origin: 'http://localhost:3000',
    credentials: true
}
app.use(cors(corsOptions))

// set up JWT authentication middleware

app.use(async (req,res,next) => {
    const token = req.headers['authorization']
    if(token !== 'null'){
        try {
            const currentUser = await jwt.verify(token,process.env.SECRET)
            req.currentUser = currentUser
        } 
        catch(err){
            console.error(err)
        }
    }
    next()
})
// Create GraphiQl application
//app.use('/graphiql', graphiqlExpress({ endpointURL: '/graphql'}))

// Connect schema with GraphQL
app.use(
    '/graphql',
    bodyParser.json(),
    graphqlExpress(({currentUser}) => ({
        schema,
        context:{
            Recipe,
            User,
            currentUser
        }
    }))
)

if(process.env.NODE_ENV === 'production'){
    app.use(express.static('client/build'))

    app.get('*', (req,res) =>{
        res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'))
    })
}
const PORT = process.env.PORT || 4444

app.listen(PORT, () => {
    console.log(`Server listening on PORT ${PORT}`)
})