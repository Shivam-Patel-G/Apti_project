import { Disclosure, DisclosureButton, DisclosurePanel, Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react';
import { Bars3Icon, BellIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for redirection
import { useEffect, useState } from 'react';
import CreateTest from './CreateTest'; // Import the CreateTest component
import AddQuestion from './AddQuestion';
import axios from 'axios';

const user = {
  name: 'Tom Cook',
  email: 'tom@example.com',
  imageUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
};

const navigation = [
  { name: 'Dashboard', href: '#', current: true },
  { name: 'Create test', href: '#', current: false },
  { name: 'Add Questions', href: '#', current: false },
  { name: 'Student Results', href: '#', current: false },
  { name: 'Reports', href: '#', current: false },
];

const userNavigation = [
  { name: 'Your Profile', href: '#' },
  { name: 'Settings', href: '#' },
  { name: 'Sign out', href: '' }, // Sign out option
];

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

export default function AdminDashboard() {
  const navigate = useNavigate(); // Initialize navigate for redirection
  const [showCreateTest, setShowCreateTest] = useState(false); // State to toggle CreateTest component
  const [showAddQuestion, setShowAddQuestion] = useState(false); // State to toggle AddQuestion component
  const [tests, setTests] = useState([]); // State to store tests
  const [studentResults, setStudentResults] = useState([]); // State to store student results
  const [isFetchingResults, setIsFetchingResults] = useState(false);
  const [selectedTestResponses, setSelectedTestResponses] = useState(null);
  const uniqueTestIds = new Set()

  const handleTestClick = async (testId) => {
    try {
      const response = await axios.get(`http://localhost:4500/api/admin/student-responses/test/${testId}`);
      setSelectedTestResponses(response.data); // Store all responses for the test
    } catch (error) {
      console.error('Error fetching student responses:', error);
    }
  };

  const fetchStudentResults = async () => {
    setIsFetchingResults(true); 
    try {
      const userData = JSON.parse(localStorage.getItem('user')); // Retrieve user data
      const response = await axios.get(`http://localhost:4500/api/admin/student-results/${userData.id}`);
      setStudentResults(response.data);
    } catch (error) {
      console.error('Error fetching student results:', error);
    } finally {
      setIsFetchingResults(false);
    }
  };

  useEffect(() => {
    const fetchTests = async () => {
      try {
        const userData = JSON.parse(localStorage.getItem('user')); // Retrieve user data
        const response = await axios.get(`http://localhost:4500/api/admin/getTestsOfAdmin?creator=${userData.id}`);
        setTests(response.data);
      } catch (error) {
        console.error('Error fetching tests:', error);
      }
    };

    fetchTests();
  }, []);


  const handleLogout = () => {  
    // Clear token and other session-related data from localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('role');

    // Redirect user to login page
    navigate('/login/admin');
  };

  const handleCreateTestClick = () => {
    setShowCreateTest(true); 
    // Show the CreateTest component
    setShowAddQuestion(false);
  };

  const handleAddQuestionClick = () => {
    setShowAddQuestion(true);
    setShowCreateTest(false);
     // Show the AddQuestion component
    //  navigate('/admin/add-question')
  };
  const handleStudentResultClick = () => {
    setShowCreateTest(false);
    setShowAddQuestion(false);
    fetchStudentResults(); // Fetch results when this navigation item is clicked
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Disclosure as="nav" className="bg-gray-800">
        <div className="mx-auto w-screen px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <img
                  alt="Your Company"
                  src="https://tailwindui.com/plus/img/logos/mark.svg?color=indigo&shade=500"
                  className="h-8 w-8"
                />
              </div>
              <div className="hidden md:block">
                <div className="ml-10 flex items-baseline space-x-4">
                  {navigation.map((item) => (
                    <a
                      key={item.name}
                      href={item.href}
                      onClick={(e) => {
                        e.preventDefault();
                        if (item.name === 'Create test') {
                          handleCreateTestClick();
                        } else if (item.name === 'Add Questions') {
                          handleAddQuestionClick();
                        } else if (item.name === 'Student Results') {
                          handleStudentResultClick();
                        }
                      }}
                      aria-current={item.current ? 'page' : undefined}
                      className={classNames(
                        item.current ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                        'rounded-md px-3 py-2 text-sm font-medium',
                      )}
                    >
                      {item.name}
                    </a>
                  ))}
                </div>
              </div>
            </div>
            <div className="hidden md:block">
              <div className="ml-4 flex items-center md:ml-6">
                <button
                  type="button"
                  className="relative rounded-full bg-gray-800 p-1 text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
                >
                  <span className="absolute -inset-1.5" />
                  <span className="sr-only">View notifications</span>
                  <BellIcon aria-hidden="true" className="h-6 w-6" />
                </button>

                {/* Profile dropdown */}
                <Menu as="div" className="relative ml-3">
                  <div>
                    <MenuButton className="relative flex max-w-xs items-center rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                      <span className="absolute -inset-1.5" />
                      <span className="sr-only">Open user menu</span>
                      <img alt="" src={user.imageUrl} className="h-8 w-8 rounded-full" />
                    </MenuButton>
                  </div>
                  <MenuItems
                    transition
                    className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 transition focus:outline-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in"
                  >
                    {userNavigation.map((item) => (
                      <MenuItem key={item.name}>
                        <a
                          href={item.href}
                          onClick={item.name === 'Sign out' ? handleLogout : undefined}  // Logout when "Sign out" is clicked
                          className="block px-4 py-2 text-sm text-gray-700 data-[focus]:bg-gray-100"
                        >
                          {item.name}
                        </a>
                      </MenuItem>
                    ))}
                  </MenuItems>
                </Menu>
              </div>
            </div>
            <div className="-mr-2 flex md:hidden">
              {/* Mobile menu button */}
              <DisclosureButton className="group relative inline-flex items-center justify-center rounded-md bg-gray-800 p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                <span className="absolute -inset-0.5" />
                <span className="sr-only">Open main menu</span>
                <Bars3Icon aria-hidden="true" className="block h-6 w-6 group-data-[open]:hidden" />
                <XMarkIcon aria-hidden="true" className="hidden h-6 w-6 group-data-[open]:block" />
              </DisclosureButton>
            </div>
          </div>
        </div>

        <DisclosurePanel className="md:hidden">
          <div className="space-y-1 px-2 pb-3 pt-2 sm:px-3">
            {navigation.map((item) => (
              <DisclosureButton
                key={item.name}
                as="a"
                href={item.href}
                onClick={item.name === 'Create test' ? (e) => {
                  e.preventDefault();
                  handleCreateTestClick();
                }
                : undefined}
                aria-current={item.current ? 'page' : undefined}
                className={classNames(
                  item.current ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                  'block rounded-md px-3 py-2 text-base font-medium',
                )}
              >
                {item.name}
              </DisclosureButton>
            ))}
          </div>
          <div className="border-t border-gray-700 pb-3 pt-4">
            <div className="flex items-center px-5">
              <div className="flex-shrink-0">
                <img alt="" src={user.imageUrl} className="h-10 w-10 rounded-full" />
              </div>
              <div className="ml-3">
                <div className="text-base font-medium leading-none text-white">{user.name}</div>
                <div className="text-sm font-medium leading-none text-gray-400">{user.email}</div>
              </div>
              <button
                type="button"
                className="relative ml-auto flex-shrink-0 rounded-full bg-gray-800 p-1 text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
              >
                <span className="absolute -inset-1.5" />
                <span className="sr-only">View notifications</span>
                <BellIcon aria-hidden="true" className="h-6 w-6" />
              </button>
            </div>
            <div className="mt-3 space-y-1 px-2">
              {userNavigation.map((item) => (
                <DisclosureButton
                  key={item.name}
                  as="a"
                  href={item.href}
                  onClick={item.name === 'Sign out' ? handleLogout : undefined}  // Logout when "Sign out" is clicked
                  className="block rounded-md px-3 py-2 text-base font-medium text-gray-400 hover:bg-gray-700 hover:text-white"
                >
                  {item.name}
                </DisclosureButton>
              ))}
            </div>
          </div>
        </DisclosurePanel>
      </Disclosure>

      <header className="bg-white shadow">
        <div className="mx-auto w-full px-4 py-6 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Dashboard</h1>
        </div>
      </header>

      <main>
        <div className="mx-auto w-full px-4 py-6 sm:px-6 lg:px-8">
        {showAddQuestion ? (
      <AddQuestion /> // Render AddQuestion component when toggled
    ) : showCreateTest ? (
      <CreateTest /> // Render CreateTest component when toggled
    ) : (
      <>
      <h2 className="mt-4 text-2xl text-black font-semibold">Your Created Tests</h2>
      <div className="mt-6 space-y-4">
        {tests.length > 0 ? (
          tests.map((test) => (
            <div
              key={test._id}
              className="p-4 border rounded-md shadow hover:shadow-lg transition-shadow duration-300"
            >
              <h3 className="text-xl font-semibold">{test.testName}</h3>
              <p className="mt-2">Questions: {test.questions.length}</p>
            </div>
          ))
        ) : (
          <p className='text-black'>No tests created yet</p>
        )}
        </div>



        <div className="mt-8">
            <h2 className="text-xl font-semibold text-gray-900">Student Results</h2>






            {!showCreateTest && !showAddQuestion && (
          <div className="mt-6">
            {/* <h2 className="text-xl font-semibold">Student Results</h2> */}
            {isFetchingResults ? (
              <p>Loading results...</p>
            ) : (
              <div className="grid grid-cols-1 gap-6">
                {studentResults.map((result) => {
      // Check if the test ID is already processed
      if (uniqueTestIds.has(result.test._id)) {
        return null; // If it's already processed, return null (don't render anything)
      }

      // If not, add it to the Set
      uniqueTestIds.add(result.test._id);

      return (
        <div key={result.test._id} className="block rounded-lg border border-gray-200 bg-white p-4 shadow-sm hover:shadow-md">
          <h3 className="text-lg font-semibold">{result.test.testName}</h3>
          <p>Total Marks: {result.totalMarks}</p>
          <p>Date Submitted: {new Date(result.dateSubmitted).toLocaleDateString()}</p>
          <button
            className="mt-2 rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
            onClick={() => handleTestClick(result.test._id)}
          >
            View Responses
          </button>
        </div>
      );
    })}
              </div>
            )}
          </div>
        )}

        {/* Displaying Test Responses */}
        {selectedTestResponses && (
  <div className="mt-6">
    <h2 className="text-xl font-semibold">Responses for {selectedTestResponses[0].test.testName}</h2>
    {selectedTestResponses.map((result) => (
      <div key={result._id} className="block rounded-lg border border-gray-200 bg-white p-4 shadow-sm mt-4">
        <h3 className="text-lg font-semibold">{result.student.name} ({result.student.email})</h3>
        <p>Marks Obtained: {result.marksObtained}</p>
        <p>Date Submitted: {new Date(result.dateSubmitted).toLocaleDateString()}</p>
        <h4 className="font-semibold">Answers:</h4>
        {result.answers.map((answer) => (
          <div key={answer.questionId} className="mt-2">
            {/* <p>Question ID: {answer.questionId}</p> */}
            <p>Selected Option: {answer.selectedOption}</p>
            <p>Correct: {answer.correct ? 'Yes' : 'No'}</p>
          </div>
        ))}
      </div>
    ))}
  </div>
)}








              </div>
        
        
      </>
      

      
    )}
        </div>
      </main>
    </div>
  );
}
