const chaiHttp = require("chai-http");
const chai = require("chai");
const assert = chai.assert;
const server = require("../server");

chai.use(chaiHttp);

suite("Functional Tests", function () {
	//#1
	test("#return error without required fields", () => {
		chai.request(server)
			.post("/api/issues/testProject")
			.send({
				created_by: "Mocha/Chai",
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
	//#2
	test("#return correct object with all fields", () => {
		chai.request(server)
			.post("/api/issues/testProject")
			.send({
				issue_title: "Chai/Mocha Test",
				issue_text:
					"Functional unit test to see if the correct object is being returned.",
				created_by: "Mocha/Chai",
				assigned_to: "Kamran",
				status_text: "done",
			}) // Provide the desired query parameters
			.end(function (err, res) {
				assert.equal(err, null); // No error should occur
				assert.equal(res.status, 200);
				assert.property(res.body, "assigned_to", "assigned_to missing");
				assert.property(res.body, "status_text", "status_text missing");
				assert.property(res.body, "open", "open missing");
				assert.property(res.body, "_id", "_id missing");
				assert.property(res.body, "issue_title", "issue_title missing");
				assert.property(res.body, "issue_text", "issue_text missing");
				assert.property(res.body, "created_by", "created_by missing");
				assert.property(res.body, "created_on", "created_on missing");
				assert.property(res.body, "updated_on", "updated_on missing");

				assert.isBoolean(res.body.open);
			});
	});
	//#3
	test("#simulate a put request", () => {
		chai.request(server)
			.put("/api/issues/testProject")
			.send({
				issue_title: "Mocha Chai: Put test without id",
			}) // Provide the desired query parameters
			.end(function (err, res) {
				assert.equal(err, null); // No error should occur
				assert.equal(res.status, 200);
				assert.equal(
					res.body.error,
					"missing _id",
					"error message that should have been displayed, did not happen"
				);
			});
	});
});
