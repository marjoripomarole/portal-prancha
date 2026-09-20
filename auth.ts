import NextAuth from 'next-auth';
import Google from 'next-auth/providers/google';

export const {handlers, auth} = NextAuth({
  providers: [Google({authorization: {params: {scope: 'openid email profile', prompt: 'select_account'}}})],
  session: {strategy: 'jwt', maxAge: 7 * 24 * 60 * 60},
  pages: {error: '/entrar'},
  callbacks: {
    signIn({account, profile}) {
      return account?.provider === 'google' && profile?.email_verified === true;
    },
    jwt({token, account}) {
      if (account?.provider === 'google') token.uid = `google:${account.providerAccountId}`;
      return token;
    },
    session({session, token}) {
      if (session.user) session.user.id = typeof token.uid === 'string' ? token.uid : '';
      return session;
    },
  },
});

export async function getUser() {
  const session = await auth();
  const user = session?.user;
  return user?.id ? {userId: user.id, displayName: user.name || 'Aluno', email: user.email} : null;
}
