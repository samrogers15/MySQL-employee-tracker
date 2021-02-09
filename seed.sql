INSERT INTO department (name)
VALUES ('Sales'),
('HR'),
('IT');

INSERT INTO role (title, salary)
VALUES('account executive', 100000),
('coordinator', 75000),
('programmer', 85000);

INSERT INTO employee (first_name, last_name, role_id)
VALUES('bob', 'johnson', 1),
('frank', 'dodson', 2),
('jim', 'bobson', 2);