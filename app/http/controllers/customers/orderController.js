const { request } = require('express');
const Order = require('../../../models/order')
const moment = require('moment')

function orderController () {
    return {
        store(request, response) {
            // Validate request
            const { phone, address } = request.body
            if(!phone || !address) {
                request.flash('error', 'All Fields Required')
                return response.redirect('/cart')
            }

            const order = new Order({
                customerId: request.user._id,
                items: request.session.cart.items,
                phone,
                address
            })
            order.save().then(result => {
                request.flash('success', 'Order placed successfully')
                //delete cart after plcaing order
                delete request.session.cart
                return response.redirect('/customer/orders')
            }).catch(err => {
                request.flash('error', ' Went Wrong')
                return response.redirect('/cart')
            })
        },
        async index(request, response){
            // Fetch logged in user orders from DB
            const orders = await Order.find({ customerId : request.user._id },
                null, { sort: { 'createdAt': -1 } })
            response.header('Cache-Control', 'no-store')
            response.render('customers/orders.ejs', { orders: orders, moment: moment })
            console.log(orders)
        }       
    }
}

module.exports = orderController 