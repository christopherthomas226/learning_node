import React from 'react'
import {withRouter} from 'react-router-dom'
import {Mutation} from 'react-apollo'
import {SIGNUP_USER} from '../../queries'
import Error from '../Error'

const intialState = {
    userName: "",
    email: "",
    password: "",
    passwordConfirmation: "",
}

class Signup extends React.Component{
    state = {...intialState}

    clearState = () => {
        this.setState({...intialState})

    }

    handleChange = event =>{
        const{name, value} = event.target
        this.setState({
            [name]: value
        })
    }

    handleSubmit = (event, signupUser) => {
        event.preventDefault()
        signupUser().then(async({data}) => {
            //console.log(data)
            localStorage.setItem('token', data.signupUser.token)
            await this.props.refetch()
            this.clearState()
            this.props.history.push('/')
        })
    }

    validateForm = () =>{
        const {userName, email, password, passwordConfirmation} = this.state
        
        const isInvalid = !userName || !email || !password || password !== passwordConfirmation
        
        return isInvalid
    }
    render(){
        const {userName, email, password, passwordConfirmation} = this.state

        return(
            <div className="App">
                <h2 className="App">Signup</h2>
                <Mutation mutation={SIGNUP_USER} variables={{userName, email,password}}>
                    {(signupUser, {data, loading, error})=> {
                        return (
                        <form className ="form" onSubmit={event => this.handleSubmit(event,signupUser)}>
                            <input type="text" name="userName" placeholder="UserName" value={userName} onChange={this.handleChange}/>
                            <input type="email" name="email" placeholder="Email Adress" value={email} onChange={this.handleChange}/>
                            <input type="password" name="password" placeholder="password" value={password} onChange={this.handleChange}/>
                            <input type="password" name="passwordConfirmation" placeholder="Confirm Password" value={passwordConfirmation} onChange={event => this.handleChange(event, signupUser)}/>
                            <button type="submit" disabled={loading || this.validateForm()} className="button-primary">Submit</button>
                            {error && <Error error={error}/>}
                        </form>
                        )
                    }}
              
                </Mutation>
            </div>
        )
    }
}

export default withRouter(Signup)