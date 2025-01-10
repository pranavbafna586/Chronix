import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      email: string;
      name: string;
      image?: string;
      userType: 'Doctor' | 'Patient';
    };
  }

  interface User {
    id: string;
    email: string;
    name: string;
    userType: 'Doctor' | 'Patient';
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    email: string;
    name: string;
    picture?: string;
    userType: 'Doctor' | 'Patient';
  }
}
