import { useEffect, useState } from 'react';

const CreateTest = () => {
  const [questions, setQuestions] = useState([]);
  const [selectedQuestions, setSelectedQuestions] = useState([]);
  const [testName, setTestName] = useState('');
  const [students, setStudents] = useState([]);
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [assignAll, setAssignAll] = useState(false);
  const [difficultyLevel, setDifficultyLevel] = useState('');
  const [category, setCategory] = useState('');

  const adminId = JSON.parse(localStorage.getItem('user')).id;

  useEffect(() => {
    const fetchStudents = async () => {
      const response = await fetch('https://apti-project.onrender.com/api/student/getAllStudents');
      const data = await response.json();
      setStudents(data);
    };

    fetchStudents();
  }, []);

  const fetchQuestions = async () => {
    let queryParams = new URLSearchParams();
    if (difficultyLevel) queryParams.append('difficultyLevel', difficultyLevel);
    if (category) queryParams.append('category', category);

    const response = await fetch(`https://apti-project.onrender.com/api/admin/getAllQuestions?${queryParams.toString()}`);
    const data = await response.json();
    setQuestions(data);
    setSelectedQuestions([]); // Reset selection on new filter
  };

  const handleQuestionSelect = (questionId) => {
    setSelectedQuestions((prevSelected) =>
      prevSelected.includes(questionId)
        ? prevSelected.filter((id) => id !== questionId)
        : [...prevSelected, questionId]
    );
  };

  const handleSelectAllQuestions = () => {
    if (selectedQuestions.length === questions.length) {
      setSelectedQuestions([]); // Deselect all if all are already selected
    } else {
      setSelectedQuestions(questions.map((q) => q._id)); // Select all questions
    }
  };

  const handleStudentSelect = (studentId) => {
    setSelectedStudents((prevSelected) =>
      prevSelected.includes(studentId)
        ? prevSelected.filter((id) => id !== studentId)
        : [...prevSelected, studentId]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const response = await fetch('https://apti-project.onrender.com/api/admin/tests', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ testName, questionIds: selectedQuestions, creator: adminId }),
    });

    const test = await response.json();

    await fetch('https://apti-project.onrender.com/api/admin/tests/assign', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        testId: test._id,
        studentIds: selectedStudents,
        assignAll,
      }),
    });

    if (response.ok) {
      alert('Test created successfully');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label className="text-black">
          Test Name:
          <input type="text" value={testName} onChange={(e) => setTestName(e.target.value)} required />
        </label>
      </div>

      {/* ✅ Filter Section */}
      <div>
        <h2>Filter Questions</h2>
        <label>Difficulty Level:</label>
        <select value={difficultyLevel} onChange={(e) => setDifficultyLevel(e.target.value)}>
          <option value="">All</option>
          <option value="easy">Easy</option>
          <option value="moderate">Moderate</option>
          <option value="hard">Hard</option>
        </select>

        <label>Category:</label>
        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="">All</option>
          <option value="Time & Speed">Time & Speed</option>
          <option value="Mixture & Alligation">Mixture & Alligation</option>
          <option value="Probability">Probability</option>
          <option value="Algebra">Algebra</option>
          <option value="Profit & Loss">Profit & Loss</option>
          <option value="Boat & Streams">Boat & Streams</option>
          <option value="Trains">Trains</option>
        </select>

        <button type="button" onClick={fetchQuestions}>Apply Filters</button>
      </div>

      {/* ✅ Display Filtered Questions */}
      <div>
        <h2>Select Questions</h2>
        
        {/* ✅ "Select All" Button */}
        {questions.length > 0 && (
          <button type="button" onClick={handleSelectAllQuestions}>
            {selectedQuestions.length === questions.length ? "Deselect All" : "Select All"}
          </button>
        )}

        {questions.map((question) => (
          <div key={question._id}>
            <input
              type="checkbox"
              id={question._id}
              value={question._id}
              checked={selectedQuestions.includes(question._id)}
              onChange={() => handleQuestionSelect(question._id)}
            />
            <label htmlFor={question._id}>{question.questionText}</label>
          </div>
        ))}
      </div>

      {/* ✅ Assign Test to Students */}
      <div>
        <h2>Assign Test to Students</h2>
        <div>
          <label>
            <input type="checkbox" checked={assignAll} onChange={(e) => setAssignAll(e.target.checked)} />
            Assign to all students
          </label>
        </div>

        {!assignAll && (
          <div>
            <h3>Select Students</h3>
            {students.map((student) => (
              <div key={student._id}>
                <input
                  type="checkbox"
                  id={student._id}
                  value={student._id}
                  onChange={() => handleStudentSelect(student._id)}
                />
                <label htmlFor={student._id}>{student.name}</label>
              </div>
            ))}
          </div>
        )}
      </div>

      <button type="submit">Create and Assign Test</button>
    </form>
  );
};

export default CreateTest;
