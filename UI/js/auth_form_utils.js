/* eslint-disable no-unused-vars */
/**
 * Script for behaviours both of login and signup forms/pages
 * Contains fields and functions call in login.js and signup.js
 */

const emailField = document.querySelector('input[name="email"]');
const passwordField = document.querySelector('input[name="password"]');
const submitButton = document.querySelector('input[type="submit"]');
const errorMessage = document.querySelector('.error-msg');
const noDisplayClassName = 'no-display';


/**
 * Focuses cursor on an input element
 * @param {HTMLInputElement} element
 */
const focusOnInput = (element) => {
  setTimeout(() => {
    element.focus();
  }, 1000);
};


/** Shows and clears error messages
 * @param {string} msg is the error message
*/
const showError = (msg) => {
  errorMessage.textContent = msg;
  errorMessage.classList.toggle(noDisplayClassName);
  window.scrollTo(0, 300);

  // clear error message and enable sumbit button after 2 seconds
  setTimeout(() => {
    errorMessage.classList.add(noDisplayClassName);
    submitButton.disabled = false;
  }, 2000);
};


/**
 * Validates email input format
 * @param {string} email
 * @returns {boolean}
 */
const isValidEmail = email => /^(\D)+(\w)*((\.(\w)+)?)+@(\D)+(\w)*((\.(\D)+(\w)*)+)?(\.)[a-z]{2,}$/
  .test(email);


/**
 * Validates password. Password should not be less than six characters
 * @param {string} password
 * @returns {boolean}
 */
const isValidPassword = password => password.length > 5;


/**
 * Displays the appropriate error message for email and password inputs with
 * the wrong format
 * Calls @function showError, @function isValidEmail, @function isValidPassword,
 * and @function focusOnInput
 *
 * @param {string} email
 * @param {string} password
 * @returns {boolean} indicating if there was an error or not
 */
const handleInvalidEmailOrPasswordErrors = (email, password) => {
  if (!isValidEmail(email)) {
    showError('Invalid email address');
    focusOnInput(emailField);
    return true;
  }

  if (!isValidPassword(password)) {
    showError('Invalid password');
    focusOnInput(passwordField);
    return true;
  }

  return false;
};


/**
 * @returns {Array} of the name of an empty or short required field
 *  and its type ('empty' or 'short')
 */
const getEmptyOrShortRequiredField = () => {
  const requiredFields = Array.from(document
    .querySelectorAll('input[required]'))
    .filter(el => !el.parentNode.className.includes(noDisplayClassName));

  const fieldEntries = []; // to store arrays of key-value entry pair

  requiredFields.forEach((el) => {
    const { name } = el;
    const value = el.value.trim();
    fieldEntries.push([name, value]);
  });

  const emptyField = fieldEntries.find(el => el[1] === '');
  const shortField = fieldEntries.find(el => el[1].length < 4);

  if (emptyField) {
    return [emptyField[0], 'empty'];
  } if (shortField) {
    return [shortField[0], 'short'];
  }
};


/**
 * Calls @function showError with appropriate error message if a
 * required field is empty or too short.
 * Calls @function focusOnInput, and @function getEmptyOrShortRequiredField
 *
 * @returns {boolean} if there was a handled field or not
 */
const handledEmptyAndShortFields = () => {
  const invalidField = getEmptyOrShortRequiredField();

  if (invalidField) {
    const fieldName = invalidField[0];

    let displayName = fieldName.replace('_', ' ');
    displayName = displayName[0].toUpperCase() + displayName.slice(1);

    let error;
    if (invalidField[1] === 'empty') {
      error = `${displayName} cannot be empty!`;
    } else if (invalidField[1] === 'short') {
      error = `${displayName} is too short!`;
    }
    showError(error);
    focusOnInput(document.querySelector(`input[name="${fieldName}"]`));
    submitButton.disabled = true;
    return true;
  }
  return false;
};


/**
 * Handles successful user signup by storing user data received in sessionStorage
 * and redirecting to the main page
 * @param {object} userData
 */
const handleAuthFormSuccess = (userData) => {
  sessionStorage.setItem('token', userData.token);
  sessionStorage.setItem('userId', userData.id);
  window.location.replace('./properties.html');
};
