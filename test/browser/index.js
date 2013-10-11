document.body.innerHTML = '';
window.console.log = function(string) {  
  var el = document.createElement('div');
  el.innerHTML = string;
  document.body.appendChild(el);
};
require('../');