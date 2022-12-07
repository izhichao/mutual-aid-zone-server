function randomPassword(length) {
  const chars = '0123456789abcdefghijklmnopqrstuvwxtzABCDEFGHIJKLMNOPQRSTUVWXYZ_!';
  let password = '';
  for (let i = 0; i < length; i++) {
    let index = Math.floor(Math.random() * chars.length);
    password += chars[index];
  }
  return password;
}

module.exports = randomPassword;
