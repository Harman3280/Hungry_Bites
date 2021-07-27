function auth(request, response, next) {
    if(request.isAuthenticated()) {
        return next()
    }
    return response.redirect('/login')
}

module.exports = auth