import React, { useState } from 'react';
import axios from 'axios';

function AddQuestion() {
  const [question, setQuestion] = useState({
    questionText: '',
    options: [
      { id: 1, text: '' },
      { id: 2, text: '' },
      { id: 3, text: '' },
      { id: 4, text: '' },
    ],
    correctAnswer: '',
    difficultyLevel: 'easy',
    category: '' // ✅ Added category field
  });

  const handleChange = (e) => {
    setQuestion({ ...question, [e.target.name]: e.target.value });
  };

  const handleOptionChange = (index, value) => {
    const options = [...question.options];
    options[index].text = value; // Update the text field for the specific option
    setQuestion({ ...question, options });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Prepare the payload with category
      const questionPayload = {
        questionText: question.questionText,
        options: question.options.map(option => option.text), // Send only the text for storage
        correctAnswer: question.correctAnswer,
        difficultyLevel: question.difficultyLevel,
        category: question.category // ✅ Added category
      };

      // Send request to backend
      const response = await axios.post('https://apti-project.onrender.com/api/admin/questions', questionPayload);
      console.log('Question added successfully:', response.data);
      alert("Question successfully added");

      window.location.reload();
      
    } catch (error) {
      console.error('Error adding question:', error.response?.data?.message || error.message);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        name="questionText"
        placeholder="Question"
        onChange={handleChange}
        required
      />

      {question.options.map((option, index) => (
        <input
          key={option.id}
          type="text"
          placeholder={`Option ${index + 1}`}
          onChange={(e) => handleOptionChange(index, e.target.value)}
          required
        />
      ))}

      <input
        type="text"
        name="correctAnswer"
        placeholder="Correct Answer"
        onChange={handleChange}
        required
      />

      <select name="difficultyLevel" onChange={handleChange} required>
        <option value="easy">Easy</option>
        <option value="moderate">Moderate</option>
        <option value="hard">Hard</option>
      </select>

      {/* ✅ New Category Dropdown */}
      <select name="category" onChange={handleChange} required>
        <option value="">Select Category</option>
        <option value="Time & Speed">Time & Speed</option>
        <option value="Mixture & Alligation">Mixture & Alligation</option>
        <option value="Probability">Probability</option>
        <option value="Algebra">Algebra</option>
      </select>

      <button type="submit">Add Question</button>
    </form>
  );
}

export default AddQuestion;
