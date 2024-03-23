

module.exports = {
    createStudent: [
        {
            model: 'studentname',
            required: true,
        },
        {
            model: 'classroomid',
            required: true,
        },
        {
            model: 'schoolid',
            required: true,
        },
    ],
    updateStudent: [
        {
            model: 'id',
            required: true,
        },
        {
            model: 'studentname',
            required: true,
        },
        {
            model: 'classroomid',
            required: true,
        },
        {
            model: 'schoolid',
            required: true,
        },
    ],
    getStudent: [
        {
            model: 'id',
            required: true,
        },
    ],
    deleteStudent: [
        {
            model: 'id',
            required: true,
        },
    ],
}


