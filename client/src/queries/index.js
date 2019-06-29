import {gql} from 'apollo-boost'

import {recipeFragments} from './fragments'


/* Recipes Queries */
export const GET_ALL_RECIPES = gql`
query{
    getAllRecipes{
      _id
      name
      category
    }
}

`
export const GET_RECIPE = gql`
query($_id: ID!){
  getRecipe(_id: $_id){
    ...CompleteRecipe
  }
}

${recipeFragments.recipe}
`
export const SEARCH_RECIPES = gql`
  query($searchTerm: String){
    searchRecipes(searchTerm: $searchTerm){
      _id
      name
      likes
    }
  }
`


/* Recipe Mutation */

export const ADD_RECIPE = gql`
mutation($name: String!, $description: String!, 
  $category: String!, $instructions: String!,
   $userName: String){
  addRecipe(name: $name, description: $description, category: $category, instructions: $instructions, userName: $userName){
    ...CompleteRecipe
  }
}
${recipeFragments.recipe}

`
export const LIKE_RECIPE = gql`
mutation($_id: ID!, $userName: String!){
  likeRecipe(_id: $_id, userName: $userName){
   ...LikeRecipe
  }
}

${recipeFragments.like}
`

export const UNLIKE_RECIPE = gql`
mutation($_id: ID!, $userName: String!){
  unlikeRecipe(_id: $_id, userName: $userName){
    ...LikeRecipe
  }
}
${recipeFragments.like}
`

export const DELETE_USER_RECIPE = gql`
mutation($_id: ID!){
  deleteUserRecipe(_id: $_id){
    _id
  }
}
`

/* User Queries */

export const GET_CURRENT_USER = gql`
  query{
    getCurrentUser{
      userName
      joinDate
      email
      favorites {
        _id
        name
      }
    }
  }
`
export const GET_USER_RECIPES = gql`
  query($userName: String!){
    getUserRecipes(userName: $userName){
      _id
      name
      likes
    }
  }

`

/* User Mutations */
export const SIGNIN_USER = gql`
mutation($userName: String!, $password: String!){
  signinUser(userName:$userName, password: $password){
    token
  } 
}
`

export const SIGNUP_USER = gql`
mutation($userName: String!, $email: String!, $password: String!){
  signupUser(userName:$userName, email: $email, password: $password){
    token
  } 
}
`
