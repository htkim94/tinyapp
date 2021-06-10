const { assert } = require('chai');

const { checkExistingEmail } = require('../helpers.js');

const testUsers = {
  "userRandomID": {
    id: "userRandomID", 
    email: "user@example.com", 
    password: "purple-monkey-dinosaur"
  },
  "user2RandomID": {
    id: "user2RandomID", 
    email: "user2@example.com", 
    password: "dishwasher-funk"
  }
};

describe('getUserByEmail', function() {
  it('should return a user with valid email', function() {
    const user = checkExistingEmail("user@example.com", testUsers).id;
    const expectedOutput = "userRandomID";
    // Write your assert statement here
    assert.equal(user, expectedOutput);
  });

  it("should return undefined if the email doesn't exist", () => {
    const user = checkExistingEmail("user3@example.com", testUsers);
    const expectedOutput = undefined;
    assert.equal(user, expectedOutput);
  })
});