import React, { useEffect, useState } from 'react';
import { useProblemStore } from '../../store/useProblemStore';
import { useThemeContext } from '../../context/Theme';
import { Link } from 'react-router-dom';
import {
  Box,
  Typography,
  Card,
  CardContent,
  CardActions,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Button,
  Pagination,
  Container,
  Stack
} from '@mui/material';
import {
  Tag,
  ExternalLink,
  AlertTriangle,
  CheckCircle,
  Circle
} from 'lucide-react';

const ProblemSolvedByUser = () => {
  const { getProblemSolvedByUser, solvedProblems } = useProblemStore();
  const { theme } = useThemeContext();
  const [currentPage, setCurrentPage] = useState(1);
  const submissionsPerPage = 5;

  useEffect(() => {
    getProblemSolvedByUser();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [solvedProblems]);

  // Pagination logic
  const indexOfLastSubmission = currentPage * submissionsPerPage;
  const indexOfFirstSubmission = indexOfLastSubmission - submissionsPerPage;
  const currentSubmissions = solvedProblems.slice(indexOfFirstSubmission, indexOfLastSubmission);
  const totalPages = Math.ceil(solvedProblems.length / submissionsPerPage);

  // Function to get difficulty badge styling
  const getDifficultyChip = (difficulty) => {
    switch (difficulty) {
      case 'EASY':
        return (
          <Chip
            icon={<CheckCircle size={16} />}
            label="Easy"
            color="success"
            variant="filled"
            size="small"
          />
        );
      case 'MEDIUM':
        return (
          <Chip
            icon={<Circle size={16} />}
            label="Medium"
            color="warning"
            variant="filled"
            size="small"
          />
        );
      case 'HARD':
        return (
          <Chip
            icon={<AlertTriangle size={16} />}
            label="Hard"
            color="error"
            variant="filled"
            size="small"
          />
        );
      default:
        return (
          <Chip
            label="Unknown"
            variant="outlined"
            size="small"
          />
        );
    }
  };

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  return (
    <Box sx={{ p: { xs: 1, sm: 2, md: 3 }, bgcolor: 'background.default', minHeight: '100vh' }}>
      <Container maxWidth="lg">
        {/* Header */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            justifyContent: 'space-between',
            alignItems: { xs: 'flex-start', sm: 'center' },
            mb: 4,
            gap: 2,
          }}
        >
          <Typography variant="h4" component="h1" color="primary" fontWeight="bold">
            Solved Problems
          </Typography>
        </Box>

        {solvedProblems.length === 0 ? (
          <Card sx={{ textAlign: 'center', p: { xs: 2, sm: 4 } }}>
            <CardContent>
              <Typography variant="h5" gutterBottom>
                No problems solved yet
              </Typography>
              <Typography variant="body1" color="textSecondary" sx={{ mb: 3 }}>
                Start solving problems to see them listed here!
              </Typography>
            </CardContent>
            <CardActions sx={{ justifyContent: 'center' }}>
              <Button
                component={Link}
                to="/problems"
                variant="contained"
                color="primary"
              >
                View Problems
              </Button>
            </CardActions>
          </Card>
        ) : (
          <Card>
            <TableContainer component={Paper} sx={{ width: '100%', overflowX: 'auto' }}>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 'bold', minWidth: 120 }}>Problem</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', minWidth: 90 }}>Difficulty</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', minWidth: 120 }}>Tags</TableCell>
                    <TableCell align="center" sx={{ fontWeight: 'bold', minWidth: 100 }}>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {currentSubmissions.map((problem) => (
                    <TableRow key={problem.id} hover>
                      <TableCell>
                        <Typography variant="body1" fontWeight="medium" sx={{ wordBreak: 'break-word' }}>
                          {problem.title}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        {getDifficultyChip(problem.difficulty)}
                      </TableCell>
                      <TableCell>
                        <Stack direction="row" spacing={1} flexWrap="wrap">
                          {problem.tags && problem.tags.map((tag, index) => (
                            <Chip
                              key={index}
                              icon={<Tag size={12} />}
                              label={tag}
                              variant="outlined"
                              color="primary"
                              size="small"
                            />
                          ))}
                        </Stack>
                      </TableCell>
                      <TableCell align="center">
                        <Button
                          component={Link}
                          to={`/problem/${problem.id}`}
                          variant="outlined"
                          color="primary"
                          size="small"
                          startIcon={<ExternalLink size={14} />}
                        >
                          View
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            <Box
              sx={{
                p: { xs: 2, sm: 3 },
                bgcolor: 'background.paper',
                display: 'flex',
                flexDirection: { xs: 'column', sm: 'row' },
                justifyContent: 'space-between',
                alignItems: { xs: 'stretch', sm: 'center' },
                gap: 2,
              }}
            >
              <Typography variant="body2">
                Total problems solved: <strong>{solvedProblems.length}</strong>
              </Typography>
              {totalPages > 1 && (
                <Pagination
                  count={totalPages}
                  page={currentPage}
                  onChange={handlePageChange}
                  color="primary"
                  showFirstButton
                  showLastButton
                  sx={{
                    alignSelf: { xs: 'flex-start', sm: 'center' },
                  }}
                />
              )}
              <Button
                component={Link}
                to="/allSubmissions"
                variant="contained"
                color="primary"
                size="small"
                sx={{
                  alignSelf: { xs: 'flex-start', sm: 'center' },
                  mt: { xs: 1, sm: 0 }
                }}
              >
                View all submissions
              </Button>
            </Box>
          </Card>
        )}
      </Container>
    </Box>
  );
};

export default ProblemSolvedByUser;
