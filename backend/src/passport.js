import { Strategy as GoogleStrategy } from 'passport-google-oauth20'
import passport from 'passport'
import { User } from './models/User.model.js';
import { ApiError } from './utils/api-error.js';

passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.client_id,
            clientSecret: process.env.client_secret,
            callbackURL: `/api/auth/google/callback`,
            scope: ['profile', 'email'],
        },
        async (accessToken, refreshToken, profile, done) => {
            try {
                let user = await User.findOne({ googleId: profile.id });
                if (user) {
                    console.log('user exist', user)
                    return done(null, user)

                }
                const existUserWithEmail = await User.findOne({ email: profile.emails[0].value });


                if (existUserWithEmail) {
                    alart('error')
                    throw new ApiError(401, 'user already exist with this email')
                }
                let baseUsername = profile.displayName.toLowerCase().replace(/\s+/g, '');
                let finalUsername = baseUsername;
                let counter = 0;

                while (await User.findOne({ username: finalUsername })) {
                    counter++;
                    finalUsername = `${baseUsername}${counter}`;
                }


                if (!user) {
                    // New signup
                    user = await User.create({
                        googleId: profile.id,
                        email: profile.emails[0].value,
                        username: finalUsername,
                        avatar: profile.photos[0].value,

                    });
                }

                return done(null, user);
            } catch (err) {
                console.log('sign up with google error', err)
                return done(err, null);

            }
        }
    )
)
passport.serializeUser(async (user, done) => {
    done(null, user._id)
})
passport.deserializeUser(async (id, done) => {
    const user = await User.findById(id);
    done(null, user);
})