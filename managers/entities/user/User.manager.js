const mongoose = require('mongoose')
const bcrypt = require('bcrypt');
const saltRounds = 10;

var userSchema = new mongoose.Schema({
    username: String,
    email: String,
    password: String,
    role: String,
    schools: [String],
})

var UserModel = mongoose.model('user', userSchema)
module.exports = class User {

    constructor({ utils, cache, config, cortex, managers, validators, mongomodels } = {}) {
        this.config = config;
        this.cortex = cortex;
        this.validators = validators;
        this.mongomodels = mongomodels;
        this.tokenManager = managers.token;
        this.usersCollection = "users";
        this.userExposed = ['createUser'];
    }

    async createUser({ username, email, password, role }) {
        try {
            const user = { username, email, password, role };
            let isUserExists = await UserModel.findOne({
                $or: [
                    { username }, { email }
                ]
            })
            if (isUserExists) {
                throw 'user already exists'
            }
            // Data validation
            let result = await this.validators.user.createUser(user);
            if (result) return result;

            // Creation Logic
            let createdUser = { username, email, password, role }
            let hash = await bcrypt.hash(createdUser.password, saltRounds)
            createdUser.password = hash
            let userr = await UserModel(createdUser).save()
            let longToken = this.tokenManager.genLongToken({ userId: createdUser._id, userKey: createdUser.key, role: createdUser.role, entities: [] });

            // Response
            return {
                user: {
                    email: createdUser.email,
                    username: createdUser.username,
                    role: createdUser.role,
                },
                longToken
            };

        } catch (e) {
            console.log(e)
            return { "error": String(e) }

        }
    }
    async loginUser({ email, password }) {
        try {
            const user = { email, password };
            let result = await this.validators.user.loginUser(user);
            if (result) return result;
            let createdUser = await UserModel.findOne({ email });
            if (!createdUser) {
                throw "Invalid username or password"
            }
            let isValidPassword = await bcrypt.compare(password, createdUser.password)
            if (!isValidPassword) {
                throw "Invalid username or password"
            }
            let schools = createdUser.schools || []
            let longToken = this.tokenManager.genLongToken({ userId: createdUser._id, userKey: createdUser.key, role: createdUser.role, schools });

            return {
                user: {
                    email: createdUser.email,
                    username: createdUser.username
                },
                longToken
            };

        } catch (e) {
            // console.log(e)
            return { "error": String(e) }
        }
    }

    async assign({ admins, schools }) {
        try {
            const assignObj = { admins, schools };
            let result = await this.validators.user.assign(assignObj);
            if (result) return result;
            let createdUser = await UserModel.updateMany({ _id: { $in: admins } }, [{ $set: { schools } }]);
            return {
                user: createdUser
            };

        } catch (e) {
            // console.log(e)
            return { "error": String(e) }
        }
    }
}