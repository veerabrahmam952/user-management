
# MyAngularProject

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 17.1.1.

## Table Component Usage

This application features a comprehensive user management table with the following functionality:

### Main Features

1. **Dynamic Data Display**: The table automatically generates columns based on the user data structure
2. **Search Functionality**: Search across all columns using the search input at the top
3. **Pagination**: Navigate through large datasets with configurable page sizes (default: 10 items per page)
4. **Inline Editing**: Edit user data directly within the table rows
5. **Row Actions**: View details, edit, save, and cancel operations

### Table Operations

#### Search
- Use the search box to filter users across all columns
- Results update in real-time as you type
- Clear search using the "✕" button or by clearing the input

#### Row Navigation
- Click on any row to navigate to the user details page
- Row clicking is disabled when in edit mode

#### Inline Editing
1. Click the edit icon (✏️) to enable edit mode for a row
2. All fields in the row become editable input fields
3. Use the save icon (💾) to save changes
4. Use the cancel icon (❌) to discard changes and exit edit mode
5. Only one row can be in edit mode at a time

#### Pagination
- Navigate using Previous/Next buttons
- Click specific page numbers to jump to that page
- View current page information at the bottom
- Edit states are cleared when changing pages

#### View Details
- Click the view icon (👁️) to navigate to the detailed user view
- Shows all user properties in a formatted layout

### Component Structure

The table component (`UserListComponent`) includes:
- Dynamic column generation based on data structure
- Search filtering with real-time updates
- Pagination with configurable page sizes
- Edit state management for individual rows
- Integration with the UserService for data operations

### Technical Implementation

- Uses Angular Reactive Forms for input handling
- Implements OnInit lifecycle for data initialization
- Utilizes Angular Router for navigation
- Maintains component state for editing and pagination
- Responsive design with mobile-friendly breakpoints

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.
