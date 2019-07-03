exports.typeDefs = `

type Recipe {
    _id: ID
    name: String!
    category: String!
    description: String!
    instructions: String!
    createdDate: String
    likes: Int
    userName: String

}


type User {
    _id: ID
    userName: String! @unique
    password: String!
    email: String!
    joinDate: String
    favorites: [Recipe]
}

type Query {
    getAllRecipes: [Recipe]
    getRecipe(_id: ID!): Recipe
    searchRecipes(searchTerm: String): [Recipe]

    getCurrentUser: User
    getUserRecipes(userName: String!): [Recipe]
}

type Token{
    token: String!
}

type Mutation{
    addRecipe(name: String!, description: String!, 
        category: String!, instructions: String!,
         userName: String): Recipe
    
    likeRecipe(_id: ID!, userName: String!): Recipe
    unlikeRecipe(_id: ID!, userName: String!): Recipe
    deleteUserRecipe(_id: ID!): Recipe
    signinUser(userName: String!, password: String!): Token
    signupUser(userName: String!, email: String!, password: String!): Token
}

`