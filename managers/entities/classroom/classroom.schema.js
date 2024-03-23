

module.exports = {
    createClassroom: [
        {
            model: 'classroomname',
            required: true,
        },
        {
            model: 'schoolid',
            required: true,
        },
    ],
    updateClassroom: [
        {
            model: 'id',
            required: true,
        },
        {
            model: 'schoolid',
            required: true,
        },
        {
            model: 'classroomname',
            required: true,
        },
        {
            model: 'schoolid',
            required: true,
        },
    ],
    getClassroom: [
        {
            model: 'id',
            required: true,
        },
    ],
    deleteClassroom: [
        {
            model: 'id',
            required: true,
        },
    ],
}


