/* eslint-disable no-undef */
/**
 * Script for login form/page specific behaviours
 *
 * A bunch of function and fields common to this file and signup.js are declared
 * in auth_form_utils.js
 */


/**
 * Handles submit event on signin form if data is in the valid format.
 *
 * Calls @function handleAuthFormSuccess if successful, else @function showError
 * @param {object} entries
 */
const sendSigninRequest = (entries) => {
  const url = 'http://localhost:3000/api/v1/auth/signin';
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
* Handles user clicks on log in button to enter the app
* @param {Event} event
*/
const logUserIn = (event) => {
  event.preventDefault();
  if (handledEmptyAndShortFields()) {
    return;
  }

  const fieldEntries = {};
  fieldEntries.email = emailField.value;
  fieldEntries.password = passwordField.value;

  if (handleInvalidEmailOrPasswordErrors(fieldEntries.email, fieldEntries.password)) {
    return;
  }
  sendSigninRequest(fieldEntries);
};

submitButton.addEventListener('click', logUserIn);
