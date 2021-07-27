function cartController(){

    return{
        index(request, response){
            response.render('customers/cart')
        },

        update(request, response){
         // let cart = {
            //     items: {
            //         pizzaId: { item: pizzaObject, qty:0 },
            //         pizzaId: { item: pizzaObject, qty:0 },
            //         pizzaId: { item: pizzaObject, qty:0 },
            //     },
            //     totalQty: 0,
            //     totalPrice: 0
            // }

            // for the first time creating cart and adding basic object structure
            if (!request.session.cart) {
                request.session.cart = {
                    items: {},
                    totalQty: 0,
                    totalPrice: 0
                }
            }
            let cart = request.session.cart
            //console.log(request.body)

             // Check if item does not exist in cart 
             if(!cart.items[request.body._id]) {
                cart.items[request.body._id] = {
                    item: request.body,
                    qty: 1
                }
                cart.totalQty = cart.totalQty + 1
                cart.totalPrice = cart.totalPrice + request.body.price
            }
            else
            {
                cart.items[request.body._id].qty = cart.items[request.body._id].qty + 1
                cart.totalQty = cart.totalQty + 1
                cart.totalPrice =  cart.totalPrice + request.body.price
            }
             return response.json({ totalQty: request.session.cart.totalQty })
        }
    }
}

module.exports = cartController
