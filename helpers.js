//Check if email exists, if so, return the object
const checkExistingEmail = (str, data) => {
  if (!Object.keys(data).length) return undefined;
  for (let u in data) {
    if (data[u].email === str) return data[u];
  }
  return undefined;
};

//Random ID generator
const generateRandomString = () => {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const lastIndex = characters.length - 1;
  let result = "";
  for (let i = 6; i > 0; i--) {
    result += characters.charAt(
      Math.floor(Math.random() * (lastIndex - 0) + 0)
    );
  }
  return result;
};

module.exports = { checkExistingEmail, generateRandomString };
