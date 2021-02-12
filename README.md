# MySQL-employee-tracker
> This is a command line application that allows a user to manage information on employees within a company. The application connects to a database housed in MySQL that contains three tables with information on departments, roles, and employees within the company. This Content Management System allows a user to add, view, and modify information about employees of a company.
 
## Table of contents
* [User Story](#user-story)
* [General Info](#general-info)
* [Technologies](#technologies)
* [Video Example](#video-example)
* [Code Snippet](#code-snippet)
* [Sources](#sources)
* [Contact](#contact)

## User Story
As a business owner
I want to be able to view and manage the departments, roles, and employees in my company
So that I can organize and plan my business

## General Info
The database was initialized in MySQL Workbench after the schema files were set up (schema files included in repository). Data for employees was then seeded into the database after initialization. Upon running the program via the command line interface, a user can select to view all departments, view all roles, view all employees, add a department, add a role, add an employee, and update an employee's current role. After executing any of the add or update functions, the database is updated automatically.

## Technologies
* Javascript
* Node
* NPM Inquirer
* NPM MySQL
* NPM console.table
* MySQL
* MySQL Workbench

## Video Example
[MySQL Employee Management System]()

## Code Snippets

The below example code shows a function that queries the MySQL database and returns information on all employees when invoked:
```js
viewAllDepartments = () => {
    connection.query(`SELECT * FROM department ORDER BY department_id ASC;`, (err, res) => {
        if (err) throw err;
        console.table('\n', res, '\n');
        startApp();
    })
};
```

The below example code shows a function that allows a user to add a role into the MySQL database when invoked:
```js
addARole = () => {
    connection.query(`SELECT * FROM department;`, (err, res) => {
        let departments = res.map(department => ({name: department.department_name, value: department.department_id }));
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
            type: 'rawlist',
            message: 'Which department do you want to add the new role to?',
            choices: departments
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
```

## Sources
Application enabled using the following sources:

* [NPM Inquirer](https://github.com/SBoudrias/Inquirer.js/)
* [NPM MySQL](https://www.npmjs.com/package/mysql)
* [NPM console.table](https://www.npmjs.com/package/console.table)

## Contact
Created by Sam Rogers - feel free to contact me to collaborate on this project or any other project!

[LinkedIn](https://www.linkedin.com/in/samuelerogers/)

[Portfolio](https://samrogers15.github.io/Current_Portfolio/index.html)