const mongoose = require('mongoose')
var schoolSchema = new mongoose.Schema({
    schoolname: String,
})
var SchoolModel = mongoose.model('school', schoolSchema)
module.exports = class School {

    constructor() { }

    async createSchool({ schoolname, decoded }) {
        try {
            let school = { schoolname };
            let result = await this.validators.school.createSchool(school);
            if (result) return result;
            let schoolCreated = await SchoolModel(school).save()
            return {
                school: schoolCreated
            };
        } catch (error) {
            console.log(error)
            return error
        }
    }

    async updateSchool({ id, schoolname }) {
        try {
            let school = { id, schoolname };
            let result = await this.validators.school.updateSchool(school);
            if (result) return result;
            await SchoolModel.updateOne({ _id: id }, school)
            let schoolUpdated = await SchoolModel.findOne({ _id: id })
            return {
                school: schoolUpdated
            };
        } catch (error) {
            console.log(error)
            return error
        }
    }

    async getSchool({ id }) {
        try {
            let schoolInput = { id };
            let result = await this.validators.school.getSchool(schoolInput);
            if (result) return result;
            let school = await SchoolModel.findOne({ _id: id })
            return {
                school: school
            };
        } catch (error) {
            console.log(error)
            return error
        }
    }

    async deleteSchool({ id }) {
        try {
            let schoolInput = { id };
            let result = await this.validators.school.deleteSchool(schoolInput);
            if (result) return result;
            let school = await SchoolModel.deleteOne({ _id: id })
            return {};
        } catch (error) {
            console.log(error)
            return error
        }
    }

    async getSchools({ limit = 10, offset = 0 }) {
        try {
            let skip = offset * limit
            let schools = await SchoolModel.find({}, {}, { limit, skip })
            return {
                schools: schools,
                limit,
                offset
            };
        } catch (error) {
            console.log(error)
            return error
        }
    }
}

