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
					status_text: "TBD2",
					open: true,
					_id: apitest2IssueID,
					issue_title: "Mocha",
					issue_text: "2nd Apitest issue.",
					created_by: "Admin",
					created_on: "2017-01-08T06:35:14.240Z",
					updated_on: "2017-01-08T06:35:14.240Z",
				},
				{
					assigned_to: "Cam",
					status_text: "TBD2",
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
					open: false,
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

			if (filterObject && filterObject.open !== undefined) {
				filterObject.open =
					filterObject.open === "true"
						? true
						: filterObject.open === "false"
						? false
						: undefined;
			}

			// see if project exists, if not, create new storage
			let projectData = findOrCreateData(project, filterObject);
			res.json(projectData);
		})

		.post(function (req, res) {
			let project = req.params.project;
			let newIssue = req.body;
			// see if any required field is missing
			if (
				!newIssue.issue_title ||
				!newIssue.issue_text ||
				!newIssue.created_by
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
				assigned_to: newIssue.assigned_to ? newIssue.assigned_to : "",
				status_text: newIssue.status_text ? newIssue.status_text : "",
				open: true,
				_id: newId,
				issue_title: newIssue.issue_title,
				issue_text: newIssue.issue_text,
				created_by: newIssue.created_by,
				created_on: currentDateIsoFormat,
				updated_on: currentDateIsoFormat,
			};
			projectData.push(issue);
			res.json(issue);
		})

		.put(function (req, res) {
			let project = req.params.project;
			let putObject = req.body;
			let projectData = findOrCreateData(project);
			// FIRST: is an id provided?
			if (!putObject._id) {
				return res.status(500).json({ error: "missing _id" });
			}
			// SECOND: wrong id?
			let foundIssue = projectData.find(
				(object) => object._id === putObject._id
			);
			if (typeof foundIssue === "undefined" || !foundIssue) {
				return res.status(500).json({
					error: "could not update",
					_id: req.body._id,
				});
			}

			// THIRD: update fields present?
			console.log(Object.keys(putObject).length);
			if (putObject._id && Object.keys(putObject).length === 1) {
				return res.status(500).json({
					error: "no update field(s) sent",
					_id: req.body._id,
				});
			}

			// try to update, if it doesnt work return this other error
			try {
				// update
				mergeObjects(foundIssue, putObject);

				return res.json({
					result: "successfully updated",
					_id: req.body._id,
				});
			} catch (error) {
				console.log("what the fuck is going on here?");
				return res.status(500).json({
					error: "could not update",
					_id: req.body_id,
				});
			}
		})

		.delete(function (req, res) {
			let project = req.params.project;
			let idToDelete = req.body._id;
			// is an id provided?
			if (!idToDelete) {
				return res.status(500).json({ error: "missing _id" });
			}

			try {
				// get project data
				let projectData = findOrCreateData(project);
				// get the issue
				let foundIssueIndex = -1;
				let foundIssue = projectData.find((issue) => {
					foundIssueIndex++;
					return issue._id === idToDelete;
				});

				//if the id was incorrect and foundIssue is undefined consequently, quit with an error
				if (typeof foundIssue === undefined || !foundIssue) {
					return res.status(500).json({
						error: "could not delete",
						_id: idToDelete,
					});
				}

				// delete
				projectData.splice(foundIssueIndex, 1);

				res.json({
					result: "successfully deleted",
					_id: foundIssue._id,
				});
			} catch (error) {
				return res.status(500).json({
					error: "could not delete",
					_id: idToDelete,
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

	// function mergeObjects(fullObject, subsetObject) {
	// 	for (const key in subsetObject) {
	// 		if (subsetObject.hasOwnProperty(key)) {
	// 			fullObject[key] = subsetObject[key];
	// 		}
	// 	}
	// 	const currentDate = new Date();
	// 	fullObject.updated_on = currentDate.toISOString();
	// }
	function mergeObjects(fullObject, subsetObject) {
		for (const key in subsetObject) {
			if (subsetObject.hasOwnProperty(key) && subsetObject[key] !== "") {
				fullObject[key] = subsetObject[key];
			}
		}
		const currentDate = new Date();
		fullObject.updated_on = currentDate.toISOString();
	}
};
