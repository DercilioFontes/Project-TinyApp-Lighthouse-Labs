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

  generateRandomString: function() {
    let randomStr = "";
    const alphabetAndDigits = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

    for (var i = 0; i < 6; i++) {
      randomStr += alphabetAndDigits.charAt(Math.floor(Math.random() * alphabetAndDigits.length));
    }
    return randomStr;
  },

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

  hasUserEmail: function (email) {
    for (let user in this.usersDB) {
      if (this.usersDB[user].email === email) {
        return true;
      }
    }
    return false;
  },

  getUserID: function(email) {
    for (let user in this.usersDB) {
      if (this.usersDB[user].email === email) {
        return this.usersDB[user].id;
      }
    }
  },

  getShortURL: function(url, userID) {
    for (let key in this.urlsDB[userID]) {
      if (this.urlsDB[userID][key] === url) {
        return key;
      }
    }
  },

  // gets longURL by shortURL (if it doesn't exist, return - 1)
  getLongURL: function(shortURL, userID) {
    if (this.urlsDB[userID].hasOwnProperty(shortURL)) {
      return this.urlsDB[userID][shortURL];
    }
  }

};