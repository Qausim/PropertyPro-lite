
const isString = value => typeof value === 'string';

const isNumber = value => typeof value === 'number'
  || /^\d+(\.\d+)?$/.test(value);

const hasNumber = value => /\d/.test(value);

export const getPostPropertyError = ({
  type, state, city, address, price,
}) => {
  if (!isString(type)) {
    return 'Invalid type field';
  } else if (!state) {
    return 'State is required';
  } else if (!isString(state) || hasNumber(state)) {
    return 'Invalid state field';
  } else if (!city) {
    return 'City is required';
  } else if (!isString(city) || hasNumber(city)) {
    return 'Invalid city field';
  } else if (!address) {
    return 'Address is required';
  } else if (!isString(address) || isNumber(address)) {
    return 'Invalid address field';
  } else if (!parseFloat(price) || !isNumber(price)) {
    return 'Invalid price field';
  } else {
    return false;
  }
};
