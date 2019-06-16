const logUserIn = () => {
    event.preventDefault();
    if (handledEmptyAndShortFields()) {
        return;
    };

    const email = emailField.value;
    const password = passwordField.value;
    
    if (handleInvalidEmail(email, password)) {
        return;
    }

    
}

submitButton.addEventListener('click', logUserIn);