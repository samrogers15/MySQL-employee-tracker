const util = require('util');
const inquirer = require('inquirer');
const mysql = require('mysql');
const cTable = require('console.table');

const connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: '',
    database: 'employeeTrackerDB',
});

connection.connect((err) => {
    if (err) throw err;
    console.log(`Connected as id ${connection.threadId}`);
    startApp();
});

startApp = () => {
    inquirer.prompt([
        {
            name: 'initialInquiry',
            type: 'list',
            message: 'Welcome to the employee management program. What would you like to do?',
            choices: ['View all departments', 'View all roles', 'View all employees', 'Add a department', 'Add a role', 'Add an employee', 'Update employee roles', 'Exit program']
        }
    ]).then((response) => {
        switch (response.initialInquiry) {
            case 'View all departments':
                viewAllDepartments();    
                break;
            case 'View all roles':
                viewAllRoles();
                break;
            case 'View all employees':
                viewAllEmployees();
                break;
            case 'Add a department':
                addADepartment();
            break;
            case 'Add a role':
                addARole();
            break;
            case 'Add an employee':
                addAnEmployee();
            break;
            case 'Update employee roles':
                updateEmployeeRole();
            break;
            case 'Exit program':
                connection.end();
                console.log('\n You have exited the employee management program \n');
                return;
            default:
                break;
        }
    })
}

viewAllDepartments = () => {
    connection.query(`SELECT * FROM department ORDER BY department_id ASC;`, (err, res) => {
        if (err) throw err;
        console.table('\n', res, '\n');
        startApp();
    })
};

viewAllRoles = () => {
    connection.query(`SELECT role.role_id, role.title, role.salary, department.department_name, department.department_id FROM role JOIN department ON role.department_id = department.department_id ORDER BY role.role_id ASC;`, (err, res) => {
        if (err) throw err;
        console.table('\n', res, '\n');
        startApp();
    })
};

viewAllEmployees = () => {
    connection.query(`SELECT e.employee_id, e.first_name, e.last_name, role.title, department.department_name, role.salary, CONCAT(m.first_name, ' ', m.last_name) manager FROM employee m RIGHT JOIN employee e ON e.manager_id = m.employee_id JOIN role ON e.role_id = role.role_id JOIN department ON department.department_id = role.department_id ORDER BY e.employee_id ASC;`, (err, res) => {
        if (err) throw err;
        console.table('\n', res, '\n');
        startApp();
    })
};

addADepartment = () => {
    inquirer.prompt([
        {
        name: 'newDept',
        type: 'input',
        message: 'What is the name of the department you want to add?'   
        }
    ]).then((response) => {
        connection.query(`INSERT INTO department SET ?`, 
        {
            department_name: response.newDept,
        },
        (err, res) => {
            if (err) throw err;
            console.log(`\n ${res.affectedRows} successfully added to database! \n`);
            startApp();
        })
    })
};

addARole = () => {
    connection.query(`SELECT role.role_id, role.title, role.salary, department.department_name, department.department_id FROM role JOIN department ON role.department_id = department.department_id ORDER BY role.role_id ASC;`, (err, res) => {
        let departments = res.map(department => ({name: department.department_name, value: department.department_id }));
        let uniqueDepartments = [...new Map(departments.map(name => [JSON.stringify(name), name])).values()];
        inquirer.prompt([
            {
            name: 'title',
            type: 'input',
            message: 'What is the name of the role you want to add?'   
            },
            {
            name: 'salary',
            type: 'input',
            message: 'What is the salary of the role you want to add?'   
            },
            {
            name: 'deptName',
            type: 'list',
            message: 'Which department do you want to add the new role to?',
            choices: uniqueDepartments
            },
        ]).then((response) => {
            connection.query(`INSERT INTO role SET ?`, 
            {
                title: response.title,
                salary: response.salary,
                department_id: response.deptName,
            }, 
            (err, res) => {
                if (err) throw err;
                console.log(`\n ${response.title} successfully added to database! \n`);
                startApp();
            })
        })
    })
};

addAnEmployee = () => {
    connection.query(`SELECT e.employee_id, e.first_name, e.last_name, role.role_id, role.title, role.salary, department.department_name, department.department_id, CONCAT(m.first_name, ' ', m.last_name) manager FROM employee m RIGHT JOIN employee e ON e.manager_id = m.employee_id JOIN role ON e.role_id = role.role_id JOIN department ON department.department_id = role.department_id ORDER BY e.employee_id ASC;`, (err, res) => {
        let roles = res.map(role => ({name: role.title, value: role.role_id }));
        let uniqueRoles = [...new Map(roles.map(name => [JSON.stringify(name), name])).values()];
        let departments = res.map(department => ({name: department.department_name, value: department.department_id }));
        let uniqueDepartments = [...new Map(departments.map(name => [JSON.stringify(name), name])).values()];
        let employees = res.map(employee => ({name: employee.first_name + ' ' + employee.last_name, value: employee.employee_id }));
        let uniqueEmployees = [...new Map(employees.map(name => [JSON.stringify(name), name])).values()];
        inquirer.prompt([
            {
                name: 'firstName',
                type: 'input',
                message: 'What is the new employee\'s first name?'
            },
            {
                name: 'lastName',
                type: 'input',
                message: 'What is the new employee\'s last name?'
            },
            {
                name: 'role',
                type: 'list',
                message: 'What is the new employee\'s title?',
                choices: uniqueRoles
            },
            {
                name: 'dept',
                type: 'list',
                message: 'What department is the new employee in?',
                choices: uniqueDepartments
            },
            {
                name: 'salary',
                type: 'number',
                message: 'What is the new employee\'s salary?'
            },
            {
                name: 'manager',
                type: 'list',
                message: 'Who is the new employee\'s manager?',
                choices: employees
            }
        ]).then((response) => {
            connection.query(`INSERT INTO employee SET ?`, 
            {
                first_name: response.firstName,
                last_name: response.lastName,
                role_id: response.role,
                manager_id: response.manager,
            }, 
            (err, res) => {
                if (err) throw err;
            })
            connection.query(`INSERT INTO role SET ?`, 
            {
                department_id: response.dept,
            }, 
            (err, res) => {
                if (err) throw err;
                console.log(`\n ${response.firstName} ${response.lastName} successfully added to database! \n`);
                startApp();
            })
        })
    })
};