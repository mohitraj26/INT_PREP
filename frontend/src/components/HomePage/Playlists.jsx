import React, { useEffect, useState } from 'react';
import { usePlaylistStore } from '../../store/usePlaylistStore';
import { Link } from 'react-router-dom';
import { useThemeContext } from '../../context/Theme';

import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Avatar,
  Button,
  CircularProgress,
  Container,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Chip,
  Box,
  useMediaQuery,
  useTheme,
} from '@mui/material';

import {
  ExpandMore as ExpandMoreIcon,
  Delete as DeleteIcon,
  Launch as LaunchIcon,
  Book as BookIcon,
  AccessTime as AccessTimeIcon,
  List as ListIcon,
  Label as LabelIcon
} from '@mui/icons-material';

import CreatePlaylistModal from "../CreatePlaylistModal";
import { Fullscreen } from 'lucide-react';

const PlaylistProfile = () => {
  const { getAllPlaylists, playlists, deletePlaylist, createPlaylist } = usePlaylistStore();
  const [expandedPlaylist, setExpandedPlaylist] = useState(null);
  const [isCreatePlaylistOpen, setIsCreatePlaylistOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { theme: appTheme } = useThemeContext();

  const muiTheme = useTheme();
  const isMobile = useMediaQuery(muiTheme.breakpoints.down('sm'));

  useEffect(() => {
    const fetchPlaylists = async () => {
      setIsLoading(true);
      await getAllPlaylists();
      setIsLoading(false);
    };
    fetchPlaylists();
  }, [getAllPlaylists, createPlaylist]);

  const togglePlaylist = (id) => {
    setExpandedPlaylist(expandedPlaylist === id ? null : id);
  };

  const handleDelete = async (id) => {
    await deletePlaylist(id);
  };

  const handleCreatePlaylist = async (playlistData) => {
    await createPlaylist(playlistData);
    await getAllPlaylists();
    setIsCreatePlaylistOpen(false);
  };

  const getDifficultyBadge = (difficulty) => {
    switch (difficulty) {
      case 'EASY': return <Chip label="Easy" color="success" size="small" />;
      case 'MEDIUM': return <Chip label="Medium" color="warning" size="small" />;
      case 'HARD': return <Chip label="Hard" color="error" size="small" />;
      default: return <Chip label="Unknown" size="small" />;
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(date);
  };

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      {/* Header */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          justifyContent: 'space-between',
          alignItems: { xs: 'flex-start', sm: 'center' },
          mb: 4,
          gap: 2
        }}
      >
        <Typography variant="h4" component="h1" color="primary" fontWeight="bold">
          My Playlists
        </Typography>
        <Button variant="contained" onClick={() => setIsCreatePlaylistOpen(true)}>
          Create Playlist
        </Button>
      </Box>

      {/* Modal */}
      <CreatePlaylistModal
        isOpen={isCreatePlaylistOpen}
        onClose={() => setIsCreatePlaylistOpen(false)}
        onSubmit={handleCreatePlaylist}
      />

      {/* Playlist Display */}
      {playlists.length === 0 ? (
        <Paper elevation={3} sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h6">No playlists found</Typography>
          <Typography variant="body2" color="text.secondary">
            Create your first playlist to organize problems!
          </Typography>
          <Button
            variant="contained"
            sx={{ mt: 2 }}
            onClick={() => setIsCreatePlaylistOpen(true)}
          >
            Create Playlist
          </Button>
        </Paper>
      ) : (
        playlists.map((playlist) => (
          <Accordion
            key={playlist?.id}
            expanded={expandedPlaylist === playlist?.id}
            onChange={() => togglePlaylist(playlist?.id)}
            sx={{ mb: 2 }}
          >
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Box display="flex" alignItems="center" gap={2}>
                <Avatar>
                  <BookIcon />
                </Avatar>
                <Box>
                  <Typography variant="subtitle1" fontWeight="bold">
                    {playlist?.name || 'Untitled Playlist'}
                  </Typography>
                  <Box
                    display="flex"
                    gap={2}
                    alignItems="center"
                    flexWrap="wrap"
                    color="text.secondary"
                    fontSize="0.875rem"
                  >
                    <Box display="flex" alignItems="center" gap={0.5}>
                      <ListIcon fontSize="small" />
                      {playlist?.problems?.length || 0} problems
                    </Box>
                    <Box display="flex" alignItems="center" gap={0.5}>
                      <AccessTimeIcon fontSize="small" />
                      {formatDate(playlist.createdAt)}
                    </Box>
                  </Box>
                </Box>
              </Box>
            </AccordionSummary>

            <AccordionDetails>
              <Typography variant="body2" color="text.secondary" mb={2}>
                {playlist?.description || 'No description provided.'}
              </Typography>

              {playlist?.problems?.length === 0 ? (
                <Typography>No problems added to this playlist yet.</Typography>
              ) : (
                <TableContainer component={Paper} sx={{ overflowX: 'auto' }}>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Problem</TableCell>
                        <TableCell>Difficulty</TableCell>
                        <TableCell>Tags</TableCell>
                        <TableCell align="right">Action</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {playlist?.problems?.map((item) => (
                        <TableRow key={item?.id}>
                          <TableCell>{item?.problem?.title || 'Untitled Problem'}</TableCell>
                          <TableCell>{getDifficultyBadge(item?.problem?.difficulty)}</TableCell>
                          <TableCell>
                            {item?.problem?.tags?.map((tag, idx) => (
                              <Chip
                                key={idx}
                                label={tag}
                                size="small"
                                icon={<LabelIcon fontSize="small" />}
                                sx={{ mr: 0.5, mb: 0.5 }}
                              />
                            ))}
                          </TableCell>
                          <TableCell align="right">
                            <Button
                              size="small"
                              variant="outlined"
                              color="primary"
                              component={Link}
                              to={`/problem/${item?.problem?.id}`}
                              endIcon={<LaunchIcon fontSize="small" />}
                            >
                              Solve
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}

              <Box mt={2} textAlign="right">
                <Button
                  onClick={() => handleDelete(playlist?.id)}
                  variant="contained"
                  color="error"
                  startIcon={<DeleteIcon />}
                >
                  Delete Playlist
                </Button>
              </Box>
            </AccordionDetails>
          </Accordion>
        ))
      )}
    </Container>
  );
};

export default PlaylistProfile;


