import React, { useState, useContext } from "react";
import { Link } from "react-router-dom";
import {
  Box,
  Card,
  CardContent,
  Avatar,
  Typography,
  Chip,
  Grid,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
  Paper,
  Divider,
  Container,
  useTheme,
  useMediaQuery,
  Stack,
  Alert,
} from "@mui/material";
import {
  ArrowBack,
  Email,
  Person,
  Security,
  Image,
  Edit,
  Lock,
  Close,
} from "@mui/icons-material";
import { useAuthStore } from "../store/useAuthStore";
import { useThemeContext } from "../context/Theme"; 

// Utility to get initials
function getInitials(name) {
  if (!name) return "U";
  const names = name.trim().split(" ");
  if (names.length === 1) return names[0][0].toUpperCase();
  return (names[0][0] + names[names.length - 1][0]).toUpperCase();
}

const ProfilePage = () => {
  const { authUser, setAuthUser } = useAuthStore();
  const { isDarkMode } = useThemeContext();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isTablet = useMediaQuery(theme.breakpoints.down('lg'));

  // Modal states
  const [editOpen, setEditOpen] = useState(false);
  const [passwordOpen, setPasswordOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertSeverity, setAlertSeverity] = useState("success");

  // Edit Profile Form State
  const [editData, setEditData] = useState({
    name: authUser.name,
    email: authUser.email,
    image: authUser.image || "",
  });

  // Change Password Form State
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // Edit Profile Handlers
  const handleEditChange = (e) => {
    setEditData({ ...editData, [e.target.name]: e.target.value });
  };

  const handleProfileUpdate = (e) => {
    e.preventDefault();
    setAuthUser({ ...authUser, ...editData });
    setEditOpen(false);
    setAlertMessage("Profile updated successfully!");
    setAlertSeverity("success");
    setTimeout(() => setAlertMessage(""), 3000);
  };

  // Change Password Handlers
  const handlePasswordChange = (e) => {
    setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setAlertMessage("New passwords do not match!");
      setAlertSeverity("error");
      setTimeout(() => setAlertMessage(""), 3000);
      return;
    }
    setPasswordOpen(false);
    setPasswordData({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
    setAlertMessage("Password changed successfully!");
    setAlertSeverity("success");
    setTimeout(() => setAlertMessage(""), 3000);
  };

  const handleCloseEdit = () => {
    setEditOpen(false);
    setEditData({
      name: authUser.name,
      email: authUser.email,
      image: authUser.image || "",
    });
  };

  const handleClosePassword = () => {
    setPasswordOpen(false);
    setPasswordData({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "background.default",
        py: { xs: 2, md: 3 },
        px: { xs: 1, sm: 2, md: 3 },
      }}
    >
      <Container maxWidth="lg">
        {/* Header */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            mb: { xs: 2, md: 3 },
            gap: 2,
          }}
        >
          <Typography
            variant={isMobile ? "h4" : "h3"}
            sx={{
              fontWeight: "bold",
              color: "primary.main",
              flexGrow: 1,
            }}
          >
            Profile
          </Typography>
        </Box>

        {/* Alert */}
        {alertMessage && (
          <Alert
            severity={alertSeverity}
            sx={{ mb: 2 }}
            onClose={() => setAlertMessage("")}
          >
            {alertMessage}
          </Alert>
        )}

        {/* Main Content */}
        <Grid container spacing={3} justifyContent="center" width={"full"}>
          <Grid size={{ xs: 12, lg: 8 }}>
            <Card
              elevation={3}
              sx={{
                borderRadius: 3,
                overflow: "visible",
                position: "relative",
              }}
            >
              <CardContent sx={{ p: { xs: 2, sm: 3, md: 4 } }}>
                {/* Profile Header */}
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: { xs: "column", sm: "row" },
                    alignItems: "center",
                    gap: { xs: 2, sm: 3 },
                    mb: 3,
                  }}
                >
                  {/* Avatar */}
                  <Avatar
                    src={authUser.image}
                    sx={{
                      width: { xs: 80, sm: 100, md: 120 },
                      height: { xs: 80, sm: 100, md: 120 },
                      fontSize: { xs: "2rem", sm: "2.5rem", md: "3rem" },
                      bgcolor: "primary.main",
                      border: 3,
                      borderColor: "primary.light",
                      boxShadow: 3,
                    }}
                  >
                    {!authUser.image && getInitials(authUser.name)}
                  </Avatar>

                  {/* Name and Role */}
                  <Box
                    sx={{
                      textAlign: { xs: "center", sm: "left" },
                      flexGrow: 1,
                    }}
                  >
                    <Typography
                      variant={isMobile ? "h5" : "h4"}
                      sx={{
                        fontWeight: "bold",
                        mb: 1,
                        color: "text.primary",
                      }}
                    >
                      {authUser.name}
                    </Typography>
                    <Chip
                      label={authUser.role}
                      color="primary"
                      variant={isDarkMode ? "filled" : "outlined"}
                      sx={{
                        fontWeight: "medium",
                        fontSize: "0.875rem",
                      }}
                    />
                  </Box>
                </Box>

                <Divider sx={{ my: 3 }} />

                {/* User Information Grid */}
                <Grid container spacing={2}>
                  {/* Email */}
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Paper
                      elevation={1}
                      sx={{
                        p: 2,
                        borderRadius: 2,
                        bgcolor: "background.paper",
                        border: 1,
                        borderColor: "divider",
                      }}
                    >
                      <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                        <Email color="primary" sx={{ mr: 1 }} />
                        <Typography variant="subtitle2" color="text.secondary">
                          Email
                        </Typography>
                      </Box>
                      <Typography
                        variant="body1"
                        sx={{
                          fontWeight: "medium",
                          wordBreak: "break-all",
                        }}
                      >
                        {authUser.email}
                      </Typography>
                    </Paper>
                  </Grid>

                  {/* User ID */}
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Paper
                      elevation={1}
                      sx={{
                        p: 2,
                        borderRadius: 2,
                        bgcolor: "background.paper",
                        border: 1,
                        borderColor: "divider",
                      }}
                    >
                      <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                        <Person color="primary" sx={{ mr: 1 }} />
                        <Typography variant="subtitle2" color="text.secondary">
                          User ID
                        </Typography>
                      </Box>
                      <Typography
                        variant="body2"
                        sx={{
                          fontWeight: "medium",
                          wordBreak: "break-all",
                        }}
                      >
                        {authUser.id}
                      </Typography>
                    </Paper>
                  </Grid>

                  {/* Role Status */}
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Paper
                      elevation={1}
                      sx={{
                        p: 2,
                        borderRadius: 2,
                        bgcolor: "background.paper",
                        border: 1,
                        borderColor: "divider",
                      }}
                    >
                      <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                        <Security color="primary" sx={{ mr: 1 }} />
                        <Typography variant="subtitle2" color="text.secondary">
                          Role
                        </Typography>
                      </Box>
                      <Typography variant="body1" sx={{ fontWeight: "medium", mb: 0.5 }}>
                        {authUser.role}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {authUser.role === "ADMIN" ? "Full system access" : "Limited access"}
                      </Typography>
                    </Paper>
                  </Grid>

                  {/* Profile Image Status */}
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Paper
                      elevation={1}
                      sx={{
                        p: 2,
                        borderRadius: 2,
                        bgcolor: "background.paper",
                        border: 1,
                        borderColor: "divider",
                      }}
                    >
                      <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                        <Image color="primary" sx={{ mr: 1 }} />
                        <Typography variant="subtitle2" color="text.secondary">
                          Profile Image
                        </Typography>
                      </Box>
                      <Typography variant="body1" sx={{ fontWeight: "medium", mb: 0.5 }}>
                        {authUser.image ? "Uploaded" : "Not Set"}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {authUser.image ? "Image available" : "Upload a profile picture"}
                      </Typography>
                    </Paper>
                  </Grid>
                </Grid>

                {/* Action Buttons */}
                <Stack
                  direction={isMobile ? "column" : "row"}
                  spacing={2}
                  sx={{ mt: 4, justifyContent: "flex-end" }}
                >
                  <Button
                    variant="outlined"
                    startIcon={<Edit />}
                    onClick={() => setEditOpen(true)}
                    size={isMobile ? "medium" : "large"}
                    sx={{ minWidth: 140 }}
                  >
                    Edit Profile
                  </Button>
                  <Button
                    variant="contained"
                    startIcon={<Lock />}
                    onClick={() => setPasswordOpen(true)}
                    size={isMobile ? "medium" : "large"}
                    sx={{ minWidth: 140 }}
                  >
                    Change Password
                  </Button>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>

      {/* Edit Profile Dialog */}
      <Dialog
        open={editOpen}
        onClose={handleCloseEdit}
        maxWidth="sm"
        fullWidth
        fullScreen={isMobile}
        PaperProps={{
          sx: {
            borderRadius: isMobile ? 0 : 2,
          },
        }}
      >
        <DialogTitle sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Typography variant="h6" sx={{ fontWeight: "bold" }}>
            Edit Profile
          </Typography>
          <IconButton onClick={handleCloseEdit} size="small">
            <Close />
          </IconButton>
        </DialogTitle>
        <form onSubmit={handleProfileUpdate}>
          <DialogContent>
            <Stack spacing={3} sx={{ mt: 1 }}>
              <TextField
                label="Name"
                name="name"
                value={editData.name}
                onChange={handleEditChange}
                fullWidth
                required
                variant="outlined"
              />
              <TextField
                label="Email"
                name="email"
                type="email"
                value={editData.email}
                onChange={handleEditChange}
                fullWidth
                required
                variant="outlined"
              />
              <TextField
                label="Profile Image URL"
                name="image"
                value={editData.image}
                onChange={handleEditChange}
                fullWidth
                variant="outlined"
                helperText="Enter a valid image URL"
              />
            </Stack>
          </DialogContent>
          <DialogActions sx={{ p: 3, pt: 1 }}>
            <Button onClick={handleCloseEdit} color="inherit">
              Cancel
            </Button>
            <Button type="submit" variant="contained" sx={{ minWidth: 120 }}>
              Save Changes
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* Change Password Dialog */}
      <Dialog
        open={passwordOpen}
        onClose={handleClosePassword}
        maxWidth="sm"
        fullWidth
        fullScreen={isMobile}
        PaperProps={{
          sx: {
            borderRadius: isMobile ? 0 : 2,
          },
        }}
      >
        <DialogTitle sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Typography variant="h6" sx={{ fontWeight: "bold" }}>
            Change Password
          </Typography>
          <IconButton onClick={handleClosePassword} size="small">
            <Close />
          </IconButton>
        </DialogTitle>
        <form onSubmit={handlePasswordSubmit}>
          <DialogContent>
            <Stack spacing={3} sx={{ mt: 1 }}>
              <TextField
                label="Current Password"
                name="currentPassword"
                type="password"
                value={passwordData.currentPassword}
                onChange={handlePasswordChange}
                fullWidth
                required
                variant="outlined"
              />
              <TextField
                label="New Password"
                name="newPassword"
                type="password"
                value={passwordData.newPassword}
                onChange={handlePasswordChange}
                fullWidth
                required
                variant="outlined"
              />
              <TextField
                label="Confirm New Password"
                name="confirmPassword"
                type="password"
                value={passwordData.confirmPassword}
                onChange={handlePasswordChange}
                fullWidth
                required
                variant="outlined"
              />
            </Stack>
          </DialogContent>
          <DialogActions sx={{ p: 3, pt: 1 }}>
            <Button onClick={handleClosePassword} color="inherit">
              Cancel
            </Button>
            <Button type="submit" variant="contained" sx={{ minWidth: 120 }}>
              Change Password
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
};

export default ProfilePage;