export default class User {
  constructor(id = null, email, firstName, lastName,
    password, phoneNumber = null, address = null, isAdmin = false, isAgent = false) {
    this.id = id;
    this.email = email;
    this.firstName = firstName;
    this.lastName = lastName;
    this.password = password;
    this.phoneNumber = phoneNumber;
    this.address = address;
    this.isAdmin = isAdmin;
    this.isAgent = isAgent;
    this.token = null;
  }
}
