const chaiHttp = require("chai-http");
const chai = require("chai");
const assert = chai.assert;
const server = require("../server");

chai.use(chaiHttp);

suite("Functional Tests", function () {
	//#1
	test("#test to test some tests", () => {
		chai.request(server)
			.post("/api/issues/testProject")
			.send({
				created_by: "Kamran",
			}) // Provide the desired query parameters
			.end(function (err, res) {
				assert.equal(err, null); // No error should occur
				assert.equal(res.status, 200);
				assert.equal(
					res.body.error,
					"required field(s) missing",
					"error did not occur"
				);
			});
	});
});
