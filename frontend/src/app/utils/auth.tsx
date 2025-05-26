"use client";
import React, { useEffect } from 'react'
import { User } from '../interfaces/user.interface'
import axios, { AxiosError } from 'axios'
import { useRouter } from 'next/navigation'



const Auth =  <P extends User>(
    WrappedComponent: React.ComponentType<P>
) =>{
    
const AuthenticatedComponent=(prop:Omit<P,"users">)=>{
    const API = process.env.NEXT_PUBLIC_API_URL
    const router = useRouter();
    const [user, setUser] = React.useState<User | null>(null)
    
    useEffect(() => {
        const fetchLoggedInUser = async () => {
            try {
                const response = await axios.get(`${API}/logged-in-user`, { withCredentials: true });
                const data = response.data.data;

                console.log("Logged in user data:", data);

      if (!data) {
        return router.push('/api/login');
      }

                setUser(data);
            } catch (error:unknown) {
                if (error instanceof AxiosError) {
                    console.log("Error fetching logged in user:", error.response?.data);
                    if (error.response?.data.error==="Invalid token") {
                     return   router.push('/api/login');
                        
                    }
                    
                }
            }
        }
        fetchLoggedInUser();
    },[])
    if (!user) {
        return (
            <div className="bg-gray-50 flex flex-col items-center justify-center min-h-screen">
              <h5 className='text-black font-medium text-lg'>Loading...</h5>
            </div>
        )
        
    }

    return <WrappedComponent {...(prop as P )} user={user} />
}
return AuthenticatedComponent
}

export default Auth
