function htmlEscape(text) {
   return text.replace(/&/g, '&amp;').
     replace(/</g, '&lt;').
     replace(/"/g, '&quot;').
     replace(/'/g, '&#039;');
}

function XSS(data, next) {
    for (var key in data) {
        data[key] = htmlEscape(data[key]);
    }
    next();
}

module.exports = XSS;