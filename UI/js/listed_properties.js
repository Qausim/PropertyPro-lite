const hamburgerToggler = document.querySelector('.toggler');
const sidebar = document.querySelector('aside');
const contentBox = document.querySelector('.contents');
let searchField;
let searchButton;
let propertiesWrapper;
let searchFieldHasFocus = false;

// User model
class User {
    constructor(userId, firstName, lastName, email, password, isAgent=false) {
        this.userId = userId;
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.password = password;
        this.isAgent = isAgent;
        this.createdOn = new Date();
    }
};

// Agent model
class Agent extends User {
    constructor(userId, firstName, lastName, email, password,
        address, phone, isAgent=true) {
            super(userId, firstName, lastName, email, password, isAgent);
            this.address = address;
            this.phone = phone;
        }
};


// Property model
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
        this.flaggedAsFraudulentBy = [];
        this.postedOn = new Date();
        this.updatedOn = null;
    }
};


// A list of users simulating existing users
const users = [
    new Agent(1, 'Olawumi', 'Yusuff', 'qauzeem@example.com', '123456',
        'Lagos, Nigeria', '0800000000'),
    new Agent(2, 'Bolaji', 'Olujide', 'bolu@example.com', '123456',
        'Ibadan, Nigeria', '0810000000'),
    new User(3, 'Bisi', 'Alao', 'b.alao@example.com', '123456')

];

// The "currentUser" object simulates a logged user
const currentUser = users[1];


// A list of properties simulating existing posted properties
const properties = [
    new Property(1, '₦ 10000000', '3 bedroom apartment', 'Dopemu, Lagos',
        'A beautiful 3 bedroom apartment in a serene and friendly neighbourhood',
        1, 'bungalow', ["./images/propertya1.jpg", "./images/propertya2.jpg",
        "./images/propertya3.jpg"]),
    new Property(2, '₦ 50000000', '5 bedroom mansion', 'Surulere, Lagos',
        'A beautiful 5 bedroom mansion in a serene and friendly neighbourhood',
        2, 'mansion', ["./images/propertyb1.jpeg", "./images/propertyb2.jpg",
        "./images/propertyb3.jpg"]),
    new Property(3, '₦ 10000000', '3 bedroom apartment', 'Dopemu, Lagos',
        'A beautiful 3 bedroom apartment in a serene and friendly neighbourhood',
        1, 'bungalow', ["./images/propertya1.jpg", "./images/propertya2.jpg",
        "./images/propertya3.jpg"]),
    new Property(4, '₦ 50000000', '5 bedroom mansion', 'Surulere, Lagos',
        'A beautiful 5 bedroom mansion in a serene and friendly neighbourhood',
        2, 'mansion', ["./images/propertyb1.jpeg", "./images/propertyb2.jpg",
        "./images/propertyb3.jpg"]),
    new Property(5, '₦ 10000000', '3 bedroom apartment', 'Dopemu, Lagos',
        'A beautiful 3 bedroom apartment in a serene and friendly neighbourhood',
        2, 'bungalow', ["./images/propertya1.jpg", "./images/propertya2.jpg",
        "./images/propertya3.jpg"]),
    new Property(6, '₦ 50000000', '5 bedroom mansion', 'Surulere, Lagos',
        'A beautiful 5 bedroom mansion in a serene and friendly neighbourhood',
        1, 'mansion', ["./images/propertyb1.jpeg", "./images/propertyb2.jpg",
        "./images/propertyb3.jpg"]),
    new Property(7, '₦ 10000000', '3 bedroom apartment', 'Dopemu, Lagos',
        'A beautiful 3 bedroom apartment in a serene and friendly neighbourhood',
        2, 'bungalow', ["./images/propertya1.jpg", "./images/propertya2.jpg",
        "./images/propertya3.jpg"]),
    new Property(8, '₦ 50000000', '5 bedroom mansion', 'Surulere, Lagos',
        'A beautiful 5 bedroom mansion in a serene and friendly neighbourhood',
        2, 'mansion', ["./images/propertyb1.jpeg", "./images/propertyb2.jpg",
        "./images/propertyb3.jpg"]),
    new Property(9, '₦ 10000000', '3 bedroom apartment', 'Dopemu, Lagos',
        'A beautiful 3 bedroom apartment in a serene and friendly neighbourhood',
        2, 'bungalow', ["./images/propertya1.jpg", "./images/propertya2.jpg",
        "./images/propertya3.jpg"]),
    new Property(10, '₦ 50000000', '5 bedroom mansion', 'Surulere, Lagos',
        'A beautiful 5 bedroom mansion in a serene and friendly neighbourhood',
        2, 'mansion', ["./images/propertyb1.jpeg", "./images/propertyb2.jpg",
        "./images/propertyb3.jpg"])
];


