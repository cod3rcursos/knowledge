
function existsOrError(value, msg) {
    if(!value) throw msg
    if(Array.isArray(value) && value.length === 0) throw msg
    if(typeof value === 'string' && !value.trim()) throw msg
}

function notExistsOrError(value, msg) {
    if(!value) return
    if(Array.isArray(value) && value.length === 0) return
    throw msg
}

function equalsOrError(valueA, valueB, msg) {
    if(valueA !== valueB) throw msg
}

module.exports = { existsOrError, notExistsOrError, equalsOrError }