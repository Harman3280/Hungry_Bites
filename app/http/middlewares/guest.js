function guest(request, response, next){
    if(!request.isAuthenticated()){
        return next()
    }
    return response.redirect('/')
}

module.exports = guest