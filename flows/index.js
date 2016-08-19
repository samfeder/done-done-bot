'use strict';

// list out explicitly to control order
module.exports = (slapp, script, client) => {
  require('./help')(slapp);
  require('./report')(slapp, script, client);
};