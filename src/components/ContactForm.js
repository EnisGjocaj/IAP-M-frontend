import React from 'react';
import { TextField, Button, Container, Typography } from '@mui/material';

const ContactForm = () => (
  <Container>
    <Typography variant="h4" gutterBottom>
      Get in Touch
    </Typography>
    <form noValidate autoComplete="off">
      <TextField
        fullWidth
        label="Name"
        variant="outlined"
        margin="normal"
        required
      />
      <TextField
        fullWidth
        label="Email"
        variant="outlined"
        margin="normal"
        type="email"
        required
      />
      <TextField
        fullWidth
        label="Message"
        variant="outlined"
        margin="normal"
        multiline
        rows={4}
        required
      />
      <Button
        variant="contained"
        color="primary"
        type="submit"
        className="mt-4"
      >
        Send Message
      </Button>
    </form>
  </Container>
);

export default ContactForm;
