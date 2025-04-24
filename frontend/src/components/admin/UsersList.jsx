// UsersList.jsx
import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  IconButton,
  Chip,
  TextField,
  InputAdornment,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  CircularProgress,
  Tooltip,
  Alert,
  Snackbar
} from '@mui/material';
import {
  Search as SearchIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Block as BlockIcon,
  CheckCircle as CheckCircleIcon,
  Refresh as RefreshIcon,
  FilterList as FilterListIcon
} from '@mui/icons-material';
import { collection, getDocs, doc, updateDoc, deleteDoc, query, where, orderBy } from 'firebase/firestore';
import { db } from '../../firebase';

const UsersList = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [roleFilter, setRoleFilter] = useState('all');
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortDirection, setSortDirection] = useState('desc');

  // Dialog states
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [editUserData, setEditUserData] = useState({
    role: '',
    status: '',
    subscriptionTier: ''
  });

  // Alert state
  const [alert, setAlert] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    // Apply filters and sorting whenever the filter states change
    applyFiltersAndSort();
  }, [searchTerm, statusFilter, roleFilter, sortBy, sortDirection, users]);

  const fetchUsers = async () => {
    try {
      setLoading(true);

      // Create a query against the users collection
      let usersQuery = collection(db, "users");

      // Add any initial filters if needed
      // For example:
      // usersQuery = query(usersQuery, where("deleted", "==", false));

      const usersSnapshot = await getDocs(usersQuery);

      const usersData = usersSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        // Add placeholder data for demo purposes
        lastLogin: doc.data().lastLogin || new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000),
        status: doc.data().status || (Math.random() > 0.2 ? 'active' : 'inactive'),
        role: doc.data().role || (Math.random() > 0.9 ? 'admin' : (Math.random() > 0.7 ? 'premium' : 'basic')),
        createdAt: doc.data().createdAt || new Date(Date.now() - Math.floor(Math.random() * 90) * 24 * 60 * 60 * 1000),
        subscriptionTier: doc.data().subscriptionTier || (Math.random() > 0.7 ? 'premium' : 'free')
      }));

      setUsers(usersData);
      setFilteredUsers(usersData);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching users:", err);
      setError("Failed to load users. Please try again later.");
      setLoading(false);
    }
  };

  const applyFiltersAndSort = () => {
    let result = [...users];

    // Apply search filter
    if (searchTerm) {
      result = result.filter(user =>
        user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.displayName?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply status filter
    if (statusFilter !== 'all') {
      result = result.filter(user => user.status === statusFilter);
    }

    // Apply role filter
    if (roleFilter !== 'all') {
      result = result.filter(user => user.role === roleFilter);
    }

    // Apply sorting
    result.sort((a, b) => {
      let comparison = 0;

      switch (sortBy) {
        case 'email':
          comparison = a.email?.localeCompare(b.email);
          break;
        case 'displayName':
          comparison = a.displayName?.localeCompare(b.displayName);
          break;
        case 'role':
          comparison = a.role?.localeCompare(b.role);
          break;
        case 'status':
          comparison = a.status?.localeCompare(b.status);
          break;
        case 'lastLogin':
          comparison = (new Date(a.lastLogin) - new Date(b.lastLogin));
          break;
        case 'createdAt':
        default:
          comparison = (new Date(a.createdAt) - new Date(b.createdAt));
          break;
      }

      return sortDirection === 'asc' ? comparison : -comparison;
    });

    setFilteredUsers(result);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
    setPage(0);
  };

  const handleStatusFilterChange = (event) => {
    setStatusFilter(event.target.value);
    setPage(0);
  };

  const handleRoleFilterChange = (event) => {
    setRoleFilter(event.target.value);
    setPage(0);
  };

  const handleSortChange = (column) => {
    if (sortBy === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortDirection('asc');
    }
    setPage(0);
  };

  const handleEditClick = (user) => {
    setCurrentUser(user);
    setEditUserData({
      role: user.role || '',
      status: user.status || '',
      subscriptionTier: user.subscriptionTier || ''
    });
    setOpenEditDialog(true);
  };

  const handleEditChange = (event) => {
    const { name, value } = event.target;
    setEditUserData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleEditSubmit = async () => {
    try {
      // Update user in Firestore
      const userRef = doc(db, "users", currentUser.id);
      await updateDoc(userRef, editUserData);

      // Update local state
      const updatedUsers = users.map(user =>
        user.id === currentUser.id ? { ...user, ...editUserData } : user
      );
      setUsers(updatedUsers);

      setAlert({
        open: true,
        message: "User updated successfully",
        severity: "success"
      });

      setOpenEditDialog(false);
    } catch (err) {
      console.error("Error updating user:", err);
      setAlert({
        open: true,
        message: "Failed to update user",
        severity: "error"
      });
    }
  };

  const handleDeleteClick = (user) => {
    setCurrentUser(user);
    setOpenDeleteDialog(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      // Delete user from Firestore
      await deleteDoc(doc(db, "users", currentUser.id));

      // Update local state
      setUsers(users.filter(user => user.id !== currentUser.id));

      setAlert({
        open: true,
        message: "User deleted successfully",
        severity: "success"
      });

      setOpenDeleteDialog(false);
    } catch (err) {
      console.error("Error deleting user:", err);
      setAlert({
        open: true,
        message: "Failed to delete user",
        severity: "error"
      });
    }
  };

  const handleToggleStatus = async (user) => {
    try {
      const newStatus = user.status === 'active' ? 'inactive' : 'active';

      // Update user in Firestore
      const userRef = doc(db, "users", user.id);
      await updateDoc(userRef, { status: newStatus });

      // Update local state
      const updatedUsers = users.map(u =>
        u.id === user.id ? { ...u, status: newStatus } : u
      );
      setUsers(updatedUsers);

      setAlert({
        open: true,
        message: `User ${newStatus === 'active' ? 'activated' : 'deactivated'} successfully`,
        severity: "success"
      });
    } catch (err) {
      console.error("Error toggling user status:", err);
      setAlert({
        open: true,
        message: "Failed to update user status",
        severity: "error"
      });
    }
  };

  const handleAlertClose = () => {
    setAlert({
      ...alert,
      open: false
    });
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 5 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ p: { xs: 2, md: 3 } }}>
      <Typography variant="h5" component="h2" gutterBottom fontWeight="bold">
        User Management
      </Typography>

      {/* Filters Row */}
      <Paper sx={{ p: 2, mb: 3, display: 'flex', flexDirection: { xs: 'column', md: 'row' }, alignItems: { xs: 'stretch', md: 'center' }, gap: 2 }}>
        {/* Search */}
        <TextField
          variant="outlined"
          placeholder="Search users..."
          value={searchTerm}
          onChange={handleSearchChange}
          sx={{ flexGrow: 1 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
            size: 'small'
          }}
        />

        {/* Status Filter */}
        <FormControl variant="outlined" sx={{ minWidth: 120 }} size="small">
          <InputLabel id="status-filter-label">Status</InputLabel>
          <Select
            labelId="status-filter-label"
            value={statusFilter}
            onChange={handleStatusFilterChange}
            label="Status"
          >
            <MenuItem value="all">All Statuses</MenuItem>
            <MenuItem value="active">Active</MenuItem>
            <MenuItem value="inactive">Inactive</MenuItem>
          </Select>
        </FormControl>

        {/* Role Filter */}
        <FormControl variant="outlined" sx={{ minWidth: 120 }} size="small">
          <InputLabel id="role-filter-label">Role</InputLabel>
          <Select
            labelId="role-filter-label"
            value={roleFilter}
            onChange={handleRoleFilterChange}
            label="Role"
          >
            <MenuItem value="all">All Roles</MenuItem>
            <MenuItem value="admin">Admin</MenuItem>
            <MenuItem value="premium">Premium</MenuItem>
            <MenuItem value="basic">Basic</MenuItem>
          </Select>
        </FormControl>

        {/* Refresh Button */}
        <Tooltip title="Refresh users">
          <IconButton onClick={fetchUsers} size="small" sx={{ ml: { xs: 0, md: 'auto' } }}>
            <RefreshIcon />
          </IconButton>
        </Tooltip>
      </Paper>

      {/* Users Table */}
      <Paper sx={{ width: '100%', overflow: 'hidden' }}>
        <TableContainer sx={{ maxHeight: 440 }}>
          <Table stickyHeader aria-label="users table">
            <TableHead>
              <TableRow>
                <TableCell
                  onClick={() => handleSortChange('displayName')}
                  sx={{ cursor: 'pointer', fontWeight: 'bold' }}
                >
                  Name
                  {sortBy === 'displayName' && (
                    <FilterListIcon
                      fontSize="small"
                      sx={{
                        ml: 1,
                        transform: sortDirection === 'desc' ? 'rotate(180deg)' : 'none',
                        verticalAlign: 'middle'
                      }}
                    />
                  )}
                </TableCell>
                <TableCell
                  onClick={() => handleSortChange('email')}
                  sx={{ cursor: 'pointer', fontWeight: 'bold' }}
                >
                  Email
                  {sortBy === 'email' && (
                    <FilterListIcon
                      fontSize="small"
                      sx={{
                        ml: 1,
                        transform: sortDirection === 'desc' ? 'rotate(180deg)' : 'none',
                        verticalAlign: 'middle'
                      }}
                    />
                  )}
                </TableCell>
                <TableCell
                  onClick={() => handleSortChange('role')}
                  sx={{ cursor: 'pointer', fontWeight: 'bold' }}
                >
                  Role
                  {sortBy === 'role' && (
                    <FilterListIcon
                      fontSize="small"
                      sx={{
                        ml: 1,
                        transform: sortDirection === 'desc' ? 'rotate(180deg)' : 'none',
                        verticalAlign: 'middle'
                      }}
                    />
                  )}
                </TableCell>
                <TableCell
                  onClick={() => handleSortChange('status')}
                  sx={{ cursor: 'pointer', fontWeight: 'bold' }}
                >
                  Status
                  {sortBy === 'status' && (
                    <FilterListIcon
                      fontSize="small"
                      sx={{
                        ml: 1,
                        transform: sortDirection === 'desc' ? 'rotate(180deg)' : 'none',
                        verticalAlign: 'middle'
                      }}
                    />
                  )}
                </TableCell>
                <TableCell
                  onClick={() => handleSortChange('createdAt')}
                  sx={{ cursor: 'pointer', fontWeight: 'bold' }}
                >
                  Joined
                  {sortBy === 'createdAt' && (
                    <FilterListIcon
                      fontSize="small"
                      sx={{
                        ml: 1,
                        transform: sortDirection === 'desc' ? 'rotate(180deg)' : 'none',
                        verticalAlign: 'middle'
                      }}
                    />
                  )}
                </TableCell>
                <TableCell
                  onClick={() => handleSortChange('lastLogin')}
                  sx={{ cursor: 'pointer', fontWeight: 'bold' }}
                >
                  Last Login
                  {sortBy === 'lastLogin' && (
                    <FilterListIcon
                      fontSize="small"
                      sx={{
                        ml: 1,
                        transform: sortDirection === 'desc' ? 'rotate(180deg)' : 'none',
                        verticalAlign: 'middle'
                      }}
                    />
                  )}
                </TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredUsers
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((user) => (
                  <TableRow key={user.id} hover>
                    <TableCell>
                      {user.displayName || 'N/A'}
                    </TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <Chip
                        label={user.role}
                        size="small"
                        color={
                          user.role === 'admin' ? 'error' :
                          user.role === 'premium' ? 'primary' :
                          'default'
                        }
                        variant={user.role === 'basic' ? 'outlined' : 'filled'}
                      />
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={user.status}
                        size="small"
                        color={user.status === 'active' ? 'success' : 'default'}
                        variant={user.status === 'inactive' ? 'outlined' : 'filled'}
                      />
                    </TableCell>
                    <TableCell>
                      {new Date(user.createdAt?.toDate?.() || user.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      {new Date(user.lastLogin?.toDate?.() || user.lastLogin).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <Tooltip title="Edit user">
                          <IconButton
                            size="small"
                            color="primary"
                            onClick={() => handleEditClick(user)}
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title={user.status === 'active' ? 'Deactivate user' : 'Activate user'}>
                          <IconButton
                            size="small"
                            color={user.status === 'active' ? 'default' : 'success'}
                            onClick={() => handleToggleStatus(user)}
                          >
                            {user.status === 'active' ?
                              <BlockIcon fontSize="small" /> :
                              <CheckCircleIcon fontSize="small" />
                            }
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete user">
                          <IconButton
                            size="small"
                            color="error"
                            onClick={() => handleDeleteClick(user)}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              {filteredUsers.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ py: 3 }}>
                    <Typography variant="body2" color="text.secondary">
                      No users found matching your filters.
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25, 50]}
          component="div"
          count={filteredUsers.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>

      {/* Edit User Dialog */}
      <Dialog open={openEditDialog} onClose={() => setOpenEditDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Edit User</DialogTitle>
        <DialogContent dividers>
          {currentUser && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
              <Typography variant="subtitle1" fontWeight="bold">
                {currentUser.displayName || currentUser.email}
              </Typography>

              <FormControl fullWidth variant="outlined" margin="normal">
                <InputLabel id="role-label">Role</InputLabel>
                <Select
                  labelId="role-label"
                  name="role"
                  value={editUserData.role}
                  onChange={handleEditChange}
                  label="Role"
                >
                  <MenuItem value="admin">Admin</MenuItem>
                  <MenuItem value="premium">Premium</MenuItem>
                  <MenuItem value="basic">Basic</MenuItem>
                </Select>
              </FormControl>

              <FormControl fullWidth variant="outlined" margin="normal">
                <InputLabel id="status-label">Status</InputLabel>
                <Select
                  labelId="status-label"
                  name="status"
                  value={editUserData.status}
                  onChange={handleEditChange}
                  label="Status"
                >
                  <MenuItem value="active">Active</MenuItem>
                  <MenuItem value="inactive">Inactive</MenuItem>
                </Select>
              </FormControl>

              <FormControl fullWidth variant="outlined" margin="normal">
                <InputLabel id="subscription-label">Subscription Tier</InputLabel>
                <Select
                  labelId="subscription-label"
                  name="subscriptionTier"
                  value={editUserData.subscriptionTier}
                  onChange={handleEditChange}
                  label="Subscription Tier"
                >
                  <MenuItem value="free">Free</MenuItem>
                  <MenuItem value="premium">Premium</MenuItem>
                </Select>
              </FormControl>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenEditDialog(false)}>Cancel</Button>
          <Button variant="contained" color="primary" onClick={handleEditSubmit}>Save Changes</Button>
        </DialogActions>
      </Dialog>

      {/* Delete User Dialog */}
      <Dialog open={openDeleteDialog} onClose={() => setOpenDeleteDialog(false)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete {currentUser?.displayName || currentUser?.email}? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteDialog(false)}>Cancel</Button>
          <Button variant="contained" color="error" onClick={handleDeleteConfirm}>Delete</Button>
        </DialogActions>
      </Dialog>

      {/* Alert Snackbar */}
      <Snackbar
        open={alert.open}
        autoHideDuration={6000}
        onClose={handleAlertClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleAlertClose} severity={alert.severity} variant="filled">
          {alert.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default UsersList;