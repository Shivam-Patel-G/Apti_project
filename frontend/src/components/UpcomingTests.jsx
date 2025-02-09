import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function UpcomingTests() {
  const [tests, setTests] = useState([]);
  const navigate = useNavigate(); // Hook for navigation
  const studentId = JSON.parse(localStorage.getItem('user')).id; // Get the student ID from local storage

  useEffect(() => {
    // Fetch upcoming tests for the student
    axios.get(`https://apti-project.onrender.com/api/student/tests/upcoming/${studentId}`)
      .then((response) => {
        setTests(response.data);
      })
      .catch((error) => {
        console.error('Error fetching tests:', error);
      });
  }, [studentId]); // Add studentId as a dependency

  const handleTakeTest = (testId) => {
    // Navigate to the test page when a test is clicked
    navigate(`/test/${testId}`);
  };

  return (
    <div className="mx-auto w-full px-4 py-6 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold tracking-tight text-gray-900">Upcoming Tests</h1>
      <div className="mt-6 space-y-4">
        {tests.length > 0 ? (
          tests.map((test) => (
            <div
              key={test._id}
              className="p-4 border rounded-md shadow hover:shadow-lg transition-shadow duration-300 cursor-pointer"
              onClick={() => handleTakeTest(test._id)} // Call handleTakeTest on click
            >
              <h2 className="text-xl font-semibold">{test.testName}</h2>
              <p className="mt-2">Questions: {test.questions.length}</p>
            </div>
          ))
        ) : (
          <p>No upcoming tests available</p>
        )}
      </div>
    </div>
  );
}
