/** NextAuth 인증 설정 — JWT 세션 방식, PrismaAdapter 미사용 */
import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

type AuthProvider = NextAuthOptions["providers"][number];

function logAuthDebug(
  runId: string,
  hypothesisId: string,
  location: string,
  message: string,
  data: Record<string, unknown>
) {
  // #region agent log
  fetch("http://127.0.0.1:7242/ingest/a0870979-13d6-454e-aa79-007419c9500b",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({runId,hypothesisId,location,message,data,timestamp:Date.now()})}).catch(()=>{});
  // #endregion
}

function getAadCode(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const match = value.match(/AADSTS\d+/);
  return match?.[0] ?? null;
}

function buildLoggerMetadata(metadata: unknown): Record<string, unknown> {
  const obj = metadata && typeof metadata === "object" ? (metadata as Record<string, unknown>) : {};
  const errorObj = obj.error && typeof obj.error === "object" ? (obj.error as Record<string, unknown>) : {};
  const bodyObj = obj.body && typeof obj.body === "object" ? (obj.body as Record<string, unknown>) : {};
  const topLevelError = typeof obj.error === "string" ? obj.error : null;
  const topLevelDescription =
    typeof obj.error_description === "string" ? obj.error_description : null;
  const bodyError = typeof bodyObj.error === "string" ? bodyObj.error : null;
  const bodyDescription = typeof bodyObj.error_description === "string" ? bodyObj.error_description : null;
  return {
    metadataKeys: Object.keys(obj),
    topLevelError,
    topLevelDescriptionHead: topLevelDescription?.slice(0, 220) ?? null,
    errorName: typeof errorObj.name === "string" ? errorObj.name : null,
    errorMessageHead:
      typeof errorObj.message === "string" ? errorObj.message.slice(0, 180) : null,
    aadCode:
      getAadCode(topLevelError) ??
      getAadCode(topLevelDescription) ??
      getAadCode(bodyError) ??
      getAadCode(bodyDescription) ??
      getAadCode(errorObj.message),
  };
}

function isAllowedEmailDomain(email: string | null | undefined): boolean {
  if (!email) return false;
  const domains = (process.env.ALLOWED_EMAIL_DOMAINS ?? "hdec.co.kr")
    .split(",")
    .map((d) => d.trim().toLowerCase())
    .filter(Boolean);
  if (domains.length === 0) return false;
  const userDomain = email.split("@")[1]?.toLowerCase();
  if (!userDomain) return false;
  return domains.some((d) => userDomain === d);
}

function buildProviders(): AuthProvider[] {
  const providers: AuthProvider[] = [];

  const { AZURE_AD_CLIENT_ID, AZURE_AD_CLIENT_SECRET, AZURE_AD_TENANT_ID } =
    process.env;

  if (AZURE_AD_CLIENT_ID && AZURE_AD_CLIENT_SECRET && AZURE_AD_TENANT_ID) {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const AzureADProvider = require("next-auth/providers/azure-ad").default;
    providers.push(
      AzureADProvider({
        clientId: AZURE_AD_CLIENT_ID,
        clientSecret: AZURE_AD_CLIENT_SECRET,
        tenantId: AZURE_AD_TENANT_ID,
        authorization: { params: { scope: "openid profile email" } },
      })
    );
  }

  if (providers.length === 0) {
    // #region agent log
    fetch("http://127.0.0.1:7242/ingest/a0870979-13d6-454e-aa79-007419c9500b",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({runId:"auth-debug-1",hypothesisId:"H3",location:"lib/auth.ts:buildProviders:fallback",message:"credentials provider fallback activated",data:{hasAzureClientId:!!AZURE_AD_CLIENT_ID,hasAzureClientSecret:!!AZURE_AD_CLIENT_SECRET,hasAzureTenantId:!!AZURE_AD_TENANT_ID},timestamp:Date.now()})}).catch(()=>{});
    // #endregion
    providers.push(
      CredentialsProvider({
        name: "Guest",
        credentials: {},
        async authorize() {
          return { id: "guest", name: "Guest", email: "guest@example.com" };
        },
      })
    );
  } else {
    // #region agent log
    fetch("http://127.0.0.1:7242/ingest/a0870979-13d6-454e-aa79-007419c9500b",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({runId:"auth-debug-1",hypothesisId:"H3",location:"lib/auth.ts:buildProviders:azure",message:"azure provider configured",data:{providerCount:providers.length,hasAzureClientId:!!AZURE_AD_CLIENT_ID,hasAzureTenantId:!!AZURE_AD_TENANT_ID},timestamp:Date.now()})}).catch(()=>{});
    // #endregion
  }

  return providers;
}

