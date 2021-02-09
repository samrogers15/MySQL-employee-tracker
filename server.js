const inquirer = require('inquirer');
const mysql = require('mysql');
const cTable = require('console.table');

const connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'Frank480%',
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
            type: 'rawlist',
            message: 'What would you like to do?',
            choices: ['View all employees', 'View all employees by department', 'View all employees by manager', 'View all departments', 'View all roles', 'Add an employee', 'Add a role', 'Add a department', 'Remove an employee', 'Remove a department', 'Remove a role', 'Update employee role', 'Update employee manager', 'View salary total of department']
        }
    ]).then((answer) => {
        switch (answer.initialInquiry) {
            case 'View all employees':
                viewEmployees();
                break;
            case 'View all employees by department':
                viewEmployeesDept();
                break;
            case 'View all employees by manager':
                viewEmployeesManager();
                break;
            case 'View all departments':
                viewDepartments();
                break;
            case 'View all roles':
                viewRoles();
                break;
            case 'Add an employee':
                addEmployee();
                break;
            case 'Add a role':
                addRole();
                break;
            case 'Add a department':
                addDept();
                break;
            case 'Remove an employee':
                removeEmployee();
                break;
            case 'Remove a department':
                removeDept();
                break;
            case 'Remove a role':
                removeRole();
                break;
            case 'Update employee role':
                updateRole();
                break;
            case 'Update employee manager':
                updateManager();
                break;
            case 'View salary total of department':
                viewSalaryTotal();
                break;
            default:
                console.log(`Invalid action: ${answer.initialInquiry}`);
                break;   
        }
    })
};

// view all employees 
// view all employees by dept
// view all employees by manager
// view all departments
// view all roles
// add an employee
// add a role
// add a dept
// remove an employee
// remove a department
// remove a role
// Update employee role
// Update employee manager
// View salary total of department
