import { type NextRequest, NextResponse } from "next/server";
import { updateSession } from "@/utils/supabase/middleware";

export async function middleware(request: NextRequest) {
  const response = await updateSession(request);

  // Define the list of paths where you want to hide the Navbar
  const hideNavbarPaths = ['/', '/login', '/signup'];

  // Check if the current URL matches the paths where you want to hide the Navbar
  if (hideNavbarPaths.includes(request.nextUrl.pathname)) {
    // Set a cookie to hide the Navbar
    response.cookies.set('hideNavbar', 'true', { path: '/' });
  } else {
    // Clear the cookie if not on a hideNavbar path
    response.cookies.delete('hideNavbar');
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
