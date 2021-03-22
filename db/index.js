//SQL queries go here
const connection = require("./connection");
require("console.table");

module.exports = {
  async viewEmployees() {
    const response = await connection.query(
      `SELECT
      employee.id as "ID#",
      employee.first_name as "First Name",
      employee.last_name as "Last Name",
      role.title as "Title",
      department.name AS "Department",
      role.salary as "Salary",
      CONCAT(manager_employee.first_name, " ", manager_employee.last_name) as "Manager"
      
      FROM employee
      LEFT JOIN role on employee.role_id = role.id
      LEFT JOIN department ON role.department_id = department.id
      LEFT JOIN employee AS manager_employee ON employee.manager_id = manager_employee.id`
    );
    console.table(response);
  },

  async viewEmployeesByDept(id) {
    const response = await connection.query(
      `SELECT
    employee.id as "ID#",
    employee.first_name as "First Name",
    employee.last_name as "Last Name",
    role.title as "Title",
    department.name AS "Department",
    role.salary as "Salary",
    CONCAT(manager_employee.first_name, " ", manager_employee.last_name) as "Manager"
    FROM employee
    LEFT JOIN role on employee.role_id = role.id
    LEFT JOIN department ON role.department_id = department.id
    LEFT JOIN employee AS manager_employee ON employee.manager_id = manager_employee.id
    WHERE department.id = ${id}`
    );
    console.table(response);
  },

  async viewEmployeesByManager(id) {
    const response = await connection.query(
      `SELECT
      employee.id as "ID#",
      employee.first_name as "First Name",
      employee.last_name as "Last Name",
      role.title as "Title",
      department.name AS "Department",
      role.salary as "Salary",
      CONCAT(manager_employee.first_name, " ", manager_employee.last_name) as "Manager"
      
      FROM employee
      LEFT JOIN role on employee.role_id = role.id
      LEFT JOIN department ON role.department_id = department.id
      LEFT JOIN employee AS manager_employee ON employee.manager_id = manager_employee.id
      
      WHERE employee.manager_id = ${id}`
    );
    console.table(response);
  },

  async addEmployee(first_name, last_name, role, manager_id) {
    const sql = `INSERT INTO employee(first_name, last_name, role_id, manager_id) 
    VALUES('${first_name}', '${last_name}', ${role}, ${manager_id})`;

    const response = await connection.query(sql);
    console.log("Employee successfully added");
  },

  async removeEmployee(id) {
    const response = await connection.query(
      `DELETE FROM employee WHERE employee.id = ${id}`
    );
    console.log("Employee successfully removed");
  },

  async updateEmployeeRole(id, role_id) {
    const response = await connection.query(
      `UPDATE employee SET role_id = ${role_id} WHERE id = ${id}`
    );
  },

  async updateEmployeeManager(id, manager_id) {
    const response = await connection.query(
      `UPDATE employee SET manager_id = ${manager_id} WHERE id = ${id}`
    );
  },

  async viewRoles() {
    const response = await connection.query(
      `SELECT
        title as "Title",
        department.name AS "Department",
        salary as "Salary"
                
        FROM role
        LEFT JOIN department ON role.department_id = department.id`
    );
    console.table(response);
  },

  async addRole(title, salary, dept) {
    const response = await connection.query(
      `INSERT INTO role (title, salary, department_id) VALUES('${title}', '${salary}', '${dept}')`
    );
    console.log("Role successfully added");
  },

  async updateRole(id, title, salary, department_id) {
    const sql = `UPDATE role 
    SET 
      title = '${title}',
      salary = ${salary},
      department_id = '${department_id}'
    WHERE id = ${id}`;
    const response = await connection.query(sql);
  },

  async removeRole(id) {
    //checks if role is currently assigned to any existing employees
    const roleExists = await connection.query(
      `SELECT count(*) AS employeesInTheRole FROM employee WHERE role_id = '${id}'`
    );
    //if 1 or more employees are currently assigned to this role, deletion is not available
    if (roleExists[0].employeesInTheRole > 0) {
      console.log(
        "1 or more employees are assigned this role. Please reassign employees and try again."
      );
      return;
    }
    //if 0 employees are assigned this role, role is deleted
    const sql = `DELETE FROM role WHERE id = ${id}`;
    const response = await connection.query(sql);
  },

  async viewDepts() {
    const response = await connection.query(`SELECT * FROM department`);

    console.table(response);
  },

  async addDept(name) {
    const response = await connection.query(
      `INSERT INTO department (name) VALUES('${name}')`
    );
  },

  async removeDept(id) {
    //checks if dept is currently assigned to any existing employees
    const deptExists = await connection.query(
      `SELECT count(*) AS rolesInTheDept FROM role WHERE department_id = '${id}'`
    );
    //if 1 or more roles currently exist in this dept, deletion is not available
    if (deptExists[0].rolesInTheDept > 0) {
      console.log(
        "Department cannot be deleted. 1 or more roles exist in this department."
      );
      return;
    }

    const response = await connection.query(
      `DELETE FROM department WHERE id = ${id}`
    );
    console.log("Department deleted.");
  },

  async budgetUtilization(id) {
    const response = await connection.query(
      `SELECT sum(role.salary) AS "Total Budget Utilization"
      FROM department
      LEFT JOIN role on role.department_id = department.id
      LEFT JOIN employee ON employee.role_id = role.id
      
      WHERE department.id = ${id}`
    );
    console.table(response);
  },

  async getEmployeeRoleChoices() {
    const response = await connection.query(
      `SELECT id AS value, title AS name FROM role`
    );
    return response;
  },

  async getEmployeeChoices() {
    const response = await connection.query(
      `SELECT id AS value, CONCAT(employee.first_name, " ", employee.last_name) AS name FROM employee`
    );
    return response;
  },

  async getDepartmentChoices() {
    const response = await connection.query(
      `SELECT id AS value, name FROM department`
    );
    return response;
  },
};
