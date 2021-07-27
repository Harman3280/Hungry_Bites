const homeController = require('../app/http/controllers/homeController')
const authController = require('../app/http/controllers/authController')
const cartController = require('../app/http/controllers/customers/cartController')
const orderController = require('../app/http/controllers/customers/orderController')

const AdminOrderController = require('../app/http/controllers/admin/orderController')

//Middlewares
const guest = require('../app/http/middlewares/guest.js')
const auth  =  require('../app/http/middlewares/auth.js')
const admin  =  require('../app/http/middlewares/admin.js')

function iniRoutes(app){

    
    app.get('/',homeController().index) 
    app.get('/login', guest, authController().login)
    app.post('/login', authController().postLogin)
    app.get('/register', guest, authController().register)
    app.post('/register', authController().postRegister)
    app.post('/logout', authController().logout)

    app.get('/cart',cartController().index)
    app.post('/update-cart',cartController().update)

    //Customer Routes
    app.post('/orders', auth, orderController().store)
    app.get('/customer/orders', auth, orderController().index)

    //Admin Routes
   
    app.get('/admin/orders', admin, AdminOrderController().index)
}

module.exports = iniRoutes

/*
        Old way:
        app.get('/',(request, response)=>{
                response.render('home')
            })

            2nd argument function is stored in controller file in new way
 */