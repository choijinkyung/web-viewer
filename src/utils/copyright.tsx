import React from 'react';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';

export default function Copyright(props: any) {
  return (
    <Typography variant="body2" color="white" align="center" {...props} fontSize={sessionStorage.getItem('mobile') ==='true' ?'12px': ''}>
      {'Copyright © '}
      <Link color="inherit" href="https://medicalstandard.com/" sx={{color:'#fff'}}>
        Medicalstandard
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}
