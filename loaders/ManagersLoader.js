const MiddlewaresLoader = require('./MiddlewaresLoader');
const ApiHandler = require("../managers/api/Api.manager");
const LiveDB = require('../managers/live_db/LiveDb.manager');
const UserServer = require('../managers/http/UserServer.manager');
const ResponseDispatcher = require('../managers/response_dispatcher/ResponseDispatcher.manager');
const VirtualStack = require('../managers/virtual_stack/VirtualStack.manager');
const ValidatorsLoader = require('./ValidatorsLoader');
const ResourceMeshLoader = require('./ResourceMeshLoader');
const utils = require('../libs/utils');

const systemArch = require('../static_arch/main.system');
const TokenManager = require('../managers/token/Token.manager');
const SharkFin = require('../managers/shark_fin/SharkFin.manager');
const TimeMachine = require('../managers/time_machine/TimeMachine.manager');
const user = require('../managers/entities/user/User.manager')
const student = require('../managers/entities/student/Student.manager')
const school = require('../managers/entities/school/School.manager')
const classroom = require('../managers/entities/classroom/Classroom.manager')

/** 
 * load sharable modules
 * @return modules tree with instance of each module
*/
module.exports = class ManagersLoader {
    constructor({ config, cortex, cache, oyster, aeon }) {
        this.managers = {
            "user": {
                "create": "",
                "login": "",
                "assign": ""
            },
            "student": {
                "create": "",
                "update": "",
                "get": "",
                "delete": "",
                "getAll": ""
            },
            "school": {
                "create": "",
                "update": "",
                "get": "",
                "delete": "",
                "getAll": ""
            },
            "classroom": {
                "create": "",
                "update": "",
                "get": "",
                "delete": "",
                "getAll": ""
            }
        };
        this.config = config;
        this.cache = cache;
        this.cortex = cortex;

        this._preload();
        this.injectable = {
            utils,
            cache,
            config,
            cortex,
            oyster,
            aeon,
            managers: this.managers,
            validators: this.validators,
            // mongomodels: this.mongomodels,
            resourceNodes: this.resourceNodes,
        };
        let usr = new user({
            managers: { 'token': new TokenManager(this.injectable) },
            validators: this.validators
        })
        this.managers.user.validators = this.validators
        this.managers.user.tokenManager = new TokenManager(this.injectable);
        this.managers.user.create = usr.createUser
        this.managers.user.login = usr.loginUser
        this.managers.user.assign = usr.assign

        let stnt = new student({})
        this.managers.student.validators = this.validators
        this.managers.student.create = stnt.createStudent
        this.managers.student.update = stnt.updateStudent
        this.managers.student.get = stnt.getStudent
        this.managers.student.delete = stnt.deleteStudent
        this.managers.student.getAll = stnt.getStudents

        let schl = new school({})
        this.managers.school.validators = this.validators
        this.managers.school.create = schl.createSchool
        this.managers.school.update = schl.updateSchool
        this.managers.school.get = schl.getSchool
        this.managers.school.delete = schl.deleteSchool
        this.managers.school.getAll = schl.getSchools

        let cr = new classroom({})
        this.managers.classroom.validators = this.validators
        this.managers.classroom.create = cr.createClassroom
        this.managers.classroom.update = cr.updateClassroom
        this.managers.classroom.get = cr.getClassroom
        this.managers.classroom.delete = cr.deleteClassroom
        this.managers.classroom.getAll = cr.getClassrooms


    }

    _preload() {
        const validatorsLoader = new ValidatorsLoader({
            models: require('../managers/_common/schema.models'),
            customValidators: require('../managers/_common/schema.validators'),
        });
        const resourceMeshLoader = new ResourceMeshLoader({})
        // const mongoLoader      = new MongoLoader({ schemaExtension: "mongoModel.js" });

        this.validators = validatorsLoader.load();
        this.resourceNodes = resourceMeshLoader.load();
        // this.mongomodels          = mongoLoader.load();

    }

    load() {
        this.managers.responseDispatcher = new ResponseDispatcher();
        this.managers.liveDb = new LiveDB(this.injectable);
        const middlewaresLoader = new MiddlewaresLoader(this.injectable);
        const mwsRepo = middlewaresLoader.load();
        const { layers, actions } = systemArch;
        this.injectable.mwsRepo = mwsRepo;
        /*****************************************CUSTOM MANAGERS*****************************************/
        this.managers.shark = new SharkFin({ ...this.injectable, layers, actions });
        this.managers.timeMachine = new TimeMachine(this.injectable);
        this.managers.token = new TokenManager(this.injectable);
        /*************************************************************************************************/
        this.managers.mwsExec = new VirtualStack({ ...{ preStack: [/* '__token', */'__device',] }, ...this.injectable });
        this.managers.userApi = new ApiHandler({ ...this.injectable, ...{ prop: 'httpExposed' } });
        this.managers.userServer = new UserServer({ config: this.config, managers: this.managers, mwsRepo: mwsRepo });


        return this.managers;

    }

}

