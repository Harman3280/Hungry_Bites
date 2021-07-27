const Menu = require('../../models/menu.js')

function homeController(){
    //Factory Function -- it is programming pattern in most of the lang
    //it returns a obejct helps in creation of object

    return{
        //crud controller - create,read,upd,del
        async index(request, response){

            const pizzas = await Menu.find()
            console.log(pizzas)
            return response.render('home',{pizzas: pizzas})
           
            
        }
    }
}

module.exports = homeController
