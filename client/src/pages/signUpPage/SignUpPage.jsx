import { SignUp } from '@clerk/clerk-react'
import './signUpPage.css'

const SignUpPage = () => {
  return (
    <div className='signUpPage'><SignUp path="/signUp" signInUrl="/signIn"/></div>
  )
}

export default SignUpPage