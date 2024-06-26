

module.exports = {
    createUser: [
        {
            model: 'username',
            required: true,
        },
        {
            model: 'password',
            required: true,
        },
        {
            model: 'email',
            required: true,
        },
        {
            model: 'role',
            required: true,
        },
    ],
    loginUser: [
        {
            model: 'password',
            required: true,
        },
        {
            model: 'email',
            required: true,
        },
    ],
    assign: [
        {
            model: 'admins',
            required: true,
        },
        {
            model: 'schools',
            required: true,
        },
    ],
}


