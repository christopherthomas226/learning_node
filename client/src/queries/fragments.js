import {gql} from 'apollo-boost'

export const recipeFragments = {
    recipe: gql`
        fragment CompleteRecipe on Recipe {
            _id
            name
            category
            description
            instructions
            createdDate
            likes
            userName
        }
    `,

    like: gql`
        fragment LikeRecipe on Recipe{
            _id
            likes
        }
    
    `
}