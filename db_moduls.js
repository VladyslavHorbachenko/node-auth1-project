const knex = require('knex');
const knexConfig = require('./knexfile')

const db = knex(knexConfig.development);

module.exports = {
    getAllUsers,
    addUser,
    userLogin
}

function getAllUsers() {
    return db('users')
}
function addUser(user) {
    return db('users')
        .insert(user)
}

function userLogin(userName) {
    return db('users')
        .where('name', userName)
        .first()
}