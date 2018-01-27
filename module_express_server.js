// DATABASES

module.exports = {

  /* ### DATABASES ### */

  usersDB: {},

  urlsDB: {},

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

  getShortURL: function(url, userURLs) {
    for (let key in userURLs) {
      if (userURLs[key] === url) {
        return key;
      }
    }
    return undefined;
  },

  // gets longURL by shortURL (if it doesn't exist, return - 1)
  getLongURL: function(shortURL) {
    for (let index in this.urlsDB) {
      if (this.urlsDB[index].hasOwnProperty(shortURL)) {
        return this.urlsDB[index][shortURL];
      }
    }
    return - 1;
  }

};

// function generateRandomString() {
//   let randomStr = "";
//   const alphabetAndDigits = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

//   for (var i = 0; i < 6; i++) {
//     randomStr += alphabetAndDigits.charAt(Math.floor(Math.random() * alphabetAndDigits.length));
//   }
//   return randomStr;
// }

// function hasUser(userID) {
//   if (!userID) {
//     return false;
//   } else {
//     for (let user in usersDB) {
//       if (user === userID) {
//         return true;
//       }
//     }
//   return false;
//   }
// }

// function hasUserEmail (email) {
//   for (let user in usersDB) {
//     if (usersDB[user].email === email) {
//       return true;
//     }
//   }
//   return false;
// }

// function getUserID(email) {
//   for (let user in usersDB) {
//     if (usersDB[user].email === email) {
//       return usersDB[user].id;
//     }
//   }
// }

// gets the shortURL (key) using the url (value) in
// a Object {shortURL: url, shortURL: url, ...}
// function getShortURL (url, userURLs) {
//   for (let key in userURLs) {
//     if (userURLs[key] === url) {
//       return key;
//     }
//   }
//   return undefined;
// }

// gets longURL by shortURL (if it doesn't exist, return - 1)
// function getLongURL(shortURL) {

//   for (let index in urlsDB) {
//     if (urlsDB[index].hasOwnProperty(shortURL)) {
//       return urlsDB[index][shortURL];
//     }
//   }
//   return - 1;
// }