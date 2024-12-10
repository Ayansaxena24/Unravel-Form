import React, { useState, useMemo, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { format } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, FormControl, Input, InputLabel, MenuItem, Popover, TextField, Typography } from '@mui/material';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFnsV3';
import * as dateFns from 'date-fns';
import Select from '@mui/material/Select';
import { ToastContainer, toast } from 'react-toastify';
import './index.css'
import 'react-toastify/dist/ReactToastify.css';

// Mock data generation
const generateMockData = () => {
  const scopes = ['Scope 1', 'Scope 2', 'Scope 3'];
  const mockData = [];

  const storedEmissions = localStorage.getItem('emissions');
  if (storedEmissions) {
    return JSON.parse(storedEmissions).map(entry => ({
      ...entry,
      date: new Date(entry.date)  // Ensure date is converted back to Date object
    }));
  }

  for (let i = 0; i < 10000; i++) {
    mockData.push({
      id: i + 1,
      description: `Emission Entry ${i + 1}`,
      scope: scopes[Math.floor(Math.random() * scopes.length)],
      emission: Math.floor(Math.random() * 1000),
      date: new Date(2023, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1)
    });
  }

  localStorage.setItem('emissions', JSON.stringify(mockData));

  return mockData;
};

const EmissionCounter = () => {
  const [emissions, setEmissions] = useState(generateMockData());
  const [newEntry, setNewEntry] = useState({
    description: '',
    scope: 'Scope 1',
    emission: '',
    date: null
  });
  const [formErrors, setFormErrors] = useState({
    description: false,
    emission: false,
    date: false
  })
  const [editFormErrors, setEditFormErrors] = useState({
    description: false,
    emission: false,
    date: false,
  });
  const [editingEntry, setEditingEntry] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [filterScope, setFilterScope] = useState('All');
  const [isStacked, setIsStacked] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [entriesPerPage, setEntriesPerPage] = useState(50);
  const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false);
  const [entryToDelete, setEntryToDelete] = useState(null);
  const [tableFilterScope, setTableFilterScope] = useState('All');
  const [originalEntry, setOriginalEntry] = useState(null);

  useEffect(() => {
    localStorage.setItem('emissions', JSON.stringify(emissions));
  }, [emissions]);

  useEffect(() => {
    if (isStacked && filterScope !== 'All')
        {
            setFilterScope('All')
            toast.error("Stacked view is not supported for individual scopes. Switching to All Scopes.")
        }    
  }, [isStacked])

  useEffect(() => {
    if (localStorage.getItem('isStacked') !== null) {
        const isStacked = localStorage.getItem('isStacked') === 'true';
        setIsStacked(isStacked);
    }
    if (localStorage.getItem('barScope') !== null) {
        console.log(localStorage.getItem('barScope'), "testets");
        setFilterScope(localStorage.getItem('barScope'));
    }
    if (localStorage.getItem('isStacked') !== null) {
        setIsStacked(localStorage.getItem('isStacked') === 'true');
    }
    if (localStorage.getItem('tableFilterScope') !== null) {
        setTableFilterScope(localStorage.getItem('tableFilterScope'));
    }
    if (localStorage.getItem('entriesPerPage') !== null) {
        setEntriesPerPage(parseInt(localStorage.getItem('entriesPerPage')));
    }
    
  }, [])

  // Prepare monthly emissions data
  const prepareMonthlyEmissionsData = () => {
    const monthlyEmissions = Array(12).fill().map((_, monthIndex) => ({
      month: format(new Date(2023, monthIndex), 'MMM'),
      'Scope 1': 0,
      'Scope 2': 0,
      'Scope 3': 0,
      total: 0
    }));

    // Filter emissions based on selected scope before processing
    const filteredEmissionsData = filterScope === 'All' 
      ? emissions 
      : emissions.filter(entry => entry.scope === filterScope);

    filteredEmissionsData.forEach(entry => {
      const monthIndex = entry.date instanceof Date 
        ? entry.date.getMonth() 
        : new Date(entry.date).getMonth();
      
      monthlyEmissions[monthIndex][entry.scope] += entry.emission;
      monthlyEmissions[monthIndex].total += entry.emission;
    });

    return monthlyEmissions;
  };
  const monthlyEmissionsData = prepareMonthlyEmissionsData();

  const addEmissionEntry = () => {
    const errors = {
        description: !newEntry.description,
        emission: !newEntry.emission,
        date: !newEntry.date
    }
    setFormErrors(errors);

    if (Object.values(errors).some(err => err)) {
        toast.error("Please fill all fields");
        return;
    }
    
    const entry = {
      ...newEntry,
      id: Date.now(),
      emission: parseFloat(newEntry.emission)
    };
    setEmissions(prevEmissions => [entry, ...prevEmissions]);
    toast.success("Entry Added");
    resetNewEntry();
  };

  const resetNewEntry = () => {
    setNewEntry({
      description: '',
      scope: 'Scope 1',
      emission: '',
      date: null
    });
    setFormErrors({
        description: false,
        emission: false,
        date: false
      });
  };

  // Update existing entry
  const updateEmissionEntry = () => {
    if (!editingEntry) return;

    const errors = {
        description: !editingEntry.description,
        emission: !editingEntry.emission,
        date: !editingEntry.date
    }

    setEditFormErrors(errors);

    if (Object.values(errors).some(err => err)) {
        toast.error("Please fill all fields");
        return;
    }

    const updatedEmissions = emissions.map(entry => 
      entry.id === editingEntry.id 
        ? { ...editingEntry, emission: parseFloat(editingEntry.emission) } 
        : entry
    );
    
    setEmissions(updatedEmissions);
    toast.success("Entry Updated")
    setEditingEntry(null);
    setOriginalEntry(null);
    setAnchorEl(null);
  };

   // Delete entry with confirmation
   const initializeDeleteEntry = (id) => {
    const entryToDelete = emissions.find(entry => entry.id === id);
    setEntryToDelete(entryToDelete);
    setDeleteConfirmationOpen(true);
  };

  const confirmDeleteEntry = () => {
    if (entryToDelete) {
        setEmissions(prevEmissions => 
            prevEmissions.filter(entry => entry.id !== entryToDelete.id)
          );
      toast.success("Entry Deleted");
      setDeleteConfirmationOpen(false);
      setEntryToDelete(null);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteConfirmationOpen(false);
    setEntryToDelete(null);
  };

  // Reset new entry form
//   const resetNewEntry = () => {
//     setNewEntry({
//       description: '',
//       scope: 'Scope 1',
//       emission: '',
//       date: format(new Date(), 'yyyy-MM-dd')
//     });
//   };

  // Filtered emissions based on scope for chart and table
  const filteredEmissions = useMemo(() => {
    let baseFilteredEmissions = filterScope === 'All' 
      ? emissions 
      : emissions.filter(entry => entry.scope === filterScope);
    
    // Apply additional table filter if different from chart filter
    if (tableFilterScope !== 'All') {
      baseFilteredEmissions = baseFilteredEmissions.filter(entry => entry.scope === tableFilterScope);
    }
    
    return baseFilteredEmissions;
  }, [emissions, filterScope, tableFilterScope]);

  // Paginated emissions
  const paginatedEmissions = useMemo(() => {
    const startIndex = (currentPage - 1) * entriesPerPage;
    return filteredEmissions.slice(startIndex, startIndex + entriesPerPage);
  }, [filteredEmissions, currentPage, entriesPerPage]);

  // Calculate total pages
  const totalPages = Math.ceil(filteredEmissions.length / entriesPerPage);

  // Pagination handlers
  const handleNextPage = () => {
    setCurrentPage(prev => Math.min(prev + 1, totalPages));
  };

  const handlePrevPage = () => {
    setCurrentPage(prev => Math.max(prev - 1, 1));
  };

  // Open popover for editing
  const handleEditOpen = (event, entry) => {
    setAnchorEl(event.currentTarget);
    const entryToEdit = {...entry};
    setEditingEntry(entryToEdit);
    setOriginalEntry(entry);
  };

  // Close popover
  const handleEditClose = () => {
    setEditingEntry(null);
    setAnchorEl(null);
  };

  // Check if any field has changed
  const hasEntryChanged = () => {
    if (!originalEntry || !editingEntry) return false;

    return (
      editingEntry.description !== originalEntry.description ||
      editingEntry.scope !== originalEntry.scope ||
      parseFloat(editingEntry.emission) !== originalEntry.emission ||
      (editingEntry.date instanceof Date ? editingEntry.date : new Date(editingEntry.date)).getTime() !== 
      (originalEntry.date instanceof Date ? originalEntry.date : new Date(originalEntry.date)).getTime()
    );
  };

  // Calculate total emissions and this month's emissions
  const calculateEmissionsSummary = () => {
    const currentDate = new Date();
    const startOfCurrentMonth = dateFns.startOfMonth(currentDate);
    const endOfCurrentMonth = dateFns.endOfMonth(currentDate);

    const totalEmissions = emissions.reduce((sum, entry) => sum + entry.emission, 0);
    
    const thisMonthEmissions = emissions
      .filter(entry => {
        const entryDate = new Date(entry.date);
        return entryDate >= startOfCurrentMonth && entryDate <= endOfCurrentMonth;
      })
      .reduce((sum, entry) => sum + entry.emission, 0);

    return {
      totalEmissions,
      thisMonthEmissions
    };
  };

  const { totalEmissions, thisMonthEmissions } = calculateEmissionsSummary();

  const open = Boolean(anchorEl);
  const popoverId = open ? 'edit-popover' : undefined;

  const resetData = () => {
    localStorage.removeItem('emissions');
    localStorage.removeItem('barScope');
    localStorage.removeItem('isStacked');
    localStorage.removeItem('tableFilterScope');
    localStorage.removeItem('entriesPerPage');
    toast.success("Data Reset");
    window.location.reload();
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <div className="flex sm:justify-start sm:w-[80%] w-full sm:absolute left-8 top-4 justify-center">
        <img
          src="https://cdn.prod.website-files.com/6533d795f73c37686196a031/6537456cd38967c933008276_Logo-Horizontal%20Black%20Text.svg"
          alt="React Logo"
          className="h-[20%] w-[22%] inline-block min-w-[240px] "
        />
      </div>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5 }}
        className="container mx-auto p-4 space-y-6 mt-16 max-w-[1280px]"
      >
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1, duration: 1.0 }}
            className="bg-white shadow-md rounded-lg p-6 flex flex-col items-center"
          >
            <div
            style={{
                background:
                  "repeating-linear-gradient(135deg, #79cf8c, #00bbb9 50%, #8080ea)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                display: "inline-block",
              }}>
            <h3 className="text-lg font-semibold mb-2" >Total Emissions</h3>
            </div>
            <div
              className="text-3xl font-bold "
              style={{
                background:
                  "repeating-linear-gradient(135deg, #79cf8c, #00bbb9 50%, #8080ea)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                display: "inline-block",
              }}
            >
              {totalEmissions.toFixed(2)} kg CO2-e
            </div>
            <p className="text-sm text-gray-500 mt-2">Across all entries</p>
          </motion.div>

          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 1.0 }}
            className="bg-white shadow-md rounded-lg p-6 flex flex-col items-center"
            
          >
            <div
            style={{
                background:
                  "repeating-linear-gradient(135deg, #79cf8c, #00bbb9 50%, #8080ea)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                display: "inline-block",
              }}>
            <h3 className="text-lg font-semibold mb-2">
              This Month's Emissions
            </h3>
            </div>
            <div
              className="text-3xl font-bold"
              style={{
                background:
                  "repeating-linear-gradient(135deg, #79cf8c, #00bbb9 50%, #8080ea)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                display: "inline-block",
              }}
            >
              {thisMonthEmissions.toFixed(2)} kg CO2-e
            </div>
            <p className="text-sm text-gray-500 mt-2">
              {format(new Date(), "MMMM yyyy")}
            </p>
          </motion.div>
        </div>
        {/* Entry Form Component */}
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: "keyframes", stiffness: 100, duration: 1.0 }}
          className="bg-white shadow-md rounded-lg p-6"
        >
          <h2 className="text-xl font-semibold mb-4">Emission Entry Form</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <TextField
              label="Description"
              variant="outlined"
              error={formErrors.description}
              helperText={
                formErrors.description ? "Description is required" : ""
              }
              className="w-full px-3 py-2 border rounded-md"
              value={newEntry.description}
              onChange={(e) => {
                setNewEntry({ ...newEntry, description: e.target.value });
                setFormErrors({ ...formErrors, description: false });
              }}
            />
            <Select
              className="w-full border rounded-md max-h-[56px] text-left"
              value={newEntry.scope}
              onChange={(e) =>
                setNewEntry({ ...newEntry, scope: e.target.value })
              }
            >
              <MenuItem value="Scope 1">Scope 1</MenuItem>
              <MenuItem value="Scope 2">Scope 2</MenuItem>
              <MenuItem value="Scope 3">Scope 3</MenuItem>
            </Select>
            <TextField
              type="number"
              label="Emission (kg CO2-e)"
              error={formErrors.emission}
              helperText={formErrors.emission ? "Emission is required" : ""}
              className="w-full px-3 py-2 border rounded-md"
              value={newEntry.emission}
              onChange={(e) => {
                setNewEntry({ ...newEntry, emission: e.target.value });
                setFormErrors({ ...formErrors, emission: false });
              }}
              InputProps={{
                inputProps: {
                  min: 0,
                },
              }}
            />
            {/* <input 
            type="date"
            className="w-full px-3 py-2 border rounded-md"
            value={newEntry.date}
            onChange={(e) => setNewEntry({...newEntry, date: e.target.value})}
          /> */}
            <DatePicker
              label="Entry Date"
              disableFuture
              value={newEntry.date}
              onChange={(newDate) => {
                if (newDate && newDate <= new Date()) {
                  setNewEntry({ ...newEntry, date: newDate });
                  setFormErrors({ ...formErrors, date: false });
                } else {
                  setNewEntry({ ...newEntry, date: new Date() });
                  setFormErrors({ ...formErrors, date: true });
                }
              }}
              renderInput={(params) => (
                <input
                  {...params}
                  className="w-full px-3 py-2 border rounded-md"
                />
              )}
              slotProps={{
                textField: {
                  error: formErrors.date,
                  helperText: formErrors.date
                    ? "Please select a valid date (up to today)."
                    : "",
                  fullWidth: true,
                  variant: "outlined",
                },
              }}
            />
            <motion.div className="flex space-x-2">
              <button
                onClick={addEmissionEntry}
                className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
              >
                Add Entry
              </button>
            </motion.div>
          </div>
        </motion.div>

        {/* Emissions Chart Component */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 1.0 }}
          className="bg-white shadow-md rounded-lg p-6 overflow-auto"
        >
          <div className="flex justify-between items-center mb-4 min-w-[624px]">
            <h2 className="text-xl font-semibold">Monthly Emissions</h2>
            <div className="flex items-center space-x-4">
              <Select
                value={filterScope}
                onChange={(e) => {
                    if (isStacked && e.target.value !== 'All') 
                        {
                            setFilterScope('All')
                            toast.error("Stacked view is not supported for individual scopes. Switching to All Scopes.")
                            return;
                        }
                  setFilterScope(e.target.value);
                  setCurrentPage(1);
                  localStorage.setItem('barScope', e.target.value);
                }}
                className="rounded-md"
              >
                <MenuItem value="All">All Scopes</MenuItem>
                <MenuItem value="Scope 1">Scope 1</MenuItem>
                <MenuItem value="Scope 2">Scope 2</MenuItem>
                <MenuItem value="Scope 3">Scope 3</MenuItem>
              </Select>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={isStacked}
                  onChange={() => 
                    {
                        setIsStacked(!isStacked);
                        localStorage.setItem('isStacked', !isStacked);
                    }
                }
                  className="form-checkbox"
                />
                <span>Stacked View</span>
              </div>
            </div>
          </div>
          <div className="h-[400px] w-full">
            <ResponsiveContainer width="100%" height="100%" minWidth="624px">
              <BarChart data={monthlyEmissionsData} barSize={isStacked ? 50 : 14} minWidth="624px">
                <XAxis dataKey="month" />
                <YAxis
                  label={{
                    value: "Total Absolute Emissions (t CO₂-e)",
                    angle: -90,
                    position: "insideLeft",
                    offset: 20, 
                    style: {
                      textAnchor: "middle",
                      fontSize: "20px",
                    },
                  }}
                  width={120} 
                />
                <Tooltip />
                <Legend />
                {isStacked ? (
                  <>
                    <Bar
                      dataKey="Scope 1"
                      stackId="a"
                      fill="#8884d8"
                      radius={[0, 0, 0, 0]}
                    />
                    <Bar
                      dataKey="Scope 2"
                      stackId="a"
                      fill="#82ca9d"
                      radius={[0, 0, 0, 0]}
                    />
                    <Bar
                      dataKey="Scope 3"
                      stackId="a"
                      fill="#ffc658"
                      radius={[10, 10, 0, 0]}
                    />
                  </>
                ) : (
                  <>
                    <Bar
                      dataKey="Scope 1"
                      fill="#8884d8"
                      radius={[10, 10, 0, 0]}
                    />
                    <Bar
                      dataKey="Scope 2"
                      fill="#82ca9d"
                      radius={[10, 10, 0, 0]}
                    />
                    <Bar
                      dataKey="Scope 3"
                      fill="#ffc658"
                      radius={[10, 10, 0, 0]}
                    />
                  </>
                )}
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Emissions List Component */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{
            type: "keyframes",
            stiffness: 100,
            delay: 0.3,
            duration: 1.0,
          }}
          className="bg-white shadow-md rounded-lg p-6"
        >
          <div className="flex justify-between items-center mb-4 sm:flex-row flex-col">
            <h2 className="text-xl font-semibold">Emissions List</h2>
            <div className='flex justify-between space-x-4 sm:mt-0 mt-4'>
            <Select
              value={tableFilterScope}
              onChange={(e) => {
                setTableFilterScope(e.target.value);
                setCurrentPage(1);
                localStorage.setItem('tableFilterScope', e.target.value);
              }}
              className="rounded-md h-10 min-h-[40px]"
            >
              <MenuItem value="All">All Scopes</MenuItem>
              <MenuItem value="Scope 1">Scope 1</MenuItem>
              <MenuItem value="Scope 2">Scope 2</MenuItem>
              <MenuItem value="Scope 3">Scope 3</MenuItem>
            </Select>
            
            <FormControl fullWidth>
            <InputLabel>Rows per Page</InputLabel>    
            <Select
              value={entriesPerPage}
              label="Rows per Page"
              onChange={(e) => {
                setEntriesPerPage(e.target.value);
                setCurrentPage(1);
                localStorage.setItem('entriesPerPage', e.target.value);
              }}
              className="rounded-md h-10 min-h-[40px] w-28"
            >
              <MenuItem value={20}>20</MenuItem>
              <MenuItem value={50}>50</MenuItem>
              <MenuItem value={100}>100</MenuItem>
              <MenuItem value={200}>200</MenuItem>
              </Select>
              </FormControl>
            </div>
            {/* </div> */}
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-100">
                  <th className="p-2 text-left">Description</th>
                  <th className="p-2 text-left">Scope</th>
                  <th className="p-2 text-center">Emission (kg CO2-e)</th>
                  <th className="p-2 text-left">Date</th>
                  <th className="p-2 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedEmissions.map((entry) => (
                  <motion.tr
                    key={entry.id}
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 50 }}
                    transition={{ type: "tween" }}
                    className="border-b hover:bg-gray-50"
                  >
                    <td className="p-2">{entry.description}</td>
                    <td className="p-2">{entry.scope}</td>
                    <td className="p-2 text-center">
                      {entry.emission.toFixed(2)}
                    </td>
                    <td className="p-2 text-left">
                      {format(new Date(entry.date), "PPP")}
                    </td>
                    <td className="p-2 text-center">
                      <div className="flex justify-center space-x-2">
                        <motion.button
                          whileHover={{ scale: 1.0 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={(e) => handleEditOpen(e, entry)}
                          className="text-blue-500 border border-blue-500 px-2 py-1 rounded-lg hover:bg-blue-500 hover:text-white"
                        >
                          Edit
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.0 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => initializeDeleteEntry(entry.id)}
                          className="text-red-500 border border-red-500 px-2 py-1 rounded-lg hover:bg-red-500 hover:text-white"
                        >
                          Delete
                        </motion.button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Delete Confirmation Dialog */}
          <Dialog
            open={deleteConfirmationOpen}
            onClose={handleDeleteCancel}
            aria-labelledby="delete-dialog-title"
            aria-describedby="delete-dialog-description"
          >
            <DialogTitle id="delete-dialog-title">
              {"Confirm Deletion"}
            </DialogTitle>
            <DialogContent>
              <DialogContentText id="delete-dialog-description">
                Are you sure you want to delete the emission entry "
                {entryToDelete?.description}"? This action cannot be undone.
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleDeleteCancel} color="primary">
                Cancel
              </Button>
              <Button onClick={confirmDeleteEntry} color="error" autoFocus>
                Delete
              </Button>
            </DialogActions>
          </Dialog>

          {/* Popover for Editing */}
          <Popover
            id={popoverId}
            open={open}
            anchorEl={anchorEl}
            onClose={handleEditClose}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "center",
            }}
            transformOrigin={{
              vertical: "top",
              horizontal: "center",
            }}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 300 }}
              className="p-6 w-80 space-y-4"
            >
              <h2 className="text-xl font-semibold mb-4">
                Edit Emission Entry
              </h2>
              <div className="space-y-4">
                <TextField
                  type="text"
                  placeholder="Description"
                  className="w-full px-3 py-2 border rounded-md"
                  error={editFormErrors.description}
                  helperText={
                    editFormErrors.description ? "Description is required" : ""
                  }
                  value={editingEntry?.description || ""}
                  onChange={(e) => {
                    setEditingEntry({
                      ...editingEntry,
                      description: e.target.value,
                    });
                    setEditFormErrors({
                      ...editFormErrors,
                      description: false,
                    });
                  }}
                />
                <Select
                  className="w-full border rounded-md"
                  value={editingEntry?.scope || "Scope 1"}
                  onChange={(e) =>
                    setEditingEntry({ ...editingEntry, scope: e.target.value })
                  }
                >
                  <MenuItem value="Scope 1">Scope 1</MenuItem>
                  <MenuItem value="Scope 2">Scope 2</MenuItem>
                  <MenuItem value="Scope 3">Scope 3</MenuItem>
                </Select>
                <TextField
                  type="number"
                  placeholder="Emission (kg CO2-e)"
                  className="w-full px-3 py-2 border rounded-md"
                  error={editFormErrors.emission}
                  helperText={
                    editFormErrors.emission ? "Emission is required" : ""
                  }
                  value={editingEntry?.emission || ""}
                  onChange={(e) => {
                    setEditingEntry({
                      ...editingEntry,
                      emission: e.target.value,
                    });
                    setEditFormErrors({ ...editFormErrors, emission: false });
                  }}
                />
                <DatePicker
                  label="Entry Date"
                  disableFuture
                  value={editingEntry?.date || new Date()}
                  onChange={(newDate) => {
                    if (newDate && newDate <= new Date()) {
                      setEditingEntry({ ...editingEntry, date: newDate });
                      setEditFormErrors({ ...editFormErrors, date: false });
                    } else {
                      setEditingEntry({ ...editingEntry, date: new Date() });
                      setEditFormErrors({ ...editFormErrors, date: true });
                    }
                  }}
                  renderInput={(params) => (
                    <input
                      {...params}
                      className="w-full px-3 py-2 border rounded-md"
                    />
                  )}
                  error={editFormErrors.date}
                  helperText={
                    editFormErrors.date
                      ? "Please select a valid date (up to today)."
                      : ""
                  }
                  slotProps={{
                    textField: {
                      error: editFormErrors.date,
                      helperText: editFormErrors.date ? "Date is required" : "",
                      fullWidth: true,
                      variant: "outlined",
                    },
                  }}
                />
                <div className="flex space-x-2">
                  <button
                  disabled={!hasEntryChanged()}
                    onClick={updateEmissionEntry}
                    className={`px-4 py-2 text-white rounded-md flex-1 ${!hasEntryChanged() ? 'bg-gray-400' : 'bg-blue-500 hover:bg-blue-600'}`}
                  >
                    Update
                  </button>
                  <button
                    onClick={handleEditClose}
                    className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 flex-1"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </motion.div>
          </Popover>

          {/* Simplified Pagination */}
          <div className='flex justify-between items-center w-[95%] flex-col sm:flex-row'>
            <div></div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="flex justify-center items-center mt-4 space-x-4"
          >
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handlePrevPage}
              disabled={currentPage === 1}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded disabled:opacity-50"
            >
              Previous
            </motion.button>

            <div className="text-gray-700">
              Page {currentPage} of {totalPages}
            </div>

            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded disabled:opacity-50"
            >
              Next
            </motion.button>
            <ToastContainer />
          </motion.div>
          <div>
          <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={resetData}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded mt-4"
            >
              Reset Data
            </motion.button>
          </div>
          </div>
        </motion.div>
      </motion.div>
    </LocalizationProvider>
  );
};

export default EmissionCounter;