import { SignIn } from '@clerk/clerk-react'
import './signInPage.css'

const SignInPage = () => {
  return (
    <div className='signInPage'>
      <SignIn path="/signIn" signUpUrl="/signUp" forceRedirectUrl="/dashboard"/>
    </div>
  )
}

export default SignInPage