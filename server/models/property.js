export default class Property {
  constructor(id, owner, type, state, city, address, price,
    image_url) {
    this.id = id;
    this.owner = owner;
    this.status = 'available';
    this.type = type;
    this.state = state;
    this.city = city;
    this.address = address;
    this.price = parseFloat(price).toFixed(2);
    this.created_on = new Date().toLocaleString();
    this.updated_on = null;
    this.image_url = image_url || '';
  }
}
