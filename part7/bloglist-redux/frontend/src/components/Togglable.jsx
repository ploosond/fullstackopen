import React, { useState, forwardRef, useImperativeHandle } from 'react';
import { Button, Paper, Stack, Fade } from '@mui/material';

const Togglable = forwardRef((props, refs) => {
  const [visible, setVisible] = useState(false);

  const toggleVisibility = () => {
    setVisible(!visible);
  };

  useImperativeHandle(refs, () => {
    return {
      toggleVisibility,
    };
  });

  return (
    <Paper elevation={0}>
      <Stack spacing={2} sx={{ marginTop: 1 }}>
        <Fade in={!visible}>
          <div>
            <Button
              size="small"
              variant="contained"
              onClick={toggleVisibility}
              sx={{ display: visible ? 'none' : 'block' }}
            >
              {props.buttonLabel}
            </Button>
          </div>
        </Fade>

        <Fade in={visible}>
          <div style={{ display: visible ? 'block' : 'none' }}>
            <Stack spacing={2}>
              {props.children}
              <Button
                size="small"
                variant="outlined"
                color="secondary"
                onClick={toggleVisibility}
                sx={{ width: '100px' }}
              >
                Cancel
              </Button>
            </Stack>
          </div>
        </Fade>
      </Stack>
    </Paper>
  );
});

export default Togglable;
