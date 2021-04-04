function getDate(){
    let d = new Date();
    return `${d.getMonth()}/${d.getDate()}/${d.getFullYear()}`;
}
module.exports = getDate;