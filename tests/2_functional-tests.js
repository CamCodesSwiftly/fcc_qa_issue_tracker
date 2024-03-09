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
	test("#simulate put request without id", () => {
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
	//#4
	test("#simulate put request with id but without update fields", () => {
		chai.request(server)
			.put("/api/issues/testProject")
			.send({
				_id: "621c7832b9e50859a97f1da8",
			}) // Provide the desired query parameters
			.end(function (err, res) {
				assert.equal(err, null); // No error should occur
				assert.equal(res.status, 200);
				assert.equal(
					res.body.error,
					"no update field(s) sent",
					"error message that should have been displayed, did not happen"
				);
				assert.equal(
					res.body._id,
					"621c7832b9e50859a97f1da8",
					"returning the id did not work"
				);
			});
	});
	//#5
	test("#simulate a valid put request", () => {
		chai.request(server)
			.put("/api/issues/testProject")
			.send({
				_id: "621c7832b9e50859a97f1da8",
				open: false,
			}) // Provide the desired query parameters
			.end(function (err, res) {
				assert.equal(err, null); // No error should occur
				assert.equal(res.status, 200);
				// now assertions can be made
				assert.equal(
					res.body._id,
					"621c7832b9e50859a97f1da8",
					"incorrect id was returned"
				);
				assert.equal(
					res.body.result,
					"successfully updated",
					"incorrect result was returned"
				);
			});
	});
	//#6
	test("#simulate delete request without id", () => {
		chai.request(server)
			.delete("/api/issues/apitest")
			.send("") // Provide the desired query parameters
			.end(function (err, res) {
				assert.equal(err, null); // No error should occur
				assert.equal(res.status, 200);
				// now assertions can be made
				assert.equal(
					res.body.error,
					"missing _id",
					"error message that should have been displayed, did not happen"
				);
			});
	});
});
