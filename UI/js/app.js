const hamburgerToggler = document.querySelector('.toggler');
const sidebar = document.querySelector('aside');
const contentBox = document.querySelector('.contents');
const deletePropertyModal = document.querySelector('.modal');
const deleteModalCancelButton = document.querySelector('.modal button.cancel-delete');
const deleteModalConfirmButton = document.querySelector('.modal button.confirm-delete');
const deleteModalPropertyTitle = document.querySelector('.modal .modal-body .property-title');
let searchFieldHasFocus = false;
let currentPropertyImageIndex = 0;
let searchField;
let searchButton;
let propertiesWrapper;
let nextImageButton;
let previousImageButton;
let propertyImageList;
let propertyImage;
let propertyStatusToggler;
let deletePropertyButton;
let editPropertyButton;

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
const currentUser = users[0];


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
 * Sets highlight on the current user nav item selected
 */
const setActiveUserOption = () => {
    const userOptions = ['view-all', 'view-yours', 'post'];
    const urlHash = window.location.hash.substring(1).replace('_', '-');

    const removeActiveOption = () => {
        const activeOption = document.querySelector('nav .active');
        if (activeOption) {
            activeOption.classList.remove('active');
        }
    };

    // Empty URL hash implies all property view
    if (urlHash === '') {
        removeActiveOption();
        document.querySelector('.item__view-all').classList.add('active');
        return;
    }

    // Set nothing if URL hash is not existent on the nav
    if (!userOptions.includes(urlHash)) {
        removeActiveOption();
        return;
    }
    
    // Set active
    if (urlHash) {
        removeActiveOption();
        document.querySelector(`nav .item__${urlHash}`)
            .classList.add('active');
        return;
    }
};    


/**
 * Toggles the sidebar on click on the hamburger in mobile and tablet modes
 * by setting @var sidebar's width and @var hamburgerWrapper's left position
 */
const toggleSidebarDisplay = () => {
    const hamburgerWrapper = document.querySelector('.hamburger-wrapper');
    let width = hamburgerToggler.checked ? '250px' : '0px';
    sidebar.style.width = width;
    // hamburgerWrapper.style.left = width;
};


/**
 * Collapses sidebar when window size is below desktop size.
 * @emits click event for @var hamburgerToggler
 */ 
