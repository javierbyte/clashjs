var digits = '0123456789';
var lowercase = 'abcdefghijklmnoprstuvxuyz';
var uppercase = lowercase.toUpperCase();
var special = '+/';
var base64Chars;
var base62Chars;
var base32Chars;
var generateBaseString;

module.exports = (exports = {});

base64Chars = function() {
  return [digits, lowercase, uppercase, special].join('');
};

base62Chars = function() {
  return [digits, lowercase, uppercase].join('');
};

base32Chars = function() {
  return [uppercase, digits].join('');
};

generateBaseString = function(pool, length) {
  var output = '';
  var i;

  for (i = 0; i < length; i += 1) {
    output += pool[Math.ceil(Math.random() * 100 % pool.length || 1) - 1];
  }

  return output;
};

exports.generateBase64String = function(length) {
  return generateBaseString(base64Chars(), length);
};

exports.generateBase62String = function(length) {
  return generateBaseString(base62Chars(), length);
};

exports.generateBase32String = function(length) {
  return generateBaseString(base32Chars(), length);
};

exports.generateBase10String = function(length) {
  return generateBaseString(digits, length);
};
