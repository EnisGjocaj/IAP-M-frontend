// src/components/Footer.jsx
import React from 'react';
import { Container, Typography } from '@mui/material';

const Footer = () => (
  <footer className="bg-blue-900 text-white py-6">
    <Container>
      <Typography variant="body1" align="center">
        &copy; {new Date().getFullYear()} My Institution. All rights reserved.
      </Typography>
    </Container>
  </footer>
);

export default Footer;
