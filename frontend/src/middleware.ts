import { NextRequest, NextResponse } from "next/server";



export function middleware(request:NextRequest){
 
    const accessToken = request.cookies.get('accessToken')?.value
      console.log('accessToken', accessToken)
    if(!accessToken){
        return NextResponse.redirect(new URL('/api/login', request.url))
    }
  return NextResponse.next()
    
   

}

export const config = {
  matcher: ['/api/chat/:path*'],
};