const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')

const createToken = (user, secret, expiresIn) => {
    const {userName, email} = user
    return jwt.sign({userName, email}, secret,{expiresIn})
}
exports.resolvers = {
    Query: {
        getAllRecipes: async(root, args, {Recipe}) => {
            const allRecipes = await Recipe.find().sort({
                createdDate: 'desc'
            })
            return allRecipes
        },

        getRecipe: async (root, {_id}, {Recipe}) => {
            const recipe = await Recipe.findOne({_id})
            return recipe
        },

        searchRecipes: async (root, {searchTerm}, {Recipe}) => {
            if(searchTerm){
                const searchResults = await Recipe.find({
                    $text: {$search: searchTerm}
                }, {
                    score: {$meta: "textScore"}
                }).sort({
                    score: {$meta: "textScore"}
                })
                return searchResults

            }else{
                const recipes = await Recipe.find().sort({likes: 'desc', createdDate: 'desc'})
                return recipes
            }
        },

        getUserRecipes: async (root,{userName}, {Recipe}) => {
            const userRecipes = await Recipe.find({userName}).sort({
                createdDate: 'desc'
            }) 
            return userRecipes
        },

        getCurrentUser: async (root, args, {currentUser, User}) => {
            if(!currentUser){
                return null
            }

            const user = await User.findOne({userName: currentUser.userName})
            .populate({
                path: 'favorites',
                model: 'Recipe'
            })

            return user
        }
    },
    Mutation:{
        addRecipe: async(root, {name, description, category,
            instructions, userName}, {Recipe}) => {
                 const newRecipe = await new Recipe({
                     name,
                     description,
                     category,
                     instructions,
                     userName
                 }).save()
                 return newRecipe
        },

        likeRecipe: async(root, {_id, userName}, {Recipe, User}) => {
            const recipe = await Recipe.findOneAndUpdate({_id}, {$inc:{likes: 1}})
            const user = await User.findOneAndUpdate({userName}, {$addToSet:{favorites: _id }})
            return recipe
        },

        unlikeRecipe: async(root, {_id, userName}, {Recipe, User}) => {
            const recipe = await Recipe.findOneAndUpdate({_id}, {$inc:{likes: -1}})
            const user = await User.findOneAndUpdate({userName}, {$pull:{favorites: _id }})
            return recipe
        },

        deleteUserRecipe: async (root, {_id}, {Recipe}) => {
            const recipe = await Recipe.findOneAndRemove({_id})
            return recipe
        },

        signinUser: async (root, {userName, password}, {User}) => {
            const user = await User.findOne({userName})
            if(!user){
                throw new Error('User not found')
            }
            const isValidPassword = await bcrypt.compare(password, user.password)
            if(!isValidPassword){
                throw new Error('Invalid password')
            }
            return{token: createToken(user,process.env.SECRET, '1hr')}
        },

        signupUser: async(root, {userName, email, password}, {User}) => {
            const user = await User.findOne({userName})
            if(user){
                throw new Error('User already exists')
            }

            const newUser = await new User({
                userName,
                email,
                password
            }).save()
            return{token: createToken(newUser,process.env.SECRET, '1hr')}
        }
            
    }
}