import { authMiddleware } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
export default authMiddleware({
  publicRoutes: ["/site", "/api/uploadthing","/api/stripe/create-customer"],
  async beforeAuth(auth, req) {},
  async afterAuth(auth, req) {
    const url = req.nextUrl;
    const searchParams = url.searchParams.toString();
    let hostName = req.headers;

    const pathWhitSearchparams = `${url.pathname}${
      searchParams.length >= 0 ? `?${searchParams}` : ""
    }`;

    const custamSubDomane = hostName
      .get("host")
      ?.split(`${process.env.NEXT_PUBLIC_DOMAIN}`).filter(Boolean)[0];

    if (custamSubDomane) {
      return NextResponse.rewrite(
        new URL(`/${custamSubDomane}${pathWhitSearchparams}`,req.url)
      );
    }
    if (url.pathname === "/sign-in" || url.pathname === "/sign-up") {
      return NextResponse.redirect(new URL(`/agency/sign-in`, req.url));
    }
    if(url.pathname.startsWith("/agency")|| url.pathname.startsWith("/subaccount")){
      return NextResponse.rewrite(new URL(`${pathWhitSearchparams}`, req.url));
    }
    if (
      url.pathname === "/" ||
      url.pathname === "/site" ||
      url.host === process.env.NEXT_PUBLIC_DOMAIN
    ) {
      return NextResponse.rewrite(new URL(`${"/site"}`, req.url));
    }

  },
});

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)']
};
