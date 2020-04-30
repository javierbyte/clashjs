const _ = require('lodash')
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

const botNames = [
'Scrappie',
'Qwerty',
'Aqcroid',
'Rusty',
'Screwie',
'Combot',
'Bit',
'Tinker',
'Opaxtron',
'Spanner',
'Curious Droid',
'Spudnik',
'Rob Oto',
'Otto',
'Anne Droid',
'Greez',
'Spark',
'Spanner',
'Drillbit',
'Gadget',
'Ratchet',
'Rob Oto',
'Twobit',
'01010010',
'Combot',
'Robbie',
'Rob Bott',
'Andy Roid',
'Gearz',
'Brobot',
'Rob Oto',
'Screwie',
'Clank',
'Alienroid',
'Mental Gear',
'Magnatau',
'Brave Tank',
'Star Driver',
'Nanochampion',
'Tactical Gear',
'Cyberwing',
'Dash Titan',
'Dynamillion',
'Robous',
'Sol Smasher',
'Cytank',
'Covert Hypersniper',
'Cosmic Fire Sentry',
'Plasma Crusher',
'Meson Eraser',
'Unlimited Drill',
'G-Smasher',
'Lepton Tomahawk',
'Neutrino Crusher',
'Robistic Heart',
'I am a Bot',
'B.R.A.I.N',
'Robo Sticks',
'Obotify',
'Electro Sapien',
'Angelo Robo',
'Robopicks',
'KITT',
'Energizer Bunny',
'Johnny 5',
'Mr. Roboto',
'Marvin',
'Iron Giant',
'Optimus Prime',
'Roomba',
'DJ Roomba',
'Rosie',
'Crow T. Robot',
'Tom Servo',
'K-9 ',
'GLaDOS',
'ASIMO',
'HAL 9000',
'Final Five',
'Bender',
'Wall-E',
]

exports.generateBotName = () => {
  return _.sample(botNames)
}