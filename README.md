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


What I did:
1. Installed and properly registered Yup in package.json; resolved missing dependency issues.

2. Fixed incorrect import paths in transaction.js and cleaned up all broken/duplicate imports.

3. Added comprehensive frontend validations, including type and date validation.

4. Installed and configured nodemon with a dev script for automatic backend restarts during development.

5. Removed misplaced index.html from src and deleted duplicate DashboardSchema and extra validation files.

6. Added Delete and Summary buttons on the frontend UI.

7. Implemented corresponding delete and summary APIs on the backend with proper logic.

8. Introduced .env configuration for environment variables and improved security practices.

9. Configured CORS origin restrictions for safer API access.

10. Implemented robust and consistent error handling across frontend and backend.

11. Optimized form submission flow: now calls a single create transaction API and updates state from its response instead of refetching data.

12. Refactored API structure and error handling for cleaner, more maintainable code.

13. Efficient state management.