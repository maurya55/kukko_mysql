const express=require("express");
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const passport= require("passport");
const session=require('express-session');
const FacebookStrategy = require('passport-facebook').Strategy;

var {OAuth2Client} = require('google-auth-library');
    var client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
    // const auth = new GoogleAuth({
    //   scopes: 'https://www.googleapis.com/auth/cloud-platform'
    // });


exports.GoogleSocialLogin=async (app)=>{


    try{

      app.use(session({
        resave: false,
        saveUninitialized: true,
        secret: 'SECRET' 
      }));

  
    app.use(passport.initialize());
    app.use(passport.session());

    // var client = new auth.OAuth2( process.env.GOOGLE_CLIENT_ID,process.env.GOOGLE_CLIENT_SECRET, process.env.GOOGLE_CLIENT_CALLBACK);
      

    passport.serializeUser(function (user,cb){
        cb(null,user);
    })

    passport.deserializeUser(function (obj,cb){
        cb(null,obj);
    })

    passport.use(new GoogleStrategy({
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: process.env.GOOGLE_CLIENT_CALLBACK,
      },
      function(accessToken, refreshToken,params, profile, done) {
        // User.findOrCreate({ googleId: profile.id }, function (err, user) {
        // });
        // console.log(user);
        console.log("start accessToken")
        console.log(params.id_token);
        console.log(accessToken);
        console.log("end accessToken");
        console.log(accessToken,refreshToken,profile);
         done(null, profile);

        // res.redirect("/loginsuccess");

      }
    ));

    app.get("/loginsuccess",(req,res)=>{
      console.log("loginsuccess");
        res.send("loginsuccess");
    })

      app.get("/auth/google",passport.authenticate('google',{ scope: ['email'] }));
      app.get('/auth/google/callback', 
      passport.authenticate('google', { failureRedirect: '/failedlogin' }),
      function(req, res) {
        // Successful authentication, redirect home.
        console.log(req.user,req.isAuthenticated())
        console.log("login successful");
        res.redirect('/loginsuccess');
        res.send("login successfulla")
      });

      app.get("/failedlogin",(req,res)=>{
        console.log("failed to login");
        res.send("user login failed");
      })
      app.get("/logout",(req,res,next)=>{
        req.logout();
      })
    }

    catch(err)
    {
      console.log(err);
    }
}


exports.GoogleSocialTokenVerify=async(app)=>{
  var token="eyJhbGciOiJSUzI1NiIsImtpZCI6IjFiZDY4NWY1ZThmYzYyZDc1ODcwNWMxZWIwZThhNzUyNGM0NzU5NzUiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL2FjY291bnRzLmdvb2dsZS5jb20iLCJhenAiOiI2NTI4NDIxNzA4MzAtdTk1MWMyNXFqa3RqdGxxZWltdGR0OWI3YWE0ZzZzZnMuYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJhdWQiOiI2NTI4NDIxNzA4MzAtdTk1MWMyNXFqa3RqdGxxZWltdGR0OWI3YWE0ZzZzZnMuYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJzdWIiOiIxMDkzMDU4MTY5Nzc5ODEyNTc0MDkiLCJlbWFpbCI6InJhaHVsLnRvcnRhbGFiekBnbWFpbC5jb20iLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwiYXRfaGFzaCI6Ikt1MGR0bGgzN2ZvbWg5WVBzMTBRbHciLCJpYXQiOjE2NTc0Mzc0MzksImV4cCI6MTY1NzQ0MTAzOX0.NhhYWEoIra6Lharcy4YKsX8B1vhbK5tlzcOc8wGqnBRf5ErDy3SJsIvMgdJe6ygYOHcXuTkp_8uMmS3epTjwAAEpgC4MY2ul8Wsr1NxJUKlh-JPnFW6OH4zzYOwRG2QpWha9uaihoo4P-E592_mg8J8w9aARKFNGbiyEhWKF2vywj8UaPaGyQPwXNCmuY5glKcjFucF_EgCjzuOFC50hVPT7_5sqnw0S18LnwDbQxNbf7vXS6k5yMnqBfCsh3L4BnaokA8B4UzE0HtOemYGbnmzmpDtdcS6AM7EQ7u0G9Xja1mQOleA9CJqLH_WGIigWnj9IXcMPBv-LzQbA4m4ZqA";
    
  const ticket = await client.verifyIdToken({
    idToken: token,
     audience: process.env.GOOGLE_CLIENT_ID,  // Specify the CLIENT_ID of the app that accesses the backend
});
const payload = ticket.getPayload();
const userid = payload['sub'];

console.log(payload);
console.log(userid);
return false;
}


exports.FacebookSocialLogin=async(app)=>{

  
  app.use(session({
    resave: false,
    saveUninitialized: true,
    secret: 'SECRET' 
  }));


app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(function (user, cb) {
  cb(null, user);
});

passport.deserializeUser(function (obj, cb) {
  cb(null, obj);
});
let token="EAAIjwY0xOo0BALORA48JZCWwb7mDt0byj8cX4nQKfpfdlrFyzd0ocQPWEaDVmXJt8ZCxOwEpPMjBlrNZADQG4Sge3lQ1wmn9cmX7ZBvjH0aSqBvxoZB8YSTKUCy4MFFZAZAiqBjDgo5Hp8dUbSOM8LjeS8lR9WMM5aINkZAkEcfL8dGwDgYecnaAw2dmQABi2qS1otjPZByGcxypZCw4br3QpGouIToOWHlko3YydZBXBjYAAZDZD";
passport.authenticate([token,FacebookStrategy]), 
function (req, res) {

    if (req.user){
      console.log(user);
        //you're authenticated! return sensitive secret information here.
        res.send(200, {'secrets':['array','of','top','secret','information']});
    } else {
        // not authenticated. go away.
        res.send(401)
    }

}


// return false ;
passport.use(new FacebookStrategy({
  clientID: process.env.FACEBOOK_CLIENT_ID,
  clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
  callbackURL: process.env.FACEBOOK_CLIENT_CALLBACK,
  profileFields:['id','displayName']
}, function (accessToken, refreshToken, profile, done) {
  
  console.log(accessToken,refreshToken,profile);

  const user={};
  return done(null, user);
}
));

app.get('/profile', function (req, res) {
  console.log("profile login");
  res.send("profile login")
});

app.get('/error',  function (req, res) {
  console.log("error login");
  res.send("error logn")

});



app.get('/auth/facebook', passport.authenticate('facebook', {
  scope: ['public_profile', 'email']
}));


app.get('/auth/facebook/callback',
  passport.authenticate('facebook', {
    successRedirect: '/profile',
    failureRedirect: '/error'
  }));

}
