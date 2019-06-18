const hamburgerToggler = document.querySelector('.toggler');
const sidebar = document.querySelector('aside');
const contentsBox = document.querySelector('.contents');
const propertiesWrapper = document.querySelector('.properties-wrapper');

class User {
    constructor(userId, firstName, lastName, email, password, isAgent=false) {
        this.userId = userId;
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.password = password;
        this.isAgent = isAgent;
    }
}

class Agent extends User {
    constructor(userId, firstName, lastName, email, password,
        address, phone, isAgent=true) {
            super(userId, firstName, lastName, email, password, isAgent);
            this.address = address;
            this.phone = phone;
            this.adverts = [];
        }
}

class Property {
    constructor(propertyId, price, title, location, description, agentId, type,
        images=[], sold=false) {
        this.propertyId = propertyId;
        this.price = price;
        this.title = title;
        this.location = location;
        this.description = description;
        this.agentId = agentId;
        this.images = images;
        this.type = type;
        this.sold = sold;
        this.postedOn = new Date();
        this.updatedOn = null;
    }
}

const users = [
    new Agent(1, 'Olawumi', 'Yusuff', 'qauzeem@example.com', '123456',
        'Lagos, Nigeria', '0800000000'),
    new Agent(2, 'Bolaji', 'Olujide', 'bolu@example.com', '123456',
        'Ibadan, Nigeria', '0810000000'),
    new User(3, 'Bisi', 'Alao', 'b.alao@example.com', '123456')

];

const properties = [
    new Property(1, '₦ 10000000', '3 bedroom apartment lorem lorem lorem', 'Dopemu, Lagos',
        'A beautiful 3 bedroom apartment in a serene and friendly neighbourhood',
        1, 'bungalow', ["./images/propertya1.jpg", "./images/propertya2.jpg",
        "./images/propertya3.jpg"]),
    new Property(2, '₦ 50000000', '5 bedroom mansion', 'Surulere, Lagos',
        'A beautiful 5 bedroom mansion in a serene and friendly neighbourhood',
        1, 'mansion', ["./images/propertyb1.jpeg", "./images/propertyb2.jpg",
        "./images/propertyb3.jpg"]),
    new Property(1, '₦ 10000000', '3 bedroom apartment', 'Dopemu, Lagos',
        'A beautiful 3 bedroom apartment in a serene and friendly neighbourhood',
        1, 'bungalow', ["./images/propertya1.jpg", "./images/propertya2.jpg",
        "./images/propertya3.jpg"]),
    new Property(2, '₦ 50000000', '5 bedroom mansion', 'Surulere, Lagos',
        'A beautiful 5 bedroom mansion in a serene and friendly neighbourhood',
        1, 'mansion', ["./images/propertyb1.jpeg", "./images/propertyb2.jpg",
        "./images/propertyb3.jpg"]),
    new Property(1, '₦ 10000000', '3 bedroom apartment', 'Dopemu, Lagos',
        'A beautiful 3 bedroom apartment in a serene and friendly neighbourhood',
        1, 'bungalow', ["./images/propertya1.jpg", "./images/propertya2.jpg",
        "./images/propertya3.jpg"]),
    new Property(2, '₦ 50000000', '5 bedroom mansion', 'Surulere, Lagos',
        'A beautiful 5 bedroom mansion in a serene and friendly neighbourhood',
        1, 'mansion', ["./images/propertyb1.jpeg", "./images/propertyb2.jpg",
        "./images/propertyb3.jpg"]),
    new Property(1, '₦ 10000000', '3 bedroom apartment', 'Dopemu, Lagos',
        'A beautiful 3 bedroom apartment in a serene and friendly neighbourhood',
        1, 'bungalow', ["./images/propertya1.jpg", "./images/propertya2.jpg",
        "./images/propertya3.jpg"]),
    new Property(2, '₦ 50000000', '5 bedroom mansion', 'Surulere, Lagos',
        'A beautiful 5 bedroom mansion in a serene and friendly neighbourhood',
        1, 'mansion', ["./images/propertyb1.jpeg", "./images/propertyb2.jpg",
        "./images/propertyb3.jpg"]),
    new Property(1, '₦ 10000000', '3 bedroom apartment', 'Dopemu, Lagos',
        'A beautiful 3 bedroom apartment in a serene and friendly neighbourhood',
        1, 'bungalow', ["./images/propertya1.jpg", "./images/propertya2.jpg",
        "./images/propertya3.jpg"]),
    new Property(2, '₦ 50000000', '5 bedroom mansion', 'Surulere, Lagos',
        'A beautiful 5 bedroom mansion in a serene and friendly neighbourhood',
        1, 'mansion', ["./images/propertyb1.jpeg", "./images/propertyb2.jpg",
        "./images/propertyb3.jpg"]),
]

const renderProperty = property => {
    const markup = `
    <div class="properties" data-propertyId="${property.propertyId}">
        <div class="img-wrapper">
            <img src="${property.images.length ? property.images[0] : null}" alt="Property image">
        </div>
        <div class="text-wrapper">
            <h3>${property.price}</h3>
            <h4 class="text--ellipsised">${property.title}</h4>
            <p class="text--ellipsised">
                ${property.description}
            </p>
        </div>
    </div>
    `;

    propertiesWrapper.insertAdjacentHTML('beforeend', markup);
};

properties.forEach(property => renderProperty(property));

const toggleSidebarDisplay = () => {
    const hamburgerWrapper = document.querySelector('.hamburger-wrapper');
    let width = hamburgerToggler.checked ? '250px' : '0px';
    sidebar.style.width = width;
    hamburgerWrapper.style.left = width;
}

hamburgerToggler.addEventListener('click', toggleSidebarDisplay);
window.addEventListener('resize', () => {
    if (window.innerWidth >= 1025) {
        sidebar.style.width = '250px';
    } else {
        sidebar.style.width = '0px';
    }
});