"use client";
import React, { useEffect } from 'react'
import { User } from '../interfaces/user.interface'
import axios, { AxiosError } from 'axios'
import { useRouter, usePathname } from 'next/navigation'
import LoadingComponent from '../components/Loading.component';



const Auth = <P extends User>(
    WrappedComponent: React.ComponentType<P>
) => {

    const AuthenticatedComponent = (prop: Omit<P, "users">) => {
        const API = process.env.NEXT_PUBLIC_API_URL
        const router = useRouter();
        const route = usePathname();
        const noLoadingOnThisRoutes=['/api/login','/']
        console.log("Current route:", route);
        const [user, setUser] = React.useState<User | null>(null)
        const fetchLoggedInUser = async () => {
            try {
                const response = await axios.get(`${API}/logged-in-user`, { withCredentials: true });
                const data = response.data.data;

                console.log("Logged in user data:", data);

                setUser(data);
            } catch (error: unknown) {
                if (error instanceof AxiosError) {
                    console.log("Error fetching logged in user:", error.response?.data);
                    if (error.response?.data.error === "Unauthorized" || "Invalid token") {
                        if (route !== '/') {
                            setUser(null);

                            return router.push('/api/login?redirectTo=' + encodeURIComponent(window.location.href));
                        }

                    }

                }
            }
        }
        useEffect(() => {

            fetchLoggedInUser();
        }, [])
        if (!user && !noLoadingOnThisRoutes.includes(route)) {
            return (
                <LoadingComponent />
            )

        }

        return <WrappedComponent {...(prop as P)} user={user} />
    }
    return AuthenticatedComponent
}

export default Auth
