export default class User {
  constructor(id, email, firstName, lastName, password, phoneNumber,
    address, isAdmin, isAgent) {
    this.id = id;
    this.email = email;
    this.firstName = firstName;
    this.lastName = lastName;
    this.password = password;
    this.phoneNumber = phoneNumber || null;
    this.address = address || null;
    this.isAdmin = isAdmin || false;
    this.isAgent = isAgent || false;
    this.token = null;
  }
}
