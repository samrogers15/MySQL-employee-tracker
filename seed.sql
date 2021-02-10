INSERT INTO department (deptName)
VALUES ('Sales'),
('HR'),
('IT');

INSERT INTO role (title, salary, department_id)
VALUES('account executive', 100000, 1),
('coordinator', 75000, 2),
('programmer', 85000, 3);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES('bob', 'johnson', 1, NULL),
('frank', 'dodson', 3, 1),
('jim', 'bobson', 2, 1);