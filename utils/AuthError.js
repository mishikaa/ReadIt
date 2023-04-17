const AuthError = (err) => {
    let errorMessage = ' '
    
    // Duplication error code
    if (err.code === 11000) {
        errorMessage += 'This username is already taken!';
        return errorMessage;
    }


    // Validation errors
    if(err.message.includes('user validation failed')) {
        errorMessage += 'Password must contain atleast 6 characters!';

    }
    return errorMessage;
}

module.exports = AuthError;