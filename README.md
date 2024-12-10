# Emission Counter

This React application allows users to manage and track carbon emissions for business operations. Users can add, edit, view, and analyze emission entries using an intuitive interface. The project includes a tabular view for data entries and a dynamic bar chart to visualize emissions over time.

---

## Features

### 1. **Add Emission Entries**
- Users can log emission data by providing the following details:
  - **Description**: Brief detail of the emission source.
  - **Scope**: Selectable options (Scope 1, Scope 2, Scope 3).
  - **Emission**: Numeric value (in kg CO2-e).
  - **Date**: Date of the emission event.

![Add Entry](https://github.com/user-attachments/assets/example-add-entry.png)

---

### 2. **Table View**
- Displays all logged entries in a structured table format.
- Allows users to:
  - View all emission entries.
  - Edit existing entries.
  - Sort and filter entries for better analysis.

![Table View](https://github.com/user-attachments/assets/example-table-view.png)

---

### 3. **Bar Chart Visualization**
- A dynamic bar chart visualizes total emissions for each month of the year.
- Features include:
  - **Stacked View Toggle**: Switch between standard and stacked bar views based on Scope.
  - **Scope Filter**: Dropdown menu to filter chart data by Scope.

![Bar Chart](https://github.com/user-attachments/assets/example-bar-chart.png)

---

### 4. **Mock API Integration**
- CRUD operations mimic real API endpoints.
- Data is stored in-memory or local storage for seamless interaction.

---

## Technologies Used

### Frontend
- **React**: Core framework for building the application.
- **React Chart Library**: Used for visualizing emissions data.
- **Tailwind CSS**: For responsive and utility-based styling.
- **React Table**: To manage and display data in a table view.
- **React-Select**: For dropdown and filter functionalities.

### Backend
- **Mock API Integration**: Handles CRUD operations without an actual backend, storing data in-memory or local storage.

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
   ```bash
   git clone https://github.com/your-username/Emission-Counter.git
