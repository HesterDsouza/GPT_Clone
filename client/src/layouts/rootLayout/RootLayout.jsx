import './rootLayout.css'
import { Link, Outlet } from 'react-router-dom'
import { ClerkProvider, SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/clerk-react";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Publishable Key")
}

const queryClient = new QueryClient()

const RootLayout = () => {
  return (
    <ClerkProvider publishableKey={PUBLISHABLE_KEY} afterSignOutUrl="/">
      <QueryClientProvider client={queryClient}>
        <div className='rootLayout'>
            <header>
                <Link to="/" className='hLogo'>
                <img src="/phoenixLogo2.png" alt="Phoenix Logo" className='logo' title="Image by freepik"/>
                <span>PHOENIX AI</span>
                </Link>
                <div className="user">
                  <SignedOut>
                      <SignInButton />
                  </SignedOut>
                  <SignedIn>
                      <UserButton />
                  </SignedIn>
                </div>
            </header>
            <main>
                <Outlet/>
            </main>
            {/* <footer>
              <p><a href="https://www.freepik.com/free-vector/hand-drawn-phoenix-design_7334615.htm#fromView=search&page=1&position=51&uuid=02248061-b5f3-4091-97b6-d54cca0703ce">Image by freepik</a></p>
            </footer> */}
        </div>
      </QueryClientProvider>
    </ClerkProvider>
  )
}

export default RootLayout