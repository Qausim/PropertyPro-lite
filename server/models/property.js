export default class Property {
  constructor(id, owner, type, state, city, address, price,
    imageUrl = '', status = 'available') {
    this.id = id;
    this.owner = owner;
    this.status = status;
    this.type = type;
    this.state = state;
    this.city = city;
    this.address = address;
    this.price = price;
    this.createdOn = new Date();
    this.updatedOn = null;
    this.imageUrl = imageUrl;
  }
}