export const authOptions: NextAuthOptions = {
  providers: buildProviders(),
  logger: {
    error(code, metadata) {
      logAuthDebug("auth-debug-4", "E1-E3", "lib/auth.ts:logger:error", "nextauth logger error", {
        code,
        hasMetadata: !!metadata,
        ...buildLoggerMetadata(metadata),
      });
    },
    warn(code) {
      logAuthDebug("auth-debug-4", "E1-E3", "lib/auth.ts:logger:warn", "nextauth logger warn", {
        code,
      });
    },
    debug(code, metadata) {
      logAuthDebug("auth-debug-4", "E1-E3", "lib/auth.ts:logger:debug", "nextauth logger debug", {
        code,
        hasMetadata: !!metadata,
        ...buildLoggerMetadata(metadata),
      });
    },
  },
  callbacks: {
    async signIn({ user, account, profile }) {
      const profileData = (profile ?? {}) as Record<string, string | undefined>;
      // #region agent log
      fetch("http://127.0.0.1:7242/ingest/a0870979-13d6-454e-aa79-007419c9500b",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({runId:"auth-debug-2",hypothesisId:"C1-C2",location:"lib/auth.ts:signIn:entry",message:"signIn callback entry",data:{provider:account?.provider??null,hasAzureClientId:!!process.env.AZURE_AD_CLIENT_ID,hasUser:!!user,hasEmail:!!user?.email,emailDomain:user?.email?.split("@")[1]??null,hasProfile:!!profile,hasProfileEmail:!!profileData.email,hasPreferredUsername:!!profileData.preferred_username,preferredUsernameDomain:profileData.preferred_username?.split("@")[1]??null,preferredUsernameHasExt:profileData.preferred_username?.includes("#EXT#")??false},timestamp:Date.now()})}).catch(()=>{});
      // #endregion
      if (!process.env.AZURE_AD_CLIENT_ID) return true;
      if (!user?.email) {
        // #region agent log
        fetch("http://127.0.0.1:7242/ingest/a0870979-13d6-454e-aa79-007419c9500b",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({runId:"auth-debug-1",hypothesisId:"H1",location:"lib/auth.ts:signIn:no-email",message:"signIn rejected: missing email",data:{hasUser:!!user},timestamp:Date.now()})}).catch(()=>{});
        // #endregion
        return false;
      }
      if (isAllowedEmailDomain(user.email)) {
        // #region agent log
        fetch("http://127.0.0.1:7242/ingest/a0870979-13d6-454e-aa79-007419c9500b",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({runId:"auth-debug-1",hypothesisId:"H2",location:"lib/auth.ts:signIn:allow",message:"signIn allowed by domain",data:{emailDomain:user.email.split("@")[1]??null},timestamp:Date.now()})}).catch(()=>{});
        // #endregion
        return true;
      }
      // #region agent log
      fetch("http://127.0.0.1:7242/ingest/a0870979-13d6-454e-aa79-007419c9500b",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({runId:"auth-debug-1",hypothesisId:"H2",location:"lib/auth.ts:signIn:deny-domain",message:"signIn denied by domain",data:{emailDomain:user.email.split("@")[1]??null},timestamp:Date.now()})}).catch(()=>{});
      // #endregion
      return "/unauthorized?reason=email_domain_not_allowed";
    },
    async jwt({ token, user, profile }) {
      // #region agent log
      fetch("http://127.0.0.1:7242/ingest/a0870979-13d6-454e-aa79-007419c9500b",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({runId:"auth-debug-1",hypothesisId:"H4",location:"lib/auth.ts:jwt:entry",message:"jwt callback entry",data:{hasUser:!!user,hasProfile:!!profile,tokenHasEmail:!!token.email,tokenHasName:!!token.name},timestamp:Date.now()})}).catch(()=>{});
      // #endregion
      if (user) {
        token.name = user.name ?? token.name;
        token.email = user.email ?? token.email;
      }
      if (profile) {
        const p = profile as Record<string, string>;
        token.name = token.name ?? p.name ?? p.preferred_username;
        token.email = token.email ?? p.email ?? p.preferred_username;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.name = (token.name as string | null) ?? session.user.name;
        session.user.email = (token.email as string | null) ?? session.user.email;
      }
      // #region agent log
      fetch("http://127.0.0.1:7242/ingest/a0870979-13d6-454e-aa79-007419c9500b",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({runId:"auth-debug-1",hypothesisId:"H4",location:"lib/auth.ts:session:exit",message:"session callback exit",data:{sessionHasUser:!!session.user,sessionHasEmail:!!session.user?.email,sessionHasName:!!session.user?.name},timestamp:Date.now()})}).catch(()=>{});
      // #endregion
      return session;
    },
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  session: {
    strategy: "jwt",
    maxAge: 60 * 60 * 8,
  },
  secret: process.env.NEXTAUTH_SECRET ?? "dev-secret-do-not-use-in-production",
};
