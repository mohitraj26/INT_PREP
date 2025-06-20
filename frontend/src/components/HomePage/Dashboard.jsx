import React, { useEffect } from 'react';
import { useProblemStore } from '../../store/useProblemStore';
import { useThemeContext } from '../../context/Theme';
import {
  Box,
  Typography,
  Container,
} from '@mui/material';

import ContributionGraph from "../ContributionGraph";

const ProblemSolvedByUser = () => {
  const { getProblemSolvedByUser, solvedProblems } = useProblemStore();
  const { theme } = useThemeContext();

  useEffect(() => {
    getProblemSolvedByUser();
  }, []);

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
            Dashboard
          </Typography>
        </Box>

{/* Stats Cards */}
{solvedProblems && (
  <Box
    sx={{
      display: 'flex',
      flexDirection: { xs: 'column', sm: 'row' },
      gap: 3,
      mb: 4,
    }}
  >
    <Box
      sx={{
        flex: 1,
        textAlign: 'center',
        p: 3,
        border: '2px solid',
        borderColor: 'success.light',
        borderRadius: 3,
        background: 'linear-gradient(135deg, rgba(76, 175, 80, 0.1) 0%, rgba(76, 175, 80, 0.05) 100%)',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        cursor: 'pointer',
        position: 'relative',
        overflow: 'hidden',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: '0 4px 12px rgba(76, 175, 80, 0.15)',
          borderColor: 'success.main',
        }
      }}
    >
      <Typography
        variant="h6"
        color="textSecondary"
        gutterBottom
        sx={{
          transition: 'all 0.3s ease',
        }}
      >
        Easy
      </Typography>
      <Typography
        variant="h3"
        color="success.main"
        fontWeight="bold"
        sx={{
          transition: 'all 0.3s ease',
        }}
      >
        {(solvedProblems?.filter(p => p.difficulty === 'EASY').length) || 0}
      </Typography>
    </Box>

    <Box
      sx={{
        flex: 1,
        textAlign: 'center',
        p: 3,
        border: '2px solid',
        borderColor: 'warning.light',
        borderRadius: 3,
        background: 'linear-gradient(135deg, rgba(255, 152, 0, 0.1) 0%, rgba(255, 152, 0, 0.05) 100%)',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        cursor: 'pointer',
        position: 'relative',
        overflow: 'hidden',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: '0 4px 12px rgba(255, 152, 0, 0.15)',
          borderColor: 'warning.main',
        }
      }}
    >
      <Typography
        variant="h6"
        color="textSecondary"
        gutterBottom
        sx={{
          transition: 'all 0.3s ease',
        }}
      >
        Medium
      </Typography>
      <Typography
        variant="h3"
        color="warning.main"
        fontWeight="bold"
        sx={{
          transition: 'all 0.3s ease',
        }}
      >
        {(solvedProblems?.filter(p => p.difficulty === 'MEDIUM').length) || 0}
      </Typography>
    </Box>

    <Box
      sx={{
        flex: 1,
        textAlign: 'center',
        p: 3,
        border: '2px solid',
        borderColor: 'error.light',
        borderRadius: 3,
        background: 'linear-gradient(135deg, rgba(244, 67, 54, 0.1) 0%, rgba(244, 67, 54, 0.05) 100%)',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        cursor: 'pointer',
        position: 'relative',
        overflow: 'hidden',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: '0 4px 12px rgba(244, 67, 54, 0.15)',
          borderColor: 'error.main',
        }
      }}
    >
      <Typography
        variant="h6"
        color="textSecondary"
        gutterBottom
        sx={{
          transition: 'all 0.3s ease',
        }}
      >
        Hard
      </Typography>
      <Typography
        variant="h3"
        color="error.main"
        fontWeight="bold"
        sx={{
          transition: 'all 0.3s ease',
        }}
      >
        {(solvedProblems?.filter(p => p.difficulty === 'HARD').length) || 0}
      </Typography>
    </Box>
  </Box>
)}


        <Box sx={{ mb: 4 }}>
          <ContributionGraph />
        </Box>
      </Container>
    </Box>
  );
};

export default ProblemSolvedByUser;
