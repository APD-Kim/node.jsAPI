var today = new Date();

var year = today.getFullYear();
var month = ('0' + (today.getMonth() + 1)).slice(-2);
var day = ('0' + today.getDate()).slice(-2);

let dateString = year + '-' + month + '-' + day;

console.log(`hi`);

export default dateString;