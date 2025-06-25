import React from 'react';
import { Card, CardContent, Typography, CardMedia } from '@mui/material';

const FeatureCard = ({ title, description, image }) => (
  <Card className="w-full md:w-1/3 mb-4">
    <CardMedia
      component="img"
      height="140"
      image={image}
      alt={title}
    />
    <CardContent>
      <Typography variant="h5">{title}</Typography>
      <Typography variant="body2" color="textSecondary">
        {description}
      </Typography>
    </CardContent>
  </Card>
);

export default FeatureCard;
