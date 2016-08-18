'use strict';

// list out explicitly to control order
module.exports = (slapp, script) => {
  require('./help')(slapp);
  require('./report')(slapp, script);
};