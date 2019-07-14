export default class User {
  constructor(id, email, first_name, last_name, password, phone_number,
    address, is_admin, is_agent) {
    this.id = id;
    this.email = email;
    this.first_name = first_name;
    this.last_name = last_name;
    this.password = password;
    this.phone_number = phone_number || null;
    this.address = address || null;
    this.is_admin = is_admin || false;
    this.is_agent = is_agent || false;
    this.token = null;
  }
}
