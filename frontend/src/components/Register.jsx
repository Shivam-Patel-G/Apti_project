import React, { useState} from 'react';
import { useNavigate ,NavLink} from 'react-router-dom';
import axios from 'axios';

function Register({ role }) {
  const [user, setUser] = useState({ name: '', email: '', password: '' });
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate()

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const endpoint = role === 'admin' 
      ? 'https://apti-project.onrender.com/api/auth/register/admin' 
      : 'https://apti-project.onrender.com/api/auth/register/student';
    
    try {
      const res = await axios.post(endpoint, user);
      alert('Registration successful!');

      // Store user details and token in localStorage
      const { result, token } = res.data;
      localStorage.setItem('user', JSON.stringify({ 
        id: result._id, 
        name: result.name, 
        email: result.email, 
        token: token 
      })); 
      localStorage.setItem('role', role); 
      
      if(role === 'student') {
        navigate('/login/student')
      }
      else {
        navigate('/login/admin')
      }

      setErrorMessage(''); // Clear any previous errors
    } catch (err) {
      console.error(err); // Log the full error in the console for debugging

      if (err.response && err.response.data && err.response.data.message) {
        setErrorMessage(err.response.data.message); // Display specific error message from the server
      } else {
        setErrorMessage('Something went wrong, please try again.'); // Fallback error message
      }
    }
  };

  // return (
  //   <div>
  //     <form onSubmit={handleSubmit}>
  //       <input 
  //         type="text" 
  //         name="name" 
  //         placeholder="Name" 
  //         onChange={handleChange} 
  //         required 
  //       />
  //       <input 
  //         type="email" 
  //         name="email" 
  //         placeholder="Email" 
  //         onChange={handleChange} 
  //         required 
  //       />
        // <input 
        //   type="password" 
        //   name="password" 
        //   placeholder="Password" 
        //   onChange={handleChange} 
        //   required 
        // />
  //       <button type="submit">Register as {role}</button>
  //     </form>
  //     {role==='student'?
  //     <NavLink to='/login/student'>Login Instead</NavLink>
  //     :
  //     <NavLink to='/login/admin'>Login Instead</NavLink>
  //   }

  //     {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
  //   </div>
  // );


  
  return (
    <>
      {/*
        This example requires updating your template:

        ```
        <html class="h-full bg-white">
        <body class="h-full">
        ```
      */}
      <div className="flex min-h-screen w-screen flex-1 flex-col justify-center px-6 py-12 lg:px-8 bg-white">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <img
            alt="Your Company"
            src="https://tailwindui.com/plus/img/logos/mark.svg?color=indigo&shade=600"
            className="mx-auto h-10 w-auto"
          />
          <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
            Sign in to your account
          </h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <form action="#" method="POST" className="space-y-6" onSubmit={handleSubmit}>

          <div>
              <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900 bg-white">
                Name
              </label>
              <div className="mt-2">
                <input
                  id="name"
                  name="name"
                  type="name"
                  required
                  autoComplete="name"
                  onChange={handleChange}
                  className="block w-full bg-white rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>


            <div>
              <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
                Email address
              </label>
              <div className="mt-2">
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
                  onChange={handleChange}
                  className="block w-full  rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">
                  Password
                </label>
                <div className="text-sm">
                  <a href="#" className="font-semibold text-indigo-600 hover:text-indigo-500">
                    Forgot password?
                  </a>
                </div>
              </div>
              <div className="mt-2">
                <input
                  id="password"
                  name="password"
                  type="password"
                  onChange={handleChange}
                  required
                  autoComplete="current-password"
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Sign up as {role}
              </button>
            </div>
          </form>

          <p className="mt-10 text-center text-sm text-gray-500">
            Not a member?{' '}
            {role==='student'?
            <NavLink to='/login/student' className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500">
            Login
          </NavLink>
          :
          <NavLink to='/login/admin' className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500">
              Login
            </NavLink>  
          }
          </p>
        </div>
      </div>
    </>
  )
}

export default Register;
