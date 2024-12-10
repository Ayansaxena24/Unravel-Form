# Emission Counter

This React application allows users to manage and track carbon emissions for business operations. Users can add, edit, view, and analyze emission entries using an intuitive interface. The project includes a tabular view for data entries and a dynamic bar chart to visualize emissions over time.

![Dashboard 1](https://github.com/user-attachments/assets/88e80e0f-5913-45b7-a046-a18c8f7d2ae9)

---

## Features

### 1. **Add Emission Entries**
- Users can log emission data by providing the following details:
  - **Description**: Brief detail of the emission source.
  - **Scope**: Selectable options (Scope 1, Scope 2, Scope 3).
  - **Emission**: Numeric value (in kg CO2-e).
  - **Date**: Date of the emission event.

![Form](https://github.com/user-attachments/assets/ecc47b11-194e-4f4f-bd7a-150bca008fe6)

---

### 2. **Table View**
- Displays all logged entries in a structured table format.
- Allows users to:
  - View all emission entries.
  - Edit existing entries.
  - Filter entries on the basis of Scope for better analysis.
  - Delete entries.

![Table](https://github.com/user-attachments/assets/f06e2e4f-eccf-4493-b4a7-7aef57095203)
![Confirm Deletion modal](https://github.com/user-attachments/assets/f3c6be04-36af-4c1b-940b-4fff3749dafd)


---

### 3. **Bar Chart Visualization**
- A dynamic bar chart visualizes total emissions for each month of the year.
- Features include:
  - **Stacked View Toggle**: Switch between standard and stacked bar views based on Scope.
  - **Scope Filter**: Dropdown menu to filter chart data by Scope.

![Bar Graph](https://github.com/user-attachments/assets/88ce2392-51e1-4498-9b09-7b293278293c)


---

### 4. **Mock API Integration**
- CRUD operations mimic real API endpoints.
- Data is stored in Local Storage, and is retrieved from the Local Storage as soon as the component mounts.

  ![LocalStorage](https://github.com/user-attachments/assets/425fca15-2bf0-47f0-9fae-96c06ef7fc69)


---

## Bonus Features

### 1. **Edit Emission Entries**
- Users can directly edit any existing emission entry from the table view.

  ![Edit Popover](https://github.com/user-attachments/assets/4724fdfc-ce09-4e34-8655-9033ba5f6362)


### 2. **Toggle Chart View**
- A toggle button allows switching between standard bar charts and stacked bar charts for better comparative analysis across scopes.

  ![Stacked Bar Graph](https://github.com/user-attachments/assets/abffd439-067f-4f39-bc77-9ee31f916037)
![Individual Scope Bar Graph](https://github.com/user-attachments/assets/68ed7c77-e5b3-4941-82f0-cc0dbcac9c28)


### 3. **Filter by Scope**
- A dropdown menu filters the bar chart to focus on specific scopes (Scope 1, Scope 2, or Scope 3).

  ![Individual Scope Bar Graph - done](https://github.com/user-attachments/assets/ca7506c8-550f-4ae3-a892-ec7c491111b3)

- Similarly, a filter by scope option is available in the Table as well.

   ![Scope dropdown table](https://github.com/user-attachments/assets/19e40243-4951-4bbd-b741-33a81a86e743)



### 4. **Responsive Design**
- The entire application is designed to work seamlessly across desktop and mobile devices.

  ![Responsive Screen 1](https://github.com/user-attachments/assets/e3a0bc39-4d33-499d-8b93-049a661d3ff2)
  
- The Graph can be scrolled in Mobile View
  
![Responsive Screen 2](https://github.com/user-attachments/assets/2b2535f4-d2d1-4efd-a5ac-a88313475683)

![Responsive Screen 3](https://github.com/user-attachments/assets/1e063352-8698-4fb1-8704-b98a2e57853e)

### 5. **Error Handling and Toasts**
- All user actions are validated with clear error messages for invalid input.
- Success, warning, and error messages are displayed using toast notifications for a seamless user experience.
- Update button in the Edit popover is enabled only if there is a change as compared to the already existing data.
- If the bar graph is already in the stacked state, then only the 'All Emissions' scope will be displayed.

  ![Toast for Successfull Entry](https://github.com/user-attachments/assets/d8340474-a103-497c-845b-4ae21d21f72f)
![Warning Toast](https://github.com/user-attachments/assets/2068e18a-f44b-42de-a82a-0d0289a7de58)
![Error Handling and Toast](https://github.com/user-attachments/assets/49bc170f-6892-4564-bb2a-fb3aa7e0725b)



---

### 6. **Pagination**
- The table view supports pagination, ensuring smooth performance and usability when managing large datasets.

  ![Table](https://github.com/user-attachments/assets/d3e417cb-54c8-4336-9fc8-706483eda2bc)

- Users can navigate between pages to view entries incrementally.
    
  ![Pagination](https://github.com/user-attachments/assets/c6fb2060-9a6b-4e2f-ba01-33497ff1fcd9)

- Configurable page sizes allow users to control the number of entries displayed per page.
    
  ![Rows Per Page Dropdown](https://github.com/user-attachments/assets/0e494331-d76e-4913-82c4-bbef7773540d)




## Technologies Used

### Frontend
- **React**: Core framework for building the application.
- **Recharts**: For dynamic and responsive data visualization in the bar chart.
- **Material-UI (MUI)**: For modern, accessible UI components, such as dialogs, buttons, and form controls.
- **React Toastify**: For user-friendly toast notifications and error handling.
- **Framer Motion**: To implement smooth animations and transitions for dialogs and UI elements.
- **Date-fns**: For formatting and manipulating dates throughout the application.
- **MUI X Date Pickers**: For user-friendly date selection with advanced localization and customization options.
- **Tailwind CSS**: For utility-based, responsive styling throughout the application.

---

### Backend
- **Mock API Integration**: Handles CRUD operations without an actual backend, storing data in local storage.
- **Reset Button**: If you want to use the application with new set of data, you can click on the Reset Button on the bottom of the page.

![Pagination - done](https://github.com/user-attachments/assets/da2d9d88-58dc-42c6-9ff5-bcf78b935327)


---

### Features Enabled by These Libraries
1. **Dynamic Data Visualization**
   - Recharts provides an interactive bar chart that dynamically visualizes monthly emissions.
2. **Interactive UI Components**
   - MUI simplifies the creation of dialogs, date pickers, and input fields for a seamless user experience.
3. **Enhanced User Feedback**
   - React Toastify ensures clear notifications, improving error handling and feedback mechanisms.
4. **Smooth Animations**
   - Framer Motion adds elegant transitions and animations for better UI aesthetics.
5. **Efficient Date Management**
   - Date-fns, paired with MUI Date Pickers, ensures precise and localized date handling.
6. **Flexible Styling**
   - Tailwind CSS offers a scalable and responsive styling system.

This combination of tools ensures a responsive, feature-rich, and user-friendly application experience.

---


## Getting Started

Follow these steps to set up and run the project on your local machine.

### Prerequisites

Ensure you have the following installed:
- **Node.js**: [Download and install Node.js](https://nodejs.org/)
- **npm** or **yarn**: Comes with Node.js or can be installed separately.
- **Git**: [Download and install Git](https://git-scm.com/)

---

### Installation

1. **Clone the Repository**  
   Clone the project to your local machine using the following command:
   
   ```bash
   git clone https://github.com/Ayansaxena24/Unravel-Form.git
   ````
2. **Navigate to the Project Directory**
   Move into the project's root directory:
   
   ```bash
   cd unravelcarbon
   ````

3. **Install Dependencies**
   Install all required packages using npm or yarn:

   ```bash
   npm install
   ````

   Or, if you use yarn:

   ```bash
   yarn
   ````

### Running The Application


1. **Run the Development Server**  
   To start the React application in development mode:
   
   ```bash
   npm run dev
   ````

   Or, for yarn:

    ```bash
   yarn start
   ````

    Open your browser and navigate to http://localhost:3000 (or http://localhost:5173 in some cases)
