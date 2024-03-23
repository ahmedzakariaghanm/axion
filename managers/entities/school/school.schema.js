

module.exports = {
    createSchool: [
        {
            model: 'schoolname',
            required: true,
        },
    ],
    updateSchool: [
        {
            model: 'id',
            required: true,
        },
        {
            model: 'schoolname',
            required: true,
        },
    ],
    getSchool: [
        {
            model: 'id',
            required: true,
        },
    ],
    deleteSchool: [
        {
            model: 'id',
            required: true,
        },
    ],
}


