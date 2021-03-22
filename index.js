//inquirer prompts go here
const inquirer = require("inquirer");
const api = require("./db");
const connection = require("./db/connection");
require("console.table");

async function run() {
  let answer = {};
  while (answer.options !== "Exit") {
    answer = await inquirer.prompt([
      {
        type: "list",
        name: "options",
        message: "What would you like to do?",
        choices: [
          "View All Employees",
          "View All Employees By Department",
          "View Employees By Manager",
          "Add Employee",
          "Update Employee Role",
          "Update Employee Manager",
          "Remove Employee",
          "View Existing Roles",
          "Add Role",
          "Update Role",
          "Remove Role",
          "View Existing Departments",
          "Add Department",
          "Remove Department",
          "View Total Utilized Budget by Dept",
          "Exit",
        ],
      },
    ]);

    switch (answer.options) {
      case "View All Employees":
        await api.viewEmployees();
        break;

      case "View All Employees By Department":
        const department = [
          {
            type: "list",
            name: "department_id",
            message: "For which department would you like to view data?",
            choices: await api.getDepartmentChoices(),
          },
        ];
        const byDept = await inquirer.prompt(department);
        await api.viewEmployeesByDept(byDept.department_id);
        break;

      case "View Employees By Manager":
        const manager = [
          {
            type: "list",
            name: "manager_id",
            message: "Which manager's team would you like to view?",
            choices: await api.getEmployeeChoices(),
          },
        ];
        const viewManager = await inquirer.prompt(manager);
        await api.viewEmployeesByManager(viewManager.manager_id);
        break;

      case "Add Employee":
        const employeeInput = [
          {
            type: "list",
            name: "role_id",
            message: "What is this employee's role?",
            choices: await api.getEmployeeRoleChoices(),
          },
          {
            type: "input",
            name: "first_name",
            message: "Enter employee first name:",
            validate: (input) => {
              if (input === "") {
                return "Name cannot be empty";
              }
              return true;
            },
          },
          {
            type: "input",
            name: "last_name",
            message: "Enter employee last name:",
            validate: (input) => {
              if (input === "") {
                return "Name cannot be empty";
              }
              return true;
            },
          },
          {
            type: "list",
            name: "manager_id",
            message: "Who is this employee's manager?",
            choices: await api.getEmployeeChoices(),
          },
        ];
        const data = await inquirer.prompt(employeeInput);
        await api.addEmployee(
          data.first_name,
          data.last_name,
          data.role_id,
          data.manager_id
        );
        break;

      case "Remove Employee":
        const removeEmployee = [
          {
            type: "list",
            name: "id",
            message: "Which employee would you like to remove?",
            choices: await api.getEmployeeChoices(),
          },
        ];
        const data2 = await inquirer.prompt(removeEmployee);
        await api.removeEmployee(data2.id);
        break;

      case "Update Employee Role":
        const updateEmployeeRole = [
          {
            type: "list",
            name: "id",
            message: "Which employee would you like to update?",
            choices: await api.getEmployeeChoices(),
          },
          {
            type: "list",
            name: "role_id",
            message: "What is this employee's new role?",
            choices: await api.getEmployeeRoleChoices(),
          },
        ];
        const newRole = await inquirer.prompt(updateEmployeeRole);
        await api.updateEmployeeRole(newRole.id, newRole.role_id);
        break;

      case "Update Employee Manager":
        const updateEmployeeManager = [
          {
            type: "list",
            name: "id",
            message: "Which employee would you like to update?",
            choices: await api.getEmployeeChoices(),
          },
          {
            type: "list",
            name: "manager_id",
            message: "Who is this employee's new manager?",
            choices: await api.getEmployeeChoices(),
          },
        ];
        const newManager = await inquirer.prompt(updateEmployeeManager);
        await api.updateEmployeeManager(newManager.id, newManager.manager_id);
        break;

      case "View Existing Roles":
        await api.viewRoles();
        break;

      case "Add Role":
        const addRole = [
          {
            type: "input",
            name: "title",
            message: "Enter new role title:",
          },
          {
            type: "input",
            name: "salary",
            message: "Enter new role salary:",
          },
          {
            type: "list",
            name: "dept",
            message: "Select new role's department:",
            choices: await api.getDepartmentChoices(),
          },
        ];
        const addedRole = await inquirer.prompt(addRole);
        await api.addRole(addedRole.title, addedRole.salary, addedRole.dept);
        break;

      case "Update Role":
        const updateRole = [
          {
            type: "list",
            name: "role_id",
            message: "Which role would you like to update?",
            choices: await api.getEmployeeRoleChoices(),
          },
          {
            type: "input",
            name: "title",
            message: "Enter new role title:",
          },
          {
            type: "input",
            name: "salary",
            message: "Enter new role salary:",
          },
          {
            type: "list",
            name: "dept",
            message: "Select new role's department:",
            choices: await api.getDepartmentChoices(),
          },
        ];
        const updatedRole = await inquirer.prompt(updateRole);
        await api.updateRole(
          updatedRole.role_id,
          updatedRole.title,
          updatedRole.salary,
          updatedRole.dept
        );
        break;

      case "Remove Role":
        const removeRole = [
          {
            type: "list",
            name: "role_id",
            message: "Which role would you like to remove?",
            choices: await api.getEmployeeRoleChoices(),
          },
        ];
        const deleteRole = await inquirer.prompt(removeRole);
        await api.removeRole(deleteRole.role_id);
        break;

      case "View Existing Departments":
        await api.viewDepts();
        break;

      case "Add Department":
        const addDept = [
          {
            type: "input",
            name: "name",
            message: "Enter new department name:",
          },
        ];
        const newDept = await inquirer.prompt(addDept);
        await api.addDept(newDept.name);
        break;

      case "Remove Department":
        const removeDept = [
          {
            type: "list",
            name: "department_id",
            message: "Which department would you like to remove?",
            choices: await api.getDepartmentChoices(),
          },
        ];
        const deleteDept = await inquirer.prompt(removeDept);
        await api.removeDept(deleteDept.department_id);
        break;

      case "View Total Utilized Budget by Dept":
        const budgetDept = [
          {
            type: "list",
            name: "department_id",
            message: "For which department would you like to view data?",
            choices: await api.getDepartmentChoices(),
          },
        ];
        const budgetUtililized = await inquirer.prompt(budgetDept);
        await api.budgetUtilization(budgetUtililized.department_id);
        break;
    }
  }
  connection.end();
}

run();
