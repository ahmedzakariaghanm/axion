const mongoose = require('mongoose')
var studentSchema = new mongoose.Schema({
    studentname: String,
    classroomid: String,
    schoolid: String,
})
var StudentModel = mongoose.model('student', studentSchema)
module.exports = class Student {

    constructor() { }

    async createStudent({ studentname, classroomid, schoolid }) {
        try {
            let student = { studentname, classroomid, schoolid };
            let result = await this.validators.student.createStudent(student);
            if (result) return result;
            let studentCreated = await StudentModel(student).save()
            return {
                student: studentCreated
            };
        } catch (error) {
            console.log(error)
            return error
        }
    }

    async updateStudent({ id, studentname, classroomid, schoolid }) {
        try {
            let student = { id, studentname, classroomid, schoolid };
            let result = await this.validators.student.updateStudent(student);
            if (result) return result;
            await StudentModel.updateOne({ _id: id, schoolid }, student)
            let studentUpdated = await StudentModel.findOne({ _id: id, schoolid })
            return {
                student: studentUpdated
            };
        } catch (error) {
            console.log(error)
            return error
        }
    }

    async getStudent({ id, schoolid }) {
        try {
            let studentInput = { id };
            let result = await this.validators.student.getStudent(studentInput);
            if (result) return result;
            let student = await StudentModel.findOne({ _id: id, schoolid })
            return {
                student: student
            };
        } catch (error) {
            console.log(error)
            return error
        }
    }

    async deleteStudent({ id, schoolid }) {
        try {
            let studentInput = { id };
            let result = await this.validators.student.deleteStudent(studentInput);
            if (result) return result;
            let student = await StudentModel.deleteOne({ _id: id, schoolid })
            if (student.deletedCount > 0) {
                return "Deleted successfully";
            } else {
                throw "Student not found"
            }
        } catch (error) {
            console.log(error)
            return error
        }
    }

    async getStudents({ limit = 10, offset = 0 }) {
        try {
            let skip = offset * limit
            let students = await StudentModel.find({}, {}, { limit, skip })
            return {
                students: students,
                limit,
                offset
            };
        } catch (error) {
            console.log(error)
            return error
        }
    }
}

