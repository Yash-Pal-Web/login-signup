const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth2").Strategy;
const FacebookStrategy = require("passport-facebook").Strategy;

passport.serializeUser((user, done) => {
  done(null, user);
});
passport.deserializeUser(function (user, done) {
  done(null, user);
});

passport.use(
  new GoogleStrategy(
    {
      clientID:
        "348460132997-d1j354mqcs3kbjtbgossegv8bkkkeau6.apps.googleusercontent.com", // Your Credentials here.
      clientSecret: "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", // Your Credentials here.
      callbackURL: "http://localhost:4000/auth/callback",
      passReqToCallback: true,
    },

//     function (request, accessToken, refreshToken, profile, done) {
//       // User.findOrCreate({username:profile.id,password:profile.displayName},function(err,profile){
//       return done(err, profile);
//       // })
//     }
//   )
// );

async (accessToken, refreshToken, profile, done) => {
  //get the user data from google 
  const newUser = {
    googleId: profile.id,
    displayName: profile.displayName,
    username: profile.id,
    //lastName: profile.name.familyName,
    image: profile.photos[0].value,
    email: profile.emails[0].value
  }

  try {
    //find the user in our database 
    let user = await User.findOne({ googleId: profile.id })
     
    if (user) {
      //If user present in our database.
      done(null, user)
    } else {
      // if user is not preset in our database save user data to database.
      user = await User.create(newUser)
      done(null, user)
    }
  } catch (err) {
    console.error(err)
  }
}
)
)






//facebook

passport.use(
  new FacebookStrategy(
    {
      clientID: "470631161626407",
      clientSecret: "66bf357d6074ed89c4ab77b06dd8a580",
      callbackURL: "http://localhost:5000/auth/facebook/callback",
      profileFields: ["id", "displayName"],
      passReqToCallback: true,
    },

    function (request, accessToken, refreshToken, profile, done) {
      User.findOrCreate(
        { username: profile.id, password: profile.displayName },
        function (err, user) {
          return done(err, profile);
        }
      );
      //const user={};
      // done(null,user);
    }
  )
);
