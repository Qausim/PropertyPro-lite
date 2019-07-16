export default class Property {
  constructor(id, owner, type, state, city, address, price,
    imageUrl) {
    this.id = id;
    this.owner = owner;
    this.status = 'available';
    this.type = type;
    this.state = state;
    this.city = city;
    this.address = address;
    this.price = parseFloat(price).toFixed(2);
    this.createdOn = new Date().toLocaleString();
    this.updatedOn = null;
    this.imageUrl = imageUrl || '';
  }
}
