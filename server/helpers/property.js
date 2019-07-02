
const isString = value => typeof value === 'string';

const isNumber = value => typeof value === 'number'
  || /^\d+(\.\d+)?$/.test(value);

const hasNumber = value => /\d/.test(value);

export const getPostPropertyError = ({
  type, state, city, address, price,
}) => {
  if (!isString(type)) {
    return 'Invalid type field';
  } if (!state) {
    return 'State is required';
  } if (!isString(state) || hasNumber(state)) {
    return 'Invalid state field';
  } if (!city) {
    return 'City is required';
  } if (!isString(city) || hasNumber(city)) {
    return 'Invalid city field';
  } if (!address) {
    return 'Address is required';
  } if (!isString(address) || isNumber(address)) {
    return 'Invalid address field';
  } if (!parseFloat(price) || !isNumber(price)) {
    return 'Invalid price field';
  }
  return false;
};
