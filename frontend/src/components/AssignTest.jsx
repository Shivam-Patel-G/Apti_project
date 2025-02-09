import React, { useState, useEffect } from 'react';
import axios from 'axios';

function AssignTest() {
  const [tests, setTests] = useState([]);
  const [students, setStudents] = useState([]);
  const [selectedTest, setSelectedTest] = useState('');
  const [selectedStudents, setSelectedStudents] = useState([]);

  useEffect(() => {
    // Fetch tests and students
    const fetchTestsAndStudents = async () => {
      const testRes = await axios.get('https://apti-project.onrender.com/api/admin/tests');
      const studentRes = await axios.get('https://apti-project.onrender.com/api/student');
      setTests(testRes.data);
      setStudents(studentRes.data);
    };
    fetchTestsAndStudents();
  }, []);

  const handleAssign = async () => {
    await axios.post('https://apti-project.onrender.com/api/admin/tests/assign', { testId: selectedTest, studentIds: selectedStudents });
    alert("Test Assigned!")
  };

  return (
    <div>
      <select onChange={(e) => setSelectedTest(e.target.value)}>
        {tests.map(test => <option key={test._id} value={test._id}>{test.testName}</option>)}
      </select>
      <select multiple onChange={(e) => setSelectedStudents([...e.target.selectedOptions].map(o => o.value))}>
        {students.map(student => <option key={student._id} value={student._id}>{student.name}</option>)}
      </select>
      <button onClick={handleAssign}>Assign Test</button>
    </div>

  );
}

export default AssignTest;
