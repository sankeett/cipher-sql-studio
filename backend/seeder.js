const mongoose = require('mongoose');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const User = require('./models/User');
const Assignment = require('./models/Assignment');

dotenv.config();

connectDB();

const importData = async () => {
  try {
    await Assignment.deleteMany();

    const sampleAssignments = [
      {
        title: 'Retrieve all employees',
        description: 'Write a SQL query to retrieve all columns for all employees from the "employees" table.',
        difficulty: 'Easy',
        schemaDescription: 'Table "employees" with columns: id (INT), name (VARCHAR), department (VARCHAR), salary (INT).',
        sampleDataDescription: 'id: 1, name: "Alice", department: "HR", salary: 50000\nid: 2, name: "Bob", department: "Engineering", salary: 80000',
        expectedQuery: 'SELECT * FROM employees;'
      },
      {
        title: 'Find high earners',
        description: 'Retrieve the names of employees who earn more than 60000 in the Engineering department.',
        difficulty: 'Medium',
        schemaDescription: 'Table "employees" with columns: id (INT), name (VARCHAR), department (VARCHAR), salary (INT).',
        sampleDataDescription: 'Refer to the employees table sample data.',
        expectedQuery: "SELECT name FROM employees WHERE salary > 60000 AND department = 'Engineering';"
      }
    ];

    await Assignment.insertMany(sampleAssignments);

    console.log('Data Imported!');
    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

importData();
