# PRD

## Epic 1: Core To-Do Functionality

**Goal:** To deliver a functional, single-user to-do application with user authentication and full CRUD (Create, Read, Update, Delete) capabilities for tasks.

**Stories:**

**Story 1.1: User Authentication**

- **As a** user,
- **I want** to be able to sign up, log in, and log out,
- **so that** I can securely manage my personal to-do list.
- **Acceptance Criteria:**
  1.  The application uses the Supabase Auth UI for login and sign-up forms.
  2.  A user can create an account and will be automatically logged in.
  3.  A logged-in user can log out, which redirects them to the login page.
  4.  The main to-do list page is protected and only visible to authenticated users.

**Story 1.2: Create and View To-Dos**

- **As an** authenticated user,
- **I want** to enter a task into an input field and see it appear on my to-do list,
- **so that** I can keep track of my tasks.
- **Acceptance Criteria:**
  1.  There is a text input field and a "Create" button on the main page.
  2.  Submitting a new task adds it to the database and displays it in the list of to-dos without a page refresh.
  3.  The to-do list is fetched from the Supabase database when the page loads.
  4.  The input field is cleared after a to-do is successfully created.

**Story 1.3: Update and Delete To-Dos**

- **As an** authenticated user,
- **I want** to be able to mark a to-do as complete and delete it,
- **so that** I can manage my task list effectively.
- **Acceptance Criteria:**
  1.  Each to-do item has a checkbox or button to toggle its "completed" status.
  2.  Changing the status updates the item in the database and visually (e.g., with a strikethrough).
  3.  Each to-do item has a "Delete" button.
  4.  Clicking "Delete" removes the to-do from the UI and the database.

With this epic, the planning phase is complete. All the requirements are clearly defined and structured for development.
