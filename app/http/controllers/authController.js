const User = require('../../models/user')
const bcrypt = require('bcrypt')
const passport = require('passport')

function authController(){
    const _getRedirectUrl = (request) => {
        return request.user.role === 'admin' ? '/admin/orders' : '/customer/orders'
    }

    return{
        login(request, response){
            response.render('auth/login')
        },
        postLogin(request, response, next){
            const {email, password } = request.body
            // Validate request
            if( !email || !password){
                request.flash('error','All fields are required')
                return response.redirect('/login')
            }

            passport.authenticate('local',(err, user, info)=>{
                if(err){
                    request.flash('error', info.message)
                    return next(err)
                }
                if(!user){
                    request.flash('error', info.message)
                    return response.redirect('/login')
                }

                request.logIn(user, (err)=>{
                    if(err){
                        request.flash('error', info.message)
                        return next(err)
                    }
                    
                    return response.redirect(_getRedirectUrl(request))
                })
            })(request, response, next)
            
        },
        register(request, response){
            response.render('auth/register')
        },
        async postRegister(request, response){
            const { name, email, password } = request.body
            // Validate request
            if(!name || !email || !password){
                request.flash('error','All fields are required')
                request.flash('name',name)
                request.flash('email',email)
                return response.redirect('/register')
            }
            
            // Check if email exists
            User.exists({email: email},(err, result)=>{
                if(result){
                request.flash('error','Email already taken')
                request.flash('name',name)
                request.flash('email',email)
                return response.redirect('/register')
                }
            })

            //Hash Password
            const hashedPassword = await bcrypt.hash(password, 10)
            // Create a user
            const user =  new User({
                name  : name, 
                email : email,
                password: hashedPassword
            })

            user.save().then(()=>{
                //Login

                return response.redirect('/')
            }).catch(err =>{
                request.flash('error','Something went wrong')
                return response.redirect('/register')
            })
            //console.log(request.body)
        },
        logout(request, response){
            request.logout()
            return response.redirect('/login')
        }

    }
}

module.exports = authController