/**
 * The @var contentBox is by default empty, this function inserts a "search-wrapper"
 * div and a "properties-wrapper" div into it.
 * It initializes the @var searchField, @var searchButton, and @var propertiesWrapper
 * and sets @event focus and @event blur listeners on @var searchField that toggles
 * @var searchFieldHasFocus value
 */
const initPropertiesWrapper = () => {
    const markup =
        `<div class="search-wrapper">
            <form action="" id="search-form">
                <input type="text" name="search" placeholder="Search properties">
                <input type="submit" value="search" class="text--white">
            </form>
        </div>
        <div class="properties-wrapper">
        <!-- Properties will be rendered here -->
        </div>`;

    contentBox.insertAdjacentHTML('afterbegin', markup);
    searchField = document.querySelector('#search-form input[type="text"]');
    searchButton = document.querySelector('#search-form input[type="submit"]');
    searchField.addEventListener('focus', () => searchFieldHasFocus = true);
    searchField.addEventListener('blur', () => searchFieldHasFocus = false);
    propertiesWrapper = document.querySelector('.properties-wrapper');
};


/**
 * Renders a property object inside @var propertiesWrapper if it exists else it sets an
 * error message
 * @param {Property} property 
 */
const renderProperty = property => {
    const markup = property ?
    `
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
    `
    :
    '<h2 class="text--aligned-center">No property to display :(</h2>';

    propertiesWrapper.insertAdjacentHTML('afterbegin', markup);
};


/**
 * Toggles the sidebar on click on the hamburger in mobile and tablet modes
 * by setting @var sidebar's width and @var hamburgerWrapper's left positioning
 */
const toggleSidebarDisplay = () => {
    const hamburgerWrapper = document.querySelector('.hamburger-wrapper');
    let width = hamburgerToggler.checked ? '250px' : '0px';
    sidebar.style.width = width;
    hamburgerWrapper.style.left = width;
};


/**
 * Clears the contents of @var contentBox
 */
const clearContentBox = () => {
    contentBox.textContent = "";
};


/**
 * Clears the contents of @var propertiesWrapper
 */
const clearProperties = () => {
    propertiesWrapper.textContent = '';
};



/**
 * Filters a properties (using @member title, @member description, and @member type
 * @memberof Property) by value
 * Calls @function clearProperties, and @function renderProperty
 * @param {string} value
 */
const filterProperties = value => {
    const results = properties.filter(property => {
        return property.type.toLowerCase().includes(value) ||
        property.title.toLowerCase().includes(value) ||
        property.description.toLowerCase().includes(value);
    });

    // Clear the existing contents of propertiesWrapper
    clearProperties()
    // Render results or error message (by passing no argument into "renderProperty")
    if (results.length === 0) {
        renderProperty();
    } else {
        results.forEach(el => renderProperty(el));
    }
};


/**
 * Handle window @event hashchange
 * Calls @function clearContentBox, @function initPropertiesWrapper,
 * @function filterProperties, and @function renderProperty
 */
const handleHashChange = () => {
    // Obtain the hash, hashTerm and searchTerm (if hashTerm is "search")
    const hash = window.location.hash.substring(1);
    const [hashTerm, searchTerm] = hash.split('=');

    switch (hashTerm) {
        case 'search':
            clearContentBox();
            initPropertiesWrapper();
            filterProperties(searchTerm);
            break;
        case 'view_all':
        case '':
            clearContentBox();
            initPropertiesWrapper();
            properties.forEach(property => renderProperty(property));
            break;
        default:
            clearContentBox();
    }
};


/**
 * Handles user search actions by changing the window hash value
 * @emits hashchange
 * @param {DOMEvent} event 
 */
const handleSearch = event => {
    event.preventDefault();
    // obtain search term and change the window hash value using the term
    const searchTerm = searchField.value.trim().toLowerCase();
    window.location.hash = `search=${searchTerm}`;
};


/**
 * Handles enter keypress event to search a specific property type
 * Calls @function handleSearch if @var searchFieldHasFocus is true
 * @param {DOMEvent} event 
 */
const handleSearchOnEnterKeypress = event => {
    if (event.keyCode === 13) {
        event.preventDefault();
        if (searchFieldHasFocus) {
            handleSearch(event);
        }
    }
};


/**
 * Displays @var sidebar on desktop screen sizes
 */
const displaySidebarOnDesktopView = () => {
    if (window.innerWidth >= 1025) {
        sidebar.style.width = '250px';
    } else {
        sidebar.style.width = '0px';
    }
};

// The first time the page loads display the list of properties
initPropertiesWrapper();
properties.forEach(property => renderProperty(property));


hamburgerToggler.addEventListener('click', toggleSidebarDisplay);
searchButton.addEventListener('click', handleSearch);
window.addEventListener('resize', displaySidebarOnDesktopView);
window.addEventListener('hashchange', handleHashChange);
window.addEventListener('keypress', handleSearchOnEnterKeypress);