# PropertyPro-lite
[![Build Status](https://travis-ci.org/Qausim/PropertyPro-lite.svg?branch=develop)](https://travis-ci.org/Qausim/PropertyPro-lite)
[![Coverage Status](https://coveralls.io/repos/github/Qausim/PropertyPro-lite/badge.svg?branch=develop)](https://coveralls.io/github/Qausim/PropertyPro-lite?branch=develop)
[![Maintainability](https://api.codeclimate.com/v1/badges/12eff0d6a45f42706976/maintainability)](https://codeclimate.com/github/Qausim/PropertyPro-lite/maintainability)

PropertyPro-lite is a property listing web application, a platform where people can create and/or search properties for sale or rent.

## Getting Started

## Clone this Repository.
URL: https://github.com/Qausim/PropertyPro-lite.git

## Prerequisites
- Node v10.15.0 or above
- npm v6.4.1 or above

## Endpoints
<table>
  <thead>
    <tr>
      <th>HTTP VERB</th>
      <th>ENDPOINT</th>
      <th>FUNCTIONALITY</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>POST</td>
      <td>/api/v1/auth/signup</td>
      <td>Create a new user acount</td>
    </tr>
    <tr>
      <td>POST</td>
      <td>/api/v1/auth/signin</td>
      <td>Sign into an existing user account</td>
    </tr>
    <tr>
      <td>POST</td>
      <td>/api/v1/property</td>
      <td>Create a new property advert</td>
    </tr>
    <tr>
      <td>GET</td>
      <td>/api/v1/property</td>
      <td>Retrieve all existing property adverts</td>
    </tr>
    <tr>
      <td>GET</td>
      <td>/api/v1/property?type=propertyType</td>
      <td>Search records of property adverts by their type</td>
    </tr>
    <tr>
      <td>GET</td>
      <td>/api/v1/property/<:propertyId></td>
      <td>Retrieve a single property advert</td>
    </tr>
    <tr>
      <td>PATCH</td>
      <td>/api/v1/property/<:propertyId></td>
      <td>Update details of a property advert</td>
    </tr>
    <tr>
      <td>PATCH</td>
      <td>/api/v1/property/<:propertyId>/sold</td>
      <td>Mark a property advert as sold</td>
    </tr>
    <tr>
      <td>DELETE</td>
      <td>/api/v1/property/<:propertyId></td>
      <td>Delete a property advert</td>
    </tr>
  </tbody>
</table>

## Installation

**On your machine**
- Pull the [develop](https://github.com/Qausim/PropertyPro-lite.git) branch of this repository
- Configure a `.env` file in the root directory with variables
  - **JWT_KEY** *(JWT secret key)*
  - **CLOUDINARY_NAME** *(Cloudinary cloud name, with a folder "propertypro-lite")*
  - **CLOUDINARY_KEY** *(Cloudinary API key)*
  - **CLOUDINARY_SECRET** *(Cloudinary API secret)*
  - **DATABASE_URL** *(PostgreSQL connection string)*
  - **ADMIN_EMAIL** *(Email address for an admin user)*
  - **ADMIN_PWD** *(Admin password)*
  - **ADMIN_PHONE_NUMBER** *(Admin phone number)*
  - **ADMIN_ADDRESS** *(Admin address)*
- Run `npm install` to install all dependencies
- Run `npm run server` to start the app
- Access endpoints on **localhost:3000**

## Run Tests
Run `npm test` in the terminal from the root directory of the cloned repository

## Built With

- [Node.js](http://www.nodejs.org/) - runtime environment

## Github Pages URL
URL: https://qausim.github.io/PropertyPro-lite/UI

## Heroku Link
URL: https://propertyprolite-api.herokuapp.com/

## API Documentation
URL: https://propertyprolite-api.herokuapp.com/api-docs

## Pivotal Tracker
URL: https://www.pivotaltracker.com/n/projects/2354402

## Authors
- **Olawumi Qauzeem Yusuff**
