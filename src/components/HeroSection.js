import React from 'react';
import { Container, Typography, Button, Box } from '@mui/material';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
const HeroSection = () => (
    <Box
      className="bg-blue-800 text-white text-center py-16 relative"
      sx={{ position: 'relative' }}
    >
      <Container>
        <Box
          component={motion.div}
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <Typography variant="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
            Empowering Future Leaders
          </Typography>
          <Typography variant="h5" paragraph>
            Providing world-class education and opportunities for young students to excel.
          </Typography>
          <Button
            variant="contained"
            color="secondary"
            component={Link}
            to="/features"
            sx={{ mt: 2 }}
          >
            Explore Our Programs
          </Button>
        </Box>
      </Container>
    </Box>
  );

export default HeroSection;
