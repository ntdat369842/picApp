let stripTrailingSlash = (str) => {
    return (str.charAt(str.length - 1) == '/') ? str.substr(0, str.length - 1) : str;
}

module.exports = {
    stripTrailingSlash
}