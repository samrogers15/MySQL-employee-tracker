const inquirer = require('inquirer');
const mysql = require('mysql');
const cTable = require('console.table');
const path = require('path');
const database = require('./database');

// require db, inquirer, console.table
// need to make async functions