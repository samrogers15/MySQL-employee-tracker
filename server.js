const inquirer = require('inquirer');
const mysql = require('mysql');
const cTable = require('console.table');
let programIsRunning = true;

/*
  Since you have a lot of options, it'd be easier to manage them via object lookup
  rather than a large, unwieldy switch statement. Another advantage of this is you
  then only have to write the action names in a single place rather than duplicate it
  in the `choices` array in your `startApp` function
*/
const actions = {
  "View all departments": viewAllDepartments,
  "View all roles": viewAllRoles,
  "View all employees": viewAllEmployees,
  "Add a department": addADepartment,
  "Add a role": addARole,
  "Add an employee": addAnEmployee,
  "Update employee roles": updateEmployeeRoles,
  "Exit program": exitProgram,
};

const connection = mysql.createConnection({
  host: 'localhost',
  port: 3306,
  user: 'root',
  password: '',
  database: 'employeeTrackerDB',
});

connection.connect((err) => {
  if (err) throw err;
  console.log(`Connected as id ${connection.threadId} \n`);
  startApp();
});

function startApp() {
  inquirer.prompt([
    {
      name: 'initialInquiry',
      type: 'rawlist',
      message: 'Welcome to the employee management program. What would you like to do?',
      choices: Object.keys(actions)
    }
  ]).then((response) => {
    const actionToExecute = actions[actionName];
    if (actionToExecute) {
      actionToExecute();
    }

    if (!programIsRunning) {
      return;
    }
  })
}

function viewAllDepartments() {
  connection.query(`SELECT * FROM department ORDER BY department_id ASC;`)
    .then(res => {
      console.table('\n', res, '\n');
      startApp();
    })
    .catch(err => {
      throw err;
    });
};

function viewAllRoles() {
  connection.query(`SELECT role.role_id, role.title, role.salary, department.department_name, department.department_id FROM role JOIN department ON role.department_id = department.department_id ORDER BY role.role_id ASC;`, (err, res) => {
    if (err) throw err;
    console.table('\n', res, '\n');
    startApp();
  })
};

function viewAllEmployees() {
  connection.query(`SELECT e.employee_id, e.first_name, e.last_name, role.title, department.department_name, role.salary, CONCAT(m.first_name, ' ', m.last_name) manager FROM employee m RIGHT JOIN employee e ON e.manager_id = m.employee_id JOIN role ON e.role_id = role.role_id JOIN department ON department.department_id = role.department_id ORDER BY e.employee_id ASC;`, (err, res) => {
    if (err) throw err;
    console.table('\n', res, '\n');
    startApp();
  })
};

function addADepartment() {
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
        console.log(`\n ${response.newDept} successfully added to database! \n`);
        startApp();
      })
  })
};

function addARole() {
  connection.query(`SELECT * FROM department;`, (err, res) => {
    let departments = res.map(department => ({ name: department.department_name, value: department.department_id }));
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

function addAnEmployee() {
  connection.query(`SELECT * FROM role;`, (err, res) => {
    if (err) throw err;
    let roles = res.map(role => ({ name: role.title, value: role.role_id }));
    connection.query(`SELECT * FROM department;`, (err, res) => {
      if (err) throw err;
      let departments = res.map(department => ({ name: department.department_name, value: department.department_id }));
      connection.query(`SELECT * FROM employee;`, (err, res) => {
        if (err) throw err;
        let employees = res.map(employee => ({ name: employee.first_name + ' ' + employee.last_name, value: employee.employee_id }));
        inquirer.prompt([
          /*
            Regardless of your preference of single vs. double quotes in JS, there's no rule
            that says you can't use both. Even if you prefer single quotes, I would still recommend
            using double in cases like this where you'd otherwise have to escape characters. IMO, it's
            easier to read.
          */
          createPrompt('firstName', 'input', "What is the new employee's first name?"),
          createPrompt('lastName', 'input', "What is the employee's last name?"),
          createPrompt('role', 'rawlist', "What is the employee's title?", roles),
          createPrompt('dept', 'rawlist', 'What department is the new employee in?', departments),
          createPrompt('salary', 'number', "What is the new employee's salary?"),
          createPrompt('manager', 'rawlist', "Who is the new employee's manager?", employees)
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
    })
  })
};

function updateEmployeeRoles() {
  connection.query(`SELECT * FROM role;`, (err, res) => {
    if (err) throw err;
    let roles = res.map(role => ({ name: role.title, value: role.role_id }));
    connection.query(`SELECT * FROM employee;`, (err, res) => {
      if (err) throw err;
      let employees = res.map(employee => ({ name: employee.first_name + ' ' + employee.last_name, value: employee.employee_id }));
      inquirer.prompt([
        {
          name: 'employee',
          type: 'rawlist',
          message: 'Which employee would you like to update the role for?',
          choices: employees
        },
        {
          name: 'newRole',
          type: 'rawlist',
          message: 'What should the employee\'s new role be?',
          choices: roles
        },
      ]).then((response) => {
        connection.query(`UPDATE employee SET ? WHERE ?`,
          [
            {
              role_id: response.newRole,
            },
            {
              employee_id: response.employee,
            },
          ],
          (err, res) => {
            if (err) throw err;
            console.log(`\n Successfully updated employee role in the database! \n`);
            startApp();
          })
      })
    })
  })
}

function exitProgram() {
  connection.end();
  console.log('\n You have exited the employee management program. Thanks for using! \n');
  programIsRunning = false;
}

function createPrompt(name, type, message, choices) {
  const prompt = { name, type, message };
  if (choices) {
    prompt.choices = choices;
  }
  return prompt;
}