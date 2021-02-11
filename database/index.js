
const connection = require('./connection');

class database {
    constructor(connection) {
        this.connection = connection;
    }
    
    viewAllEmployees() {
        return connection.query(`
        SELECT e.employee_id, e.first_name, e.last_name, role.title, department.department_name, role.salary, CONCAT(m.first_name, ' ', m.last_name) manager
        FROM employee m
        RIGHT JOIN employee e ON e.manager_id = m.employee_id
        JOIN role
        ON e.role_id = role.role_id
        JOIN department
        ON department.department_id = role.department_id
        ORDER BY e.employee_id ASC;
        `)
    }

    viewAllEmployeesByDept() {
        return connection.query(`
        SELECT employee.employee_id, employee.first_name, employee.last_name, department.department_name
        FROM employee
        JOIN role
        ON employee.role_id = role.role_id
        JOIN department
        ON department.department_id = role.department_id
        ORDER BY employee.employee_id ASC;
        `)
    }

    viewAllEmployeesByManager() {
        return connection.query(`
        SELECT CONCAT(m.first_name, ' ', m.last_name) manager, CONCAT(e.first_name, ' ', e.last_name) employee, e.employee_id
        FROM employee m
        RIGHT JOIN employee e ON e.manager_id = m.employee_id
        ORDER BY e.employee_id ASC;
        `)
    }

    viewAllDepartments() {
        return connection.query(`
        SELECT department_id, department_name
        FROM department
        ORDER BY department_id;
        `)
    }

    viewAllRoles() {
        return connection.query(`
        SELECT role.role_id, role.title, department.department_name
        FROM role
        JOIN department
        ON role.department_id = department.department_id
        ORDER BY role.role_id ASC;
        `)
    }

    addEmployee(employee) {
        return connection.query(`
        INSERT INTO employee SET ?
        `)
    }

    addRole(role) {
        return connection.query(`
        INSERT INTO role SET ?
        `)
        // Maybe add in a console.log that says that the new role was added in successfully
    }

    addDepartment(department) {
        return connection.query(`
        INSERT INTO department SET ?
        `)
    }

    updateEmployeeRole(employee_id, role_id) {
        return connection.query(`
        UPDATE employee SET ? WHERE ?
        `)
    }

    viewDepartmentSalary(departmentId) {
        return connection.query(`
        SELECT SUM(role.salary)
        FROM role
        WHERE ?
        `)
    }

}

// remove an employee
// remove a department
// remove a role
// Update employee role
// Update employee manager
// View salary total of department

// empID, first name, last name, title, deptName, salary, manager