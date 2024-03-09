"use strict";
const { ObjectId } = require("mongodb");

module.exports = function (app) {
	let testIssueID = "621c7832b9e50859a97f1da8";
	let apitestIssueID = "521c7832b9e50859a97f1da8";
	let apitest2IssueID = "421c7832b9e50859a97f1da8";
	let apitest3IssueID = "321c7832b9e50859a97f1da8";
	let apitest4IssueID = "221c7832b9e50859a97f1da8";
	let container = [
		{
			projectTitle: "testProject",
			issues: [
				{
					assigned_to: "Kamran",
					status_text: "TBD",
					open: true,
					_id: testIssueID,
					issue_title: "Test",
					issue_text: "The initial test issue.",
					created_by: "Admin",
					created_on: "2017-01-08T06:35:14.240Z",
					updated_on: "2017-01-08T06:35:14.240Z",
				},
			],
		},
		{
			projectTitle: "apitest",
			issues: [
				{
					assigned_to: "Kamran",
					status_text: "TBD",
					open: true,
					_id: apitestIssueID,
					issue_title: "Apitest proejct",
					issue_text: "Apitest issue.",
					created_by: "Admin",
					created_on: "2017-01-08T06:35:14.240Z",
					updated_on: "2017-01-08T06:35:14.240Z",
				},
				{
					assigned_to: "Cam",
					status_text: "TBD",
					open: true,
					_id: apitest2IssueID,
					issue_title: "2nd Apitest proejct",
					issue_text: "2nd Apitest issue.",
					created_by: "Admin",
					created_on: "2017-01-08T06:35:14.240Z",
					updated_on: "2017-01-08T06:35:14.240Z",
				},
				{
					assigned_to: "Cam",
					status_text: "TBD",
					open: true,
					_id: apitest3IssueID,
					issue_title: "2nd Apitest proejct",
					issue_text: "2nd Apitest issue.",
					created_by: "Admin",
					created_on: "2017-01-08T06:35:14.240Z",
					updated_on: "2017-01-08T06:35:14.240Z",
				},
				{
					assigned_to: "Cam",
					status_text: "TBD",
					open: true,
					_id: apitest4IssueID,
					issue_title: "2nd Apitest proejct",
					issue_text: "2nd Apitest issue.",
					created_by: "Admin",
					created_on: "2017-01-08T06:35:14.240Z",
					updated_on: "2017-01-08T06:35:14.240Z",
				},
			],
		},
	];

	app.route("/api/issues/:project")

		.get(function (req, res) {
			let project = req.params.project;

			// Lets see if there are filters
			let filterObject;
			if (Object.keys(req.query).length > 0) {
				filterObject = req.query;
			}

			// see if project exists, if not, create new storage
			let projectData = findOrCreateData(project, filterObject);
			res.json(projectData);
		})

		.post(function (req, res) {
			let project = req.params.project;

			// see if any required field is missing
			if (
				!req.body.issue_title ||
				!req.body.issue_text ||
				!req.body.created_by
			) {
				return res.json({
					error: "required field(s) missing",
				});
			}

			// see if project exists, if not, create new storage
			let projectData = findOrCreateData(project);

			const currentDate = new Date();
			const currentDateIsoFormat = currentDate.toISOString();
			const newId = new ObjectId();
			let issue = {
				assigned_to: req.body.assigned_to ? req.body.assigned_to : "",
				status_text: req.body.status_text ? req.body.status_text : "",
				open: true,
				_id: newId,
				issue_title: req.body.issue_title,
				issue_text: req.body.issue_text,
				created_by: req.body.created_by,
				created_on: currentDateIsoFormat,
				updated_on: currentDateIsoFormat,
			};
			projectData.push(issue);
			console.log("zeisch mal das issue her diggi");
			console.log(issue);
			res.json(issue);
		})

		.put(function (req, res) {
			//TODO: let putObject = req.body --- and replace all req.body occurences in this function
			let project = req.params.project;
			let projectData = findOrCreateData(project);
			// is an id provided?
			if (!req.body._id) {
				return res.json({ error: "missing _id" });
			}

			// are update fields provided?
			if (req.body._id && Object.keys(req.body).length === 1) {
				return res.json({
					error: "no update field(s) sent",
					_id: req.body._id,
				});
			}

			// try to update, if it doesnt work return this other error
			try {
				// first of all find the object with the id
				let foundObject = projectData.find(
					(object) => object._id === req.body._id
				);
				mergeObjects(foundObject, req.body);
				return res.json({
					result: "successfully updated",
					_id: req.body._id,
				});
			} catch (error) {
				return res.json({
					error: "could not update",
					_id: req.body._id,
				});
			}
		})

		.delete(function (req, res) {
			let project = req.params.project;

			// is an id provided?
			if (!req.body._id) {
				return res.json({ error: "missing _id" });
			}

			try {
				// get project data
				let projectData = findOrCreateData(project);
				// get the issue
				let foundIssueIndex = -1;
				let foundIssue = projectData.find((issue) => {
					foundIssueIndex++;
					return issue._id === req.body._id;
				});
				// delete
				projectData.splice(foundIssueIndex, 1);

				res.json({
					result: "successfully deleted",
					_id: foundIssue._id,
				});
			} catch (error) {
				return res.json({
					error: "could not delete",
					_id: req.body._id,
				});
			}
		});

	function findOrCreateData(project, filterObject) {
		let projectData;
		// see if this project already exists
		let found = false;
		for (let i = 0; i < container.length; i++) {
			const element = container[i];
			if (element.projectTitle === project) {
				projectData = element;
				found = true;
			}
		}

		//if a project already exists, and filter(s) are sent, apply them
		if (found === true && filterObject) {
			const filteredProjectData = projectData.issues.filter((item) => {
				return Object.keys(filterObject).every(
					(key) => item[key] === filterObject[key]
				);
			});
			return filteredProjectData;
		}

		// if its a new project, create the data structure
		if (!found) {
			projectData = {
				projectTitle: project,
				issues: [],
			};
			container.push(projectData);
		}
		return projectData.issues;
	}

	function mergeObjects(fullObject, subsetObject) {
		for (const key in subsetObject) {
			if (subsetObject.hasOwnProperty(key)) {
				fullObject[key] = subsetObject[key];
			}
		}
		const currentDate = new Date();
		fullObject.created_on = currentDate.toISOString();
	}
};
