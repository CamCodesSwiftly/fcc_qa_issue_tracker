"use strict";
const { ObjectId } = require("mongodb");

module.exports = function (app) {
	let testIssueID = "621c7832b9e50859a97f1da8";
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
			// TODO: SEE IF YOU CAN MOVE THIS RIGHT AFTER app.route. This should work for all routes then i guess.
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
			// TODO: SEE IF YOU CAN MOVE THIS RIGHT AFTER app.route. This should work for all routes then i guess.
			let projectData = findOrCreateData(project);

			// TODO: CREATE ISSUE AND SAVE IT
			const currentDate = new Date();
			const currentDateIsoFormat = currentDate.toISOString();
			let issue = {
				assigned_to: req.body.assigned_to,
				status_text: req.body.status_text,
				open: true,
				_id: new ObjectId(),
				issue_title: req.body.issue_title,
				issue_text: req.body.issue_text,
				created_by: req.body.created_by,
				created_on: currentDateIsoFormat,
				updated_on: currentDateIsoFormat,
			};
			projectData.push(issue);
			res.json(issue);
		})

		.put(function (req, res) {
			let project = req.params.project;
			let projectData = findOrCreateData(project);
			// is an id provided?
			if (!req.body._id) {
				return res.json({ error: "missing _id" });
			}
		})

		.delete(function (req, res) {
			let project = req.params.project;
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
};
