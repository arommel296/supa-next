import { SignInWithPasswordCredentials, SupabaseClient } from "@supabase/supabase-js"
import NextAuth from "next-auth"
import { Provider } from "@supabase/supabase-js"
import { SessionProvider } from "next-auth/react"
import { OAuthResponse } from "@supabase/supabase-js"
// import GithubProvider from "next-auth/providers/github"
import { CredentialsProvider } from "next-auth/providers/credentials"
import Credentials from "next-auth/providers/credentials"
import { createClient } from "@/utils/supabase/server"

const handler = NextAuth({
    providers: [
        // GithubProvider({
        //   clientId: process.env.GITHUB_ID as string,
        //   clientSecret: process.env.GITHUB_SECRET as string,
        // }),
        Credentials({
          name: "Credentials",
          // `credentials` is used to generate a form on the sign in page.
          // You can specify which fields should be submitted, by adding keys to the `credentials` object.
          // e.g. domain, username, password, 2FA token, etc.
          // You can pass any HTML attribute to the <input> tag through the object.
          credentials: {
            username: { label: "Username", type: "text", placeholder: "jsmith" },
            password: { label: "Password", type: "password" }
          },
          async authorize(credentials, req) {
            // Add logic here to look up the user from the credentials supplied
            createClient().auth.getUser()
            createClient().auth.signInWithPassword(credentials as unknown as SignInWithPasswordCredentials)
            const user = { id: "1", name: "J Smith", email: "jsmith@example.com" }
      
            if (user) {
              // Any object returned will be saved in `user` property of the JWT
              return user
            } else {
              // If you return null then an error will be displayed advising the user to check their details.
              return null
      
              // You can also Reject this callback with an Error thus the user will be sent to the error page with the error message as a query parameter
            }
          }
        }),
        {
          id: process.env.SUPABASE_ID as string,
          name: "Supabase",
          type: "oauth",
          authorization: process.env.NEXT_PUBLIC_SUPABASE_URL+"/oauth/authorize",
          token: process.env.NEXT_PUBLIC_SUPABASE_URL+"/auth/v1/token?grant_type=refresh_token",
          userinfo: process.env.NEXT_PUBLIC_SUPABASE_URL+"/auth/v1/user",
          profile(profile) {
            return {
              id: profile.id,
              name: profile.supabase_account?.profile.nickname,
              email: profile.supabase_account?.email,
              image: profile.supabase_account?.profile.profile_image_url,
            }
          },
        }
      ],
})

export { handler as GET, handler as POST }