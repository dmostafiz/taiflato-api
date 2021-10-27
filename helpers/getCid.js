module.exports = function getCid(substr = 5){
    const date = Date.now().toString()
    return date.substr(- substr)
} 