"use strict";
const { v4: uuidv4 } = require("uuid");

module.exports = function (app) {
	let container = [
		{
			projectTitle: "testProject",
			issues: [
				{
					assigned_to: "Kamran",
					status_text: "TBD",
					open: true,
					_id: "5871dda29faedc3491ff93bb",
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

			// see if project exists, if not, create new storage
			// TODO: SEE IF YOU CAN MOVE THIS RIGHT AFTER app.route. This should work for all routes then i guess.
			let projectData = findOrCreateData(project);

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
				_id: uuidv4().replace(/-/g, "").substring(0, 24),
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
		})

		.delete(function (req, res) {
			let project = req.params.project;
		});

	function findOrCreateData(project) {
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