const autoCollapseSidebar = () => {
    if (window.innerWidth < 1025 && hamburgerToggler.checked) {
        hamburgerToggler.click();
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


/**
 * Clears the contents of the main page: @var contentBox
 */
const clearContentBox = () => {
    contentBox.textContent = "";
};


/**
 * The @var contentBox is by default empty, this function inserts a "search-wrapper"
 * div and a "properties-wrapper" div (@var propertiesWrapper) into it.
 * 
 * It initializes @var searchField, @var searchButton, and @var propertiesWrapper
 * and sets @event focus and @event blur listeners on @var searchField that toggle
 * @var searchFieldHasFocus value
 */
const initPropertiesWrapper = () => {
    const markup =
        `<div class="search-wrapper">
            <form action="" id="search-form">
                <input type="text" name="search" placeholder="Search all properties">
                <input type="submit" value="search" class="text--white text--capitalized">
            </form>
        </div>
        <div class="properties-wrapper">
        <!-- Properties will be rendered here -->
        </div>`;

    contentBox.insertAdjacentHTML('afterbegin', markup);
    searchField = document.querySelector('#search-form input[type="text"]');
    searchButton = document.querySelector('#search-form input[type="submit"]');
    searchButton.addEventListener('click', handleSearch);
    searchField.addEventListener('focus', () => searchFieldHasFocus = true);
    searchField.addEventListener('blur', () => searchFieldHasFocus = false);
    propertiesWrapper = document.querySelector('.properties-wrapper');
};


/**
 * Clears the contents of @var propertiesWrapper
 */
const clearProperties = () => {
    propertiesWrapper.textContent = '';
};


/**
 * Renders a property object in a lilst inside @var propertiesWrapper if the 
 * property exists else it sets an error message on the screen.
 * 
 * @param {Property} property 
 */
const renderPropertyInList = property => {
    const markup = property ?
    `
    <a href="#detail=${property.propertyId}" class="text--black">
        <div class="properties" data-propertyId="${property.propertyId}">
            <div class="img-wrapper">
                <img src="${property.images.length ? property.images[0] : null}" alt="${property.title}">
            </div>
            <div class="text-wrapper">
                <h3>${property.title}</h3>
                <h4 class="text--ellipsised">${property.price}</h4>
                <p class="text--ellipsised">
                    ${property.description}
                </p>
            </div>
        </div>
    </a>
    `
    :
    '<h2 class="text--aligned-center">No property to display :(</h2>';

    propertiesWrapper.insertAdjacentHTML('afterbegin', markup);
};


/**
 * Renders all property ads on the screen
 * Calls @function clearContentBox, @function initPropertiesWrapper,
 * and @function renderPropertyInList
 */
const renderAllPropertyAds = () => {
    clearContentBox();
    initPropertiesWrapper();

    properties.length ? properties.forEach(property => renderPropertyInList(property))
    :
    renderPropertyInList();
};


/**
 * Renders property ads posted by the current user on the screen
 * Calls @function clearContentBox, @function initPropertiesWrapper,
 * and @function renderPropertyInList
 */
const renderUserPropertyAds = () => {
    clearContentBox();
    initPropertiesWrapper();
    const userAds = properties.filter(el => el.agentId === currentUser.userId)
    userAds.length ? userAds.forEach(property => renderPropertyInList(property))
    :
    renderPropertyInList();
};


/**
 * Handles user search actions by changing the window hash value.
 * @emits hashchange
 * @param {DOMEvent} event 
 */
const handleSearch = event => {
    event.preventDefault();
    // obtain search term and change the window hash value using the term
    const searchTerm = encodeURIComponent(searchField.value.trim().toLowerCase());
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
 * Filters properties (using @member title, @member description, and @member type
 * @memberof Property) by @param value
 * 
 * Calls @function clearProperties, and @function renderPropertyInList
 * @param {string} value
 */
const searchProperties = value => {
    const results = properties.filter(property => {
        return property.type.toLowerCase().includes(value) ||
        property.title.toLowerCase().includes(value) ||
        property.description.toLowerCase().includes(value);
    });

    searchField.value = value;
    searchField.focus();
    searchField.blur();
    // Clear the existing contents of propertiesWrapper
    clearProperties()
    // Render results or error message (by passing no argument into "renderPropertyInList")
    if (results.length === 0) {
        renderPropertyInList();
    } else {
        results.forEach(el => renderPropertyInList(el));
    }
};


/**
 * Retrieves the id of the property active in view
 */
const getCurrentPropertyId = () => parseInt(window.location.hash.split('=')[1]);


/**
 * Retrieves the property object active in view.
 * 
 * @returns {Property} object
 */
const getCurrentProperty = () => {
    return properties.find(el => 
        el.propertyId === getCurrentPropertyId());
};


/**
 * Retrieves the markup to display details of a specific property ad.
 * 
 * @param {Property} property 
 * @param {Agent} agent 
 * @param {boolean} userOwnsAd 
 */
const getPropertyDetailMarkup = (property, agent, userOwnsAd) => {    
    const propertyStatus = property.sold;
    return `
    <div class="details-wrapper">
        <div class="property-details">
            <h2 class="title">${property.title}</h2>
            <div class="status-wrapper">
                <p>Status: <span class="status text--capitalized">
                    ${propertyStatus ? "sold" : "available"}
                </span></p>

             <div class="${userOwnsAd ? '' : "no-display "}
                ${propertyStatus ? "sold " : "available "}status-toggler-wrapper">

                 <input type="checkbox" name="status-toggler"
                    class="status-toggler" ${propertyStatus ? "checked" : null}>

                 <label for="status-toggler" class="text--capitalized">Mark as sold</label>

             </div>
            </div>
            <div class="img-wrapper">
                <div class="prev-img">
                    <div class="button"></div>
                    <object data="./images/arrow_back.svg" type="image/svg+xml"></object>
                </div>
                <img src="${propertyImageList[currentPropertyImageIndex]}" alt="${property.title}">
                <div class="next-img">
                    <div class="button"></div>
                    <object data="./images/arrow_forward.svg" type="image/svg+xml"></object>
                </div>
            </div>
            <h3 class="price">${property.price}</h3>
            <p class="description">
                ${property.description}
            </p>
            <div class="property-location-wrapper">
                <span class="icon">
                    <object data="./images/location-icon.svg" type="image/svg+xml"></object>
                </span>
                <p class="property-location">${property.location}</p>
            </div>
        </div>
        <div class="agent-details">
            <h2 class="header">Agent details</h2>
            <h4 class="agent-name">${agent.firstName + ' ' + agent.lastName}</h4>
            <div class="agent-address-wrapper">
                <span class="icon">
                    <object data="./images/location-icon.svg" type="image/svg+xml"></object>
                </span>
                <p class="agent-addresss">${agent.address}</p>
            </div>
            <div class="phone">
                <span class="icon">
                    <object data="./images/phone-icon.svg" type="image/svg+xml"></object>
                </span>
                <a href="tel:${agent.phone}">${agent.phone}</a>
            </div>
        </div>

     <div class="${userOwnsAd ? '' : 'no-display '}buttons">
            <button type='button'
                class="text--capitalized text--white edit-btn">edit</button>
            <button type='button'
                class="text--capitalized text--white delete-btn">delete</button>
        </div>
    </div>`;
};

/**
 * Renders the details of a specific property on the screen.
 * 
 * Calls @function getPropertyDetailMarkup
 * Initializes @var nextImageButton,@var previousImageButton, @var propertyImage,
 * and @var propertyImageList
 * 
 * @param {Property} property 
 */
const renderPropertyDetails = property => {
    // Show error message if property does not exist
    if (!property) {
        contentBox.insertAdjacentHTML('afterbegin',
        '<h3 class="text--aligned-center">:/ The requested property ad does not exist</h3>');
        return;
    }

    propertyImageList = property.images;
    const agent = users.find(el => el.userId === property.agentId);
    const userOwnsAd = agent.userId === currentUser.userId;
    
    const markup = getPropertyDetailMarkup(property, agent, userOwnsAd);

    contentBox.insertAdjacentHTML('afterbegin', markup);

    propertyImage = document.querySelector('.property-details .img-wrapper img');
    nextImageButton = document.querySelector('.next-img div');
    previousImageButton = document.querySelector('.prev-img div');
    nextImageButton.addEventListener('click', displayNextPropertyImage);
    previousImageButton.addEventListener('click', displayPreviousPropertyImage);
    
    if (userOwnsAd) {
        propertyStatusToggler = document.querySelector('div.status-toggler-wrapper input');
        propertyStatusToggler.addEventListener('click', togglePropertyStatus);
        deletePropertyButton = document.querySelector('.delete-btn');
        deletePropertyButton.addEventListener('click', showDeletePropertyModal);
        editPropertyButton = document.querySelector('.edit-btn');
        editPropertyButton.addEventListener('click', editProperty);
    }
};


/**
 * Handles @var propertyStatusToggler's click event and toggles @member sold
 * @memberof Property
 */
const togglePropertyStatus = () => {
    const property = getCurrentProperty();
    property.sold = propertyStatusToggler.checked;
    clearContentBox();
    renderPropertyDetails(getCurrentProperty());
};


/**
 * Handles clicks on @var nextImageButton in the property detail view
 * to show the next image.
 */
const displayNextPropertyImage = () => {
    if (currentPropertyImageIndex < propertyImageList.length - 1) {
        currentPropertyImageIndex++;
        propertyImage.src = propertyImageList[currentPropertyImageIndex];
    }
};


/**
 * Handles clicks on @var previousImageButton in the property detail view
 * to show the next image.
 */
const displayPreviousPropertyImage = () => {
    if (currentPropertyImageIndex > 0) {
        currentPropertyImageIndex--;
        propertyImage.src = propertyImageList[currentPropertyImageIndex];
    }
};


/**
 * Handles user's choice to edit a specific property ad item
 * @emits hashchange
 */
const editProperty = () => {
    const propertyId = getCurrentPropertyId();
    window.location.hash = `edit=${propertyId}`;
}


/**
 * Displays modal to confirm or cancel property item deletion
 */
const showDeletePropertyModal = () => {
    deleteModalPropertyTitle.textContent = getCurrentProperty().title;
    deletePropertyModal.classList.remove('no-display');
};


/**
 * Closes @var deletePropertyModal
 */
const closeDeletePropertyModal = () => deletePropertyModal.classList.add('no-display');


/**
 * Handles property delete confirmation and deletes the property currently in view.
 * 
 * Calls @function closeDeletePropertyModal
 * @emits hashchange
 */
const deleteProperty = () => {
    properties.splice(properties.findIndex(
        el => el.propertyId === getCurrentProperty().propertyId), 1);
    closeDeletePropertyModal();
    window.location.hash = 'view_yours';
};


/**
* Retrieves the property form markup either blank or prepopulated.
* @param {Property} property 
*/
const getPropertyFormMarkup = property => {
    let title, description, price, type, propertyLocation;
    if (property) {
        title = property.title.trim();
        description = property.description.trim();
        price = property.price;
        type = property.type.trim();
        propertyLocation = property.location.trim();
    }
    
    return `
    <div class="form-wrapper">
                <div class="msg-wrapper text--aligned-center">
                    <h2>
                        ${property ? "Update property ad" : "Post a property ad"}
                    </h2>
                </div>
            <form action="" class="property-form data-form">
                <p class="error-msg no-display toggle-display">
                    Field is required!
                </p>
                <formgroup class="title-group">
                    <label for="title">Title</label>
                    <input type="text" name="title" required minlength="20" maxlength="100"
                        value="${property ? title : ''}">
                </formgroup>
                <formgroup class="price-group">
                    <label for="price">price (₦)</label>
                    <input type="number" name="price" required
                        value=${property ? price.match(/\d+/g) : ''}>
                </formgroup>
                <formgroup class="type-group">
                    <label for="type">type</label>
                    <input type="text" name="type" required minlength="5" maxlength="50"
                        value="${property ? type : ''}">
                </formgroup>
                <formgroup class="image-group">
                    <label for="image">choose image</label>
                    <input type="file" accept=".png,.jpg,.jpeg" name="image" multiple>
                </formgroup>
                <formgroup class="location-group">
                    <label for="location">location</label>
                    <input type="text" name="location" required minlength="10" maxlength="50"
                        value="${property ? propertyLocation : ''}">
                </formgroup>
                <formgroup class="description-group">
                    <label for="description">description</label>
                    <textarea type="text" name="description"
                        required minlength="50" maxlength="500">${property ?
                            description : ''}</textarea>
                </formgroup>
                
                <formgroup class="submit">
                    <input type="submit" class="text--white" id="post-property-btn" value="Save">
                </formgroup>
             </form>
         </div>
    `;
};

/**
 * Renders the property detail form on the screen. It either renders
 * prepopulated form fields (for update) or blank form (for a new ad).
 * 
 * Calls @function getPropertyFormMarkup, and @function clearContentBox
 * @param {Property} property 
 */
const renderPropertyPostForm = property => {
    const markup = getPropertyFormMarkup(property);
    clearContentBox();
    contentBox.insertAdjacentHTML('afterbegin', markup);
};


/**
 * Handle window @event hashchange
 * 
 * Calls @function clearContentBox, @function initPropertiesWrapper,
 * @function searchProperties, @function renderPropertyDetails,
 * @function renderAllPropertyAds, and @function renderUserPropertyAds
 */
const handleHashChange = () => {
    // Obtain the hash, hashTerm and searchTerm (if hashTerm is "search")
    const hash = window.location.hash.substring(1);
    const [hashTerm, hashValue] = hash.split('=');

    switch (hashTerm) {
        case 'search':
            clearContentBox();
            initPropertiesWrapper();
            searchProperties(decodeURIComponent(hashValue));
            break;
        case 'view_all':
            autoCollapseSidebar();
        case '':
            setActiveUserOption();
            renderAllPropertyAds();
            break;
        case 'view_yours':
            setActiveUserOption();
            renderUserPropertyAds();
            autoCollapseSidebar();
            break;
        case 'post':
            setActiveUserOption();
            renderPropertyPostForm();
            autoCollapseSidebar();
            break;
        case 'detail':
            setActiveUserOption();
            clearContentBox();
            renderPropertyDetails(getCurrentProperty());
            break;
        case 'edit':
            setActiveUserOption();
            clearContentBox();
            renderPropertyPostForm(getCurrentProperty());
            break;
        default:
            clearContentBox();
    }
};


// Check URL update page
handleHashChange();

hamburgerToggler.addEventListener('click', toggleSidebarDisplay);
deleteModalCancelButton.addEventListener('click', closeDeletePropertyModal);
deleteModalConfirmButton.addEventListener('click', deleteProperty);
window.addEventListener('resize', displaySidebarOnDesktopView);
window.addEventListener('hashchange', handleHashChange);
window.addEventListener('keypress', handleSearchOnEnterKeypress);