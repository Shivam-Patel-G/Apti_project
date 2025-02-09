import React, { useState, useEffect } from 'react';
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from "@/components/ui/drawer";
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

const Test = () => {
    const [questions, setQuestions] = useState([]);
    const [selectedQuestion, setSelectedQuestion] = useState(null);
    const [selectedAnswer, setSelectedAnswer] = useState({});
    const [submittedAnswers, setSubmittedAnswers] = useState([]);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [drawerOpen, setDrawerOpen] = useState(false); // State to control drawer

    const { testId } = useParams();
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [reviewQuestions, setReviewQuestions] = useState([]); // To track marked questions
    const studentData = JSON.parse(localStorage.getItem('user'));
    const navigate = useNavigate()

    const handleNext = () => {
        if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
        }
    };

    const handlePrevious = () => {
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex(currentQuestionIndex - 1);
        }
    };

    const handleMarkForReview = () => {
        if (!reviewQuestions.includes(selectedQuestion._id)) {
            setReviewQuestions([...reviewQuestions, selectedQuestion._id]);
        }
    };

    useEffect(() => {
        setSelectedQuestion(questions[currentQuestionIndex]);
    }, [currentQuestionIndex, questions]);

    useEffect(() => {
        // Fetch questions for the specific test from the backend
        const fetchQuestions = async () => {
            try {
                const response = await axios.get(`https://apti-project.onrender.com/api/student/test/${testId}`);
                setQuestions(response.data.questions);
                setSelectedQuestion(response.data.questions[0]); // Show the first question by default
            } catch (error) {
                console.error('Error fetching questions:', error);
            }
        };
        fetchQuestions();
    }, [testId]);

    const handleQuestionClick = (question) => {
        setSelectedQuestion(question);
    };

    const handleAnswerChange = (option) => {
        setSelectedAnswer({
            ...selectedAnswer,
            [selectedQuestion._id]: option,
        });
    };

    const handleSubmit = async () => {
        try {
            const response = await axios.post(`https://apti-project.onrender.com/api/student/test/submit`, {
                studentId: studentData.id, // Replace with the actual student ID
                testId,
                answers: selectedAnswer,
            });

            const { result, marksObtained, totalMarks } = response.data;

            // Set submitted answers and result
            setSubmittedAnswers(Object.entries(selectedAnswer).map(([questionId, answerId]) => ({
                questionId,
                answerId,
            })));

            // Display marks to the student
            alert(`Test submitted successfully. You scored ${marksObtained} out of ${totalMarks}`);

            // Set state to show the result
            setIsSubmitted(true);

            // Close the drawer after submission
            setDrawerOpen(false);
        } catch (error) {
            console.error('Error submitting answers:', error);
        }
    };

    const handleCloseResults = () => {
        setIsSubmitted(false);
        navigate('/'); // Redirect to main page (adjust the path as necessary)
    };

    return (
        <div className="w-screen h-screen flex justify-center items-center bg-blue-300">
            <div className="flex flex-row w-[90vw] h-[90vh]">
                <div className="flex-shrink-0 w-1/4 p-4 bg-blue-200 flex flex-col justify-around">
                    <div className="grid grid-cols-4 gap-2">
                        {questions.map((question, index) => (
                            <button
                                key={question._id}
                                className="bg-white text-black px-2 py-1 rounded-sm hover:bg-green-400 m-2"
                                onClick={() => handleQuestionClick(question)}
                            >
                                {index + 1}
                            </button>
                        ))}
                    </div>
                    <Drawer open={drawerOpen} onOpenChange={setDrawerOpen}> {/* Control the open state */}
                        <DrawerTrigger className="border-2 border-red-800 bg-red-600 hover:bg-red-700 font-bold text-white transition duration-200 rounded-xl p-3 shadow-md transform hover:scale-105">
                            FINAL SUBMIT
                        </DrawerTrigger>
                        <DrawerContent>
                            <DrawerHeader>
                                <DrawerTitle className="text-2xl font-semibold">Are you absolutely sure?</DrawerTitle>
                                <DrawerDescription className="text-lg">
                                    This action cannot be undone. Make sure you have answered all questions before submitting.
                                </DrawerDescription>
                            </DrawerHeader>
                            <DrawerFooter>
                                <Button className="bg-red-600 hover:bg-red-800 text-white" onClick={handleSubmit}>
                                    Submit
                                </Button>
                                <DrawerClose>
                                    <Button variant="outline" className="ml-2">Cancel</Button>
                                </DrawerClose>
                            </DrawerFooter>
                        </DrawerContent>
                    </Drawer>
                </div>

                <div className="h-full bg-white w-3/4">
                    <div className="flex flex-col h-[90vh]">
                        <div className="flex-1 p-4">
                            {selectedQuestion ? (
                                <>
                                    <div className="question-number text-3xl font-bold mt-8 mb-8">
                                        Question {questions.indexOf(selectedQuestion) + 1}
                                    </div>
                                    <p className="question-text mb-4 text-2xl">
                                        {selectedQuestion.questionText}
                                    </p>
                                    <div className="text-2xl">
                                        {selectedQuestion.options.map((option, index) => (
                                            <div key={option} className="flex items-center space-x-2">
                                                <input
                                                    type="radio"
                                                    name={`question-${selectedQuestion._id}`}
                                                    value={option}
                                                    checked={selectedAnswer[selectedQuestion._id] === option}
                                                    onChange={() => handleAnswerChange(option)}
                                                    id={`answer-${index}`}
                                                />
                                                <Label htmlFor={`answer-${index}`} className="text-xl">
                                                    {String.fromCharCode(65 + index)}. {option}
                                                </Label>
                                            </div>
                                        ))}
                                    </div>
                                </>
                            ) : (
                                <p className="text-2xl">Loading question...</p>
                            )}
                        </div>

                        <div className="flex justify-center items-center p-4 bg-blue-800">
                            <button className="mr-2 bg-blue-500 text-white px-4 py-2 rounded-md" onClick={handlePrevious}>
                                Previous
                            </button>
                            <button className="bg-yellow-500 text-white px-4 py-2 rounded-md" onClick={handleMarkForReview}>
                                Mark for Review
                            </button>
                            <button className="mr-2 ml-2 bg-green-500 text-white px-4 py-2 rounded-md" onClick={handleNext}>
                                Submit & Next
                            </button>
                            <button className="mr-2 bg-blue-500 text-white px-4 py-2 rounded-md" onClick={handleNext}>
                                Next
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Display submitted answers */}
            {isSubmitted && (
                <div className="absolute top-0 left-0 w-full h-full flex justify-center items-center bg-gray-800 bg-opacity-50">
                    <div className="bg-white p-4 rounded-md shadow-md">
                        <h2 className="text-2xl font-bold mb-4">Your Answers</h2>
                        <ul>
                            {submittedAnswers.map(({ questionId, answerId }) => (
                                <li key={questionId} className="mb-2">
                                    <span className="font-bold">Question {questionId}: </span>
                                    Answer {answerId}
                                </li>
                            ))}
                        </ul>
                        <Button onClick={handleCloseResults}>Close</Button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Test;
