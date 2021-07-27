const order = require("../../../models/order")

function orderController(){
    return {
        index(request, response) {
            order.find({ status: { $ne: 'completed' } }, null, { sort: { 'createdAt': -1 }}).
            populate('customerId', '-password').exec((err, orders) => {
                if(request.xhr) {
                    return response.json(orders)
                } else {
                 return response.render('admin/orders')
                }
            })
         }
    }
}

module.exports = orderController