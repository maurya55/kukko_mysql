let chai = require('chai');
let chaiHttp = require("chai-http");
let server = require("../server/router/index");
const expect = chai.expect;
require("dotenv").config();

chai.should();
chai.use(chaiHttp);

describe("My first test case", () => {


    before(async () => {
        console.log("run before exicute22");
        await chai.request(`http://localhost:4400/mob/v1/`)
        .post('login')
        .send({
            "email": process.env.LOGIN_USERNAME,
            "password":process.env.LOGIN_PASSWORD,
        })
        .then((response) => {
            console.log(response.body);
        });
    })
    // Test get api

    describe('check login describe', () => {
        it('check for login', function (done) {
    
            done();
    })
    })
   


})

