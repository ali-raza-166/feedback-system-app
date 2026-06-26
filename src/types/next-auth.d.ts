import "next-auth";
/*The declare module 'next-auth' block is a TypeScript feature used to augment the types from an existing module. In this case, 
it's extending the types provided by NextAuth. */
declare module "next-auth" {
  interface User {
    _id?: string;
    isVerified?: boolean;
    isAcceptingMessages?: boolean;
    username?: string;
  }
  interface Session {
    user: {
      _id?: string;
      isVerified?: boolean;
      isAcceptingMessages?: boolean;
      username?: string;
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    _id?: string;
    isVerified?: boolean;
    isAcceptingMessages?: boolean;
    username?: string;
  }
}

/*In TypeScript, the purpose of augmenting the module next-auth with custom fields in the User/Session interface within next-auth.d.ts 
is to extend the default types provided by NextAuth.js. This is necessary to ensure that TypeScript recognizes and understands 
the additional fields you want to use within your application. Without this augmentation, TypeScript would not be aware of these 
custom fields, leading to type errors and a lack of type safety when accessing these properties in your code 


Without these changes, you will be unbale to update the User, token, session objects in the next callbacks*/
