Debug Test Project

This project contains bugs, bad practices, and structural issues.

Your tasks:

1. Fix at least 5 bugs
2. Add validation
3. Refactor one major module
4. Improve API structure
5. Improve error handling
6. Improve project structure
7. Document your changes

Deliverables:

- Fixed code
- README with:
  - bug list
  - root causes
  - fixes
  - refactor explanation
  - improvements


What I do:
1. Firstly there is no Script for development server in this, So I simply just installed Vite, add Vite Script and run the application.
2. We are passing transactions in the dependency array and whenever transaction changes, effect runs and again run which cause a Infinity Loop and our Component will be fetching data forever. I just passes an empty array here.
3. Did things like letting react controll the state and fetching updated data after submitting.
4. No Error Handling, If server fails, code will crash and its a bad approach, I handle if any error occur to prevent code crash using try/catch block.
5. I used arrow function which is modern and code is easily understandable and that's the best approach, also i export my functions in the last which is a professional way.
6. Made a global error handler in server.js and use CORS bcz frontend is on another port
7. settled expense error
8. fix all the errors with Routers and I want to handle the error like in my method of Console error but there you use next, which is also a good option.
9. Validations perform on frontend for submitting data
10. Validation on the Backend also performed to Secure Backend and I use this Validations like Middlewares

I used AI but I used in Filtering and Pagination Concept, I know but Implementation is little bit confusing. I just need to polish my skills with industry level programming, Additionally these projects are not created from commands, these are manually written, So I hope that's satisfying. I tried my best and Looking forward for final Interview.