const LocalStrategy = require('passport-local').Strategy
const User =  require('../models/user')
const bcrypt =  require('bcrypt')

function init(passport){
    passport.use(new LocalStrategy({ usernameField: 'email' }, async (email, password, done) =>{
        //Login
        //Check if email exists
        const user = await User.findOne({email: email})

        if(!user){
            return done(null, false, { message: 'No user with this email' })
        }

        bcrypt.compare(password, user.password).then(match => {
            if(match){
                return done(null, user, {message: 'Logged in succesfully'})
            }

            return done(null, false, {message: 'Wrong Username or Password'})
        }).catch(err=>{
            return done(null, user, {message: 'Something Went Wrong!'})
        })

    }))

    //This method is used to store some user datat like id in session if user is logged in
    passport.serializeUser((user, done)=>{
        done(null, user._id)
    })

    passport.deserializeUser((id, done)=>{
        User.findById(id,(err, user)=>{
            done(err, user)
        })
    })

    
}

module.exports = init