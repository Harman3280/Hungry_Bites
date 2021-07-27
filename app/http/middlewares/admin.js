function admin(request, response, next) {
    if(request.isAuthenticated() && request.user.role === 'admin') {
        return next()
    }
    return response.redirect('/')
}

module.exports = admin