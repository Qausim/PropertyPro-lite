/**
 * Script for login form/page specific behaviours
 */

/**
 * Handles user clicks on log in button to enter the app
 * @param {Event} event 
 */
const logUserIn = event => {
    event.preventDefault();
    if (handledEmptyAndShortFields()) {
        return;
    };

    const email = emailField.value;
    const password = passwordField.value;
    
    if (handleInvalidEmailOrPasswordErrors(email, password)) {
        return;
    }
    
    window.location.href = './listed_properties.html';
}

submitButton.addEventListener('click', logUserIn);
