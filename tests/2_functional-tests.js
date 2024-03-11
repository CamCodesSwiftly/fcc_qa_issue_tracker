const chaiHttp = require("chai-http");
const chai = require("chai");
const assert = chai.assert;
const server = require("../server");

chai.use(chaiHttp);

suite("Functional Tests", function () {
	//#1
	test("#POST create an issue with every field", () => {
		chai.request(server)
			.post("/api/issues/mochaTesting")
			.send({
				issue_title: "#1 Mocha test",
				issue_text: "#POST create an issue with every field",
				created_by: "Kamran",
				assigned_to: "Chai and Mocha",
				status_text: "to be done",
			}) // Provide the desired query parameters
			.end(function (err, res) {
				assert.equal(err, null); // No error should occur
				assert.equal(res.status, 200);
				// Check for existence of all fields
				assert.property(
					res.body,
					"assigned_to",
					"assigned_to does not exist"
				);
				assert.property(
					res.body,
					"status_text",
					"status_text does not exist"
				);
				assert.property(res.body, "open", "open does not exist");
				assert.property(res.body, "_id", "_id does not exist");
				assert.property(
					res.body,
					"issue_title",
					"issue_title does not exist"
				);
				assert.property(
					res.body,
					"issue_text",
					"issue_text does not exist"
				);
				assert.property(
					res.body,
					"created_by",
					"created_by does not exist"
				);
				assert.property(
					res.body,
					"created_on",
					"created_on does not exist"
				);
				assert.property(
					res.body,
					"updated_on",
					"updated_on does not exist"
				);
			});
	});
	//#2
	test("#POST create an issue with only required field", () => {
		chai.request(server)
			.post("/api/issues/mochaTesting")
			.send({
				issue_title: "#2 Mocha test",
				issue_text: "#POST create an issue with only required field",
				created_by: "Kamran",
			}) // Provide the desired query parameters
			.end(function (err, res) {
				assert.equal(err, null); // No error should occur
				assert.equal(res.status, 200);
				// Check for existence of all fields
				assert.property(
					res.body,
					"assigned_to",
					"assigned_to does not exist"
				);
				assert.property(
					res.body,
					"status_text",
					"status_text does not exist"
				);
				assert.property(res.body, "open", "open does not exist");
				assert.property(res.body, "_id", "_id does not exist");
				assert.property(
					res.body,
					"issue_title",
					"issue_title does not exist"
				);
				assert.property(
					res.body,
					"issue_text",
					"issue_text does not exist"
				);
				assert.property(
					res.body,
					"created_by",
					"created_by does not exist"
				);
				assert.property(
					res.body,
					"created_on",
					"created_on does not exist"
				);
				assert.property(
					res.body,
					"updated_on",
					"updated_on does not exist"
				);
			});
	});
	//#3
	test("#POST create an issue with missing field(s)", () => {
		chai.request(server)
			.post("/api/issues/mochaTesting")
			.send({
				issue_title: "#3 Mocha test",
				issue_text: "#POST create an issue with missing field(s)",
			}) // Provide the desired query parameters
			.end(function (err, res) {
				assert.equal(err, null); // No error should occur
				assert.equal(res.status, 200);
				// Check for existence of all fields
				assert.equal(
					res.body.error,
					"required field(s) missing",
					"Error message was not sent"
				);
			});
	});
	//#4
	test("#GET array for all issues of projectX with all fields present", () => {
		chai.request(server)
			.get("/api/issues/apitest")
			// Provide the desired query parameters
			.end(function (err, res) {
				assert.equal(err, null); // No error should occur
				assert.equal(res.status, 200);
				// Check if response is an array
				assert.isArray(res.body, "no array was returned");
				// check if all issues have all fields
				res.body.forEach((element) => {
					assert.property(
						element,
						"assigned_to",
						"assigned_to does not exist"
					);
					assert.property(
						element,
						"status_text",
						"status_text does not exist"
					);
					assert.property(element, "open", "open does not exist");
					assert.property(element, "_id", "_id does not exist");
					assert.property(
						element,
						"issue_title",
						"issue_title does not exist"
					);
					assert.property(
						element,
						"issue_text",
						"issue_text does not exist"
					);
					assert.property(
						element,
						"created_by",
						"created_by does not exist"
					);
					assert.property(
						element,
						"created_on",
						"created_on does not exist"
					);
					assert.property(
						element,
						"updated_on",
						"updated_on does not exist"
					);
				});
			});
	});
	//#5
	test("#GET view issues on project with one filter", () => {
		chai.request(server)
			.get("/api/issues/apitest?open=false")
			// Provide the desired query parameters
			.end(function (err, res) {
				assert.equal(err, null); // No error should occur
				assert.equal(res.status, 200);
				// Check if response is an array
				assert.isArray(res.body, "no array was returned");
				// check if the only object with open=false is present
				assert.equal(
					res.body[0].open,
					false,
					"filtering failed - only object with open=false is not present"
				);
			});
	});
	//#6
	test("#GET view issues on project with multiple filters", () => {
		chai.request(server)
			.get("/api/issues/apitest?open=true&status_text=TBD2")
			// Provide the desired query parameters
			.end(function (err, res) {
				assert.equal(err, null); // No error should occur
				assert.equal(res.status, 200);
				// Check if response is an array
				assert.isArray(res.body, "no array was returned");
				// check if the only object with open=false is present
				assert.equal(
					res.body.length,
					2,
					"test should have found an array with 2 objects"
				);
				assert.equal(
					res.body[0].issue_title,
					"Mocha",
					"first returned object should have an issue_title of Mocha"
				);
				assert.equal(
					res.body[1].issue_text,
					"2nd Apitest issue.",
					"second returned object should have an issue_text of 2nd Apitest issue."
				);
			});
	});
	//#7
	test("#PUT update one field on an issue", () => {
		chai.request(server)
			.put("/api/issues/apitest")
			.send({
				_id: "221c7832b9e50859a97f1da8",
				open: "true",
			})
			// Provide the desired query parameters
			.end(function (err, res) {
				console.log(res.body);
				assert.equal(err, null); // No error should occur
				assert.equal(res.status, 200);
				// check for existence of both fields
				assert.property(
					res.body,
					"result",
					"result field should exist in response"
				);
				assert.property(
					res.body,
					"_id",
					"id field should exist in response"
				);
				// check for success message, and sent ID
				assert.equal(
					res.body.result,
					"successfully updated",
					"should have returned success message"
				);
				assert.equal(
					res.body._id,
					"221c7832b9e50859a97f1da8",
					"should have returned the correct id"
				);
			});
	});
	//#8
	test("#PUT update multiple fields on an issue", () => {
		chai.request(server)
			.put("/api/issues/apitest")
			.send({
				_id: "521c7832b9e50859a97f1da8",
				status_text: "PUT changed 4 fields by Mocha/Chai",
				assigned_to: "Kamran",
				issue_text: "successfully changed 4 fields",
				open: "false",
			})
			// Provide the desired query parameters
			.end(function (err, res) {
				console.log(res.body);
				assert.equal(err, null); // No error should occur
				assert.equal(res.status, 200);
				// check for existence of both fields
				assert.property(
					res.body,
					"result",
					"result field should exist in response"
				);
				assert.property(
					res.body,
					"_id",
					"id field should exist in response"
				);
				// check for success message, and sent ID
				assert.equal(
					res.body.result,
					"successfully updated",
					"should have returned success message"
				);
				assert.equal(
					res.body._id,
					"521c7832b9e50859a97f1da8",
					"should have returned the correct id"
				);
			});
	});
	//#9
	test("#PUT update with missing id", () => {
		chai.request(server)
			.put("/api/issues/apitest")
			.send({
				status_text: "PUT changed 3 fields by Mocha/Chai",
				assigned_to: "Kamran",
				issue_text: "successfully changed 3 fields",
			})
			// Provide the desired query parameters
			.end(function (err, res) {
				assert.equal(res.status, 200);
				// see if the correct error is returned
				assert.equal(
					res.body.error,
					"missing _id",
					"error message: missing _id should be returned"
				);
			});
	});
	//#10
	test("#PUT update with no fields to update", () => {
		chai.request(server)
			.put("/api/issues/apitest")
			.send({
				_id: "221c7832b9e50859a97f1da8",
			})
			// Provide the desired query parameters
			.end(function (err, res) {
				assert.equal(res.status, 200);
				// see if the correct error is returned
				assert.equal(
					res.body.error,
					"no update field(s) sent",
					"error message: no update field(s) sent should be returned"
				);
			});
	});
	//#11a
	test("#PUT update with invalid id and update fields", () => {
		chai.request(server)
			.put("/api/issues/apitest")
			.send({
				_id: "123shgaq235rawdsg",
				issue_title: "i am sending an invalid id",
				issue_text: "should return an error",
			})
			// Provide the desired query parameters
			.end(function (err, res) {
				assert.equal(err, null); // No error should occur
				assert.equal(res.status, 200);
				// see if the correct error is returned
				assert.equal(
					res.body.error,
					"could not update",
					"error message: could not update sent should be returned"
				);
			});
	});
	//#12
	test("#DELETE an issue correctly", () => {
		chai.request(server)
			.delete("/api/issues/apitest")
			.send({
				_id: "321c7832b9e50859a97f1da8",
			})
			// Provide the desired query parameters
			.end(function (err, res) {
				assert.equal(err, null); // No error should occur
				assert.equal(res.status, 200);
				// see if the correct error is returned
				assert.equal(
					res.body.result,
					"successfully deleted",
					"success message should have been sent"
				);
				assert.equal(
					res.body._id,
					"321c7832b9e50859a97f1da8",
					"id should be returned"
				);
			});
	});
	//#13
	test("#DELETE an issue with an invalid id", () => {
		chai.request(server)
			.delete("/api/issues/apitest")
			.send({
				_id: "aw241241254rsfadgheg",
			})
			// Provide the desired query parameters
			.end(function (err, res) {
				assert.equal(err, null); // No error should occur
				assert.equal(res.status, 200);
				// see if the correct error is returned
				assert.equal(
					res.body.error,
					"could not delete",
					"error message: could not delete should have been sent"
				);
				assert.equal(
					res.body._id,
					"aw241241254rsfadgheg",
					"incorrect id should have been returned"
				);
			});
	});
	//#14
	test("#DELETE an issue with no id at all", () => {
		chai.request(server)
			.delete("/api/issues/apitest")
			.send("")
			// Provide the desired query parameters
			.end(function (err, res) {
				assert.equal(res.status, 200);
				// see if the correct error is returned
				assert.equal(
					res.body.error,
					"missing _id",
					"error message: missing _id should have been sent"
				);
			});
	});

	//#11b
	test("#PUT update with invalid id and no update fields", () => {
		chai.request(server)
			.put("/api/issues/apitest")
			.send({
				_id: "123shgaq235rawdsg",
			})
			// Provide the desired query parameters
			.end(function (err, res) {
				assert.equal(err, null); // No error should occur
				assert.equal(res.status, 200);
				// see if the correct error is returned
				assert.equal(
					res.body.error,
					"no update field(s) sent",
					"error message: could not update sent should be returned"
				);
			});
	});
});
