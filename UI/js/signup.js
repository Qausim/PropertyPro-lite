/* eslint-disable no-undef */
/**
 * Script for signup form/page specific behaviours
 *
 * A bunch of function and fields common to this file and login.js are declared
 * in auth_form_utils.js
 */

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
  Array.from(document.querySelectorAll('formgroup.toggle-display'))
    .forEach(el => el.classList.toggle(noDisplayClassName));
};


/**
 * Validates if the phone number input value is valid
 * @param {string} phone
 * @returns {boolean}
 */
const isValidPhone = phone => /^\+?[\d]+$/.test(phone.replace(' ', ''));


/**
 * Handles signup HTTP request, Calls @function handleAuthFormSuccess if successful or
 * @function showError if otherwise
 * @param {object} entries
 */
const sendSignupRequest = (entries) => {
  const url = 'http://localhost:3000/api/v1/auth/signup';
  const params = {
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(entries),
    method: 'POST',
  };

  fetch(url, params)
    .then(res => res.json())
    .then((body) => {
      if (body.status === 'error') {
        showError(body.error);
        return;
      }
      handleAuthFormSuccess(body.data);
    })
    .catch(() => showError('An error occured!'));
};


/**
 * Handles user clicks on the signup button
 * Validates entries by Calling @function handledEmptyAndShortFields,
 * @function handleInvalidEmailOrPasswordErrors, @function isValidPhone.
 * Also calls, @function showError, @function focusOnInput, @function sendSignupRequest
 * @param {Event} event
 */
const registerUser = (event) => {
  event.preventDefault();
  if (handledEmptyAndShortFields()) return;
  const fieldEntries = {};

  fieldEntries.first_name = firstNameField.value;
  fieldEntries.last_name = lastNameField.value;
  fieldEntries.email = emailField.value;
  fieldEntries.password = passwordField.value;

  if (handleInvalidEmailOrPasswordErrors(fieldEntries.email, fieldEntries.password)) return;

  fieldEntries.isAgent = asAgentCheckbox.checked;
  if (fieldEntries.isAgent) {
    fieldEntries.address = addressField.value;
    fieldEntries.phone = phoneField.value;
    if (!isValidPhone(fieldEntries.phone)) {
      showError('Invalid phone number!');
      focusOnInput(phoneField);
      return;
    }
  }
  sendSignupRequest(fieldEntries);
};

submitButton.addEventListener('click', registerUser);
asAgentCheckbox.addEventListener('click', toggleAddressAndPhoneFieldsDisplay);
