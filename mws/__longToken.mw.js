let ignoreURL = ['/api/user/login', '/api/user/create']
module.exports = ({ meta, config, managers }) => {
    return ({ req, res, next }) => {
        if (!res.req.headers.token && !ignoreURL.includes(res.req.url)) {
            console.log('token required but not found')
            return managers.responseDispatcher.dispatch(res, { ok: false, code: 401, errors: 'unauthorized' });
        }
        let decoded = null;
        try {
            if (!ignoreURL.includes(res.req.url)) {
                decoded = managers.token.verifyLongToken({ token: res.req.headers.token });
                if (!decoded) {
                    console.log('failed to decode-1')
                    return managers.responseDispatcher.dispatch(res, { ok: false, code: 401, errors: 'unauthorized' });
                };
            }
        } catch (err) {
            console.log('failed to decode-2')
            return managers.responseDispatcher.dispatch(res, { ok: false, code: 401, errors: 'unauthorized' });
        }
        res.req.decoded = decoded
        next();
    }
}