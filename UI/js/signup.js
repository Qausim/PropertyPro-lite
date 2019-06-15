const firstNameField = document.querySelector('input[name="first_name"]');
const lastNameField = document.querySelector('input[name="last_name"]');
const addressField = document.querySelector('input[name="address"]');
const phoneField = document.querySelector('input[name="phone"]');
const asAgentCheckbox = document.querySelector('formgroup#as_agent input');


/**
 * Handles displaying address and phone fields solely required for
 * agents.
 */
const toggleAddressAndPhoneFieldsDisplay = () => {
    Array.from(document.querySelectorAll('formgroup.toggle'))
        .forEach(el => el.classList.toggle(noDisplayClassName));
};

const validatePhone = phone => !/$+?[^\d]/.test(phone.replace(' ', ''));

/**
 * Handles user clicks on the submit button
 * Validates entries 
 * @param {Event} event 
 */
const registerUser = event => {
    event.preventDefault();
    if (handledEmptyAndShortFields()) {
        return;
    };

    const fieldEntries = {};
    fieldEntries.firstName = firstNameField.value;
    fieldEntries.lastName = lastNameField.value;
    fieldEntries.email = emailField.value;
    fieldEntries.password = passwordField.value;
    
    if (!isValidEmail(fieldEntries.email)) {
        showError('Invalid email address');
        focusOnInput(emailField);
        return;
    }

    if (!isValidPassword(fieldEntries.password)) {
        showError('Invalid password');
        focusOnInput(passwordField);
        return;
    }

    fieldEntries.isAgent = asAgentCheckbox.checked;
    if (fieldEntries.isAgent) {
        fieldEntries.address = addressField.value;
        fieldEntries.phone = phoneField.value;

        if (!validatePhone(fieldEntries.phone)) {
            showError('Invalid phone number!');
            focusOnInput(phoneField);
            return;
        }
    }
};

submitButton.addEventListener('click', registerUser)
asAgentCheckbox.addEventListener('click', toggleAddressAndPhoneFieldsDisplay);