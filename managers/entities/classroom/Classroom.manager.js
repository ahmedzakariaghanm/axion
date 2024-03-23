const mongoose = require('mongoose')
var classroomSchema = new mongoose.Schema({
    classroomname: String,
    schoolid: String,
})
var ClassroomModel = mongoose.model('classroom', classroomSchema)
module.exports = class Classroom {

    constructor() { }

    async createClassroom({ classroomname, schoolid }) {
        try {
            let classroom = { classroomname, schoolid };
            let result = await this.validators.classroom.createClassroom(classroom);
            if (result) return result;
            let classroomCreated = await ClassroomModel(classroom).save()
            return {
                classroom: classroomCreated
            };
        } catch (error) {
            console.log(error)
            return error
        }
    }

    async updateClassroom({ id, classroomname, schoolid }) {
        try {
            let classroom = { id, classroomname, schoolid };
            let result = await this.validators.classroom.updateClassroom(classroom);
            if (result) return result;
            await ClassroomModel.updateOne({ _id: id, schoolid }, classroom)
            let classroomUpdated = await ClassroomModel.findOne({ _id: id, schoolid })
            return {
                classroom: classroomUpdated
            };
        } catch (error) {
            console.log(error)
            return error
        }
    }

    async getClassroom({ id, schoolid }) {
        try {
            let classroomInput = { id };
            let result = await this.validators.classroom.getClassroom(classroomInput);
            if (result) return result;
            let classroom = await ClassroomModel.findOne({ _id: id, schoolid })
            return {
                classroom: classroom
            };
        } catch (error) {
            console.log(error)
            return error
        }
    }

    async deleteClassroom({ id, schoolid }) {
        try {
            let classroomInput = { id };
            let result = await this.validators.classroom.deleteClassroom(classroomInput);
            if (result) return result;
            let classroom = await ClassroomModel.deleteOne({ _id: id, schoolid })
            return {};
        } catch (error) {
            console.log(error)
            return error
        }
    }

    async getClassrooms({ limit = 10, offset = 0 }) {
        try {
            let skip = offset * limit
            let classrooms = await ClassroomModel.find({}, {}, { limit, skip })
            return {
                classrooms: classrooms,
                limit,
                offset
            };
        } catch (error) {
            console.log(error)
            return error
        }
    }
}

