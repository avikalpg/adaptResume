import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertUserSchema } from "@shared/schema";
import session from "express-session";
import passport from "passport";
import { Strategy as OpenIDConnectStrategy } from "passport-openidconnect";

// Debug logging
console.log("Environment Variables:");
console.log("CALLBACK_URL:", process.env.CALLBACK_URL);
console.log("REPL_ID:", process.env.REPL_ID);
console.log("REPL_OWNER:", process.env.REPL_OWNER);
console.log("REPL_SLUG:", process.env.REPL_SLUG);
console.log("LINKEDIN_CLIENT_ID:", process.env.LINKEDIN_CLIENT_ID);
console.log("LINKEDIN_CLIENT_SECRET:", process.env.LINKEDIN_CLIENT_SECRET);
console.log("SESSION_SECRET:", process.env.SESSION_SECRET);

const LINKEDIN_CLIENT_ID = process.env.LINKEDIN_CLIENT_ID || "";
const LINKEDIN_CLIENT_SECRET = process.env.LINKEDIN_CLIENT_SECRET || "";
const CALLBACK_URL = process.env.CALLBACK_URL
  ? process.env.CALLBACK_URL
  : "http://localhost:5000/api/auth/linkedin/callback";

console.log("Final Callback URL:", CALLBACK_URL);
console.log("LinkedIn Client ID length:", LINKEDIN_CLIENT_ID.length);

export async function registerRoutes(app: Express): Promise<Server> {
  const httpServer = createServer(app);

  app.use(
    session({
      secret: process.env.SESSION_SECRET || "secret",
      resave: false,
      saveUninitialized: false,
    }),
  );

  app.use(passport.initialize());
  app.use(passport.session());

  passport.serializeUser((user: any, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id: number, done) => {
    try {
      const user = await storage.getUser(id);
      done(null, user);
    } catch (err) {
      done(err);
    }
  });

  passport.use(
    new OpenIDConnectStrategy(
      {
        issuer: "https://www.linkedin.com",
        authorizationURL: "https://www.linkedin.com/oauth/v2/authorization",
        tokenURL: "https://www.linkedin.com/oauth/v2/accessToken",
        userInfoURL: "https://api.linkedin.com/v2/userinfo",
        clientID: LINKEDIN_CLIENT_ID,
        clientSecret: LINKEDIN_CLIENT_SECRET,
        callbackURL: CALLBACK_URL,
        scope: ["openid", "profile", "email"],
      },
      async (issuer: string, profile: any, done: any) => {
        console.log("Using callback URL:", CALLBACK_URL);
        try {
          let user = await storage.getUserByLinkedInId(profile.id);

          if (!user) {
            const userData = {
              linkedinId: profile.id,
              accessToken: profile.accessToken,
              name: profile.displayName || profile.name?.formatted || "",
              email: profile.email || "",
              profileData: {
                headline: profile.headline || "",
                summary: "",
                positions: [],
                education: [],
                skills: [],
              },
            };

            const validatedData = insertUserSchema.parse(userData);
            user = await storage.createUser(validatedData);
          }

          return done(null, user);
        } catch (err) {
          return done(err as Error);
        }
      },
    ),
  );

  app.get("/api/auth/linkedin", (req, res, next) => {
    console.log("Redirecting to LinkedIn with callback URL:", CALLBACK_URL);
    passport.authenticate("openidconnect")(req, res, next);
  });

  app.get(
    "/api/auth/linkedin/callback",
    passport.authenticate("openidconnect", {
      successRedirect: "/profile",
      failureRedirect: "/",
    }),
  );

  app.get("/api/auth/user", (req, res) => {
    if (!req.user) {
      return res.status(401).json({ message: "Not authenticated" });
    }
    res.json(req.user);
  });

  app.post("/api/auth/logout", (req, res) => {
    req.logout(() => {
      res.json({ success: true });
    });
  });

  return httpServer;
}