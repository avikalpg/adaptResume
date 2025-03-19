import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertUserSchema } from "@shared/schema";
import session from "express-session";
import passport from "passport";
import { Strategy as LinkedInStrategy } from "passport-linkedin-oauth2";

const LINKEDIN_CLIENT_ID = process.env.LINKEDIN_CLIENT_ID || "";
const LINKEDIN_CLIENT_SECRET = process.env.LINKEDIN_CLIENT_SECRET || "";
const CALLBACK_URL = process.env.REPL_SLUG 
  ? `https://${process.env.REPL_SLUG}.${process.env.REPL_OWNER}.repl.co/api/auth/linkedin/callback`
  : "http://localhost:5000/api/auth/linkedin/callback";

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
    new LinkedInStrategy(
      {
        clientID: LINKEDIN_CLIENT_ID,
        clientSecret: LINKEDIN_CLIENT_SECRET,
        callbackURL: CALLBACK_URL,
        scope: ["r_liteprofile", "r_emailaddress"],
      },
      async (accessToken, refreshToken, profile, done) => {
        console.log("Using callback URL:", CALLBACK_URL);
        try {
          let user = await storage.getUserByLinkedInId(profile.id);

          if (!user) {
            const userData = {
              linkedinId: profile.id,
              accessToken,
              name: profile.displayName,
              email: profile.emails[0].value,
              profileData: {
                headline: profile._json.headline || "",
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

  app.get("/api/auth/linkedin", passport.authenticate("linkedin"));

  app.get(
    "/api/auth/linkedin/callback",
    passport.authenticate("linkedin", {
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