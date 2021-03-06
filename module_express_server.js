// DATABASES AND FUNCTIONS

module.exports = {

  /* ### DATABASES ### */

  usersDB: {},

  /*
Model:
const usersDB = {

  gkO5oa: {
    id: 'gkO5oa',
    email: 'dercilio@gmail.com',
    password: 'kkkk',
  },

  oZArTE: {
    id: 'oZArTE',
    email: 'sylvia@gmail.com',
    assword: 'llll',
  }

};
 */

  urlsDB: {},

  /*
Model:
const urlsDB = {

  userID_1: {
    "b2xVn2": "http:www.lighthouselabs.ca",
    "9sm5xK": "http://www.google.com"
  },

  userID_2: {
    "b2xVn2": "http:www.lighthouselabs.ca",
    "9sm5xK": "http://www.google.com"
  }

};
*/

  /* ### FUNCTIONS ### */

  // Generate a rando striong of 6 letters (lower or Upper cases) and digits
  // for using for id of user and for shor tURL
  generateRandomString: function() {
    let randomStr = "";
    const alphabetAndDigits = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

    for (let i = 0; i < 6; i++) {
      randomStr += alphabetAndDigits.charAt(Math.floor(Math.random() * alphabetAndDigits.length));
    }
    return randomStr;
  },

  // Checks if user exists by userID
  hasUser: function(userID) {
    if (!userID) {
      return false;
    } else {
      for (let user in this.usersDB) {
        if (user === userID) {
          return true;
        }
      }
      return false;
    }
  },

  // Checks if user exists by email
  hasUserEmail: function (email) {
    for (let user in this.usersDB) {
      if (this.usersDB[user].email === email) {
        return true;
      }
    }
    return false;
  },

// Get userID by email
  getUserID: function(email) {
    for (let user in this.usersDB) {
      if (this.usersDB[user].email === email) {
        return this.usersDB[user].id;
      }
    }
  },

// Get short URL by email
  getShortURL: function(url, userID) {
    for (let key in this.urlsDB[userID]) {
      if (this.urlsDB[userID][key] === url) {
        return key;
      }
    }
  },

  // gets long URL by short URL (if it doesn't exist)
  getLongURL: function(shortURL) {
    for (let key in this.urlsDB) {
      if (this.urlsDB[key].hasOwnProperty(shortURL)) {
        return this.urlsDB[key][shortURL];
        break;
      }
    }
  }
};