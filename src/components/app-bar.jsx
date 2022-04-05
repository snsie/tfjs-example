import { useState } from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import { MenuItem } from '@mui/material';
import { activities } from '../store';
import Menu from '@mui/material/Menu';

export default function ButtonAppBar({ taskCallback, ...props }) {
  const [isDisplayed, setIsDisplayed] = useState(false);
  const [anchorTask, setAnchorTask] = useState(null);
  // const [selectedIndex, setSelectedIndex] = useState(1);
  //   const []
  //   const [anchorElUser, setAnchorElUser] = useState(null);
  const handleOpen = (event) => {
    setAnchorTask(event.currentTarget);
  };
  const toggleOpen = (event) => {
    setIsDisplayed((val) => !val);
  };

  const handleClose = (event) => {
    setAnchorTask(null);
    // setAnchorTask(event.currentTarget);
  };
  const handleMenuItemClick = (event, index) => {
    taskCallback(index);
    setAnchorTask(null);
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="task selection"
            aria-controls="menu-appbar"
            aria-haspopup="true"
            sx={{ mr: 2 }}
            onClick={handleOpen}
          >
            <MenuIcon />
          </IconButton>
          <Typography
            variant="h6"
            //   noWrap
            //   component="div"
            //   textAlign="center"
            sx={{
              // flexGrow: 1,
              // display: 'flex',
              //   left: 0,
              textAlign: 'center',

              // flexBasis: 'column',
            }}
          >
            Tasks
          </Typography>
          <Menu
            //   getContentAnchorEl={null}
            anchorEl={anchorTask}
            //   anchorOrigin={{
            //     vertical: 'bottom',
            //     horizontal: 'left',
            //   }}
            //   //   keepMounted
            //   transformOrigin={{
            //     vertical: 'top',
            //     horizontal: 'left',
            //   }}
            open={Boolean(anchorTask)}
            onClose={handleClose}
            // onClose={handleClose}
            // sx={{
            //   display: { xs: 'block', md: 'none' },
            // }}
          >
            {activities.map((setting, index) => (
              <MenuItem
                key={setting}
                onClick={(event) => handleMenuItemClick(event, index)}
                // selected={index === selectedIndex}
              >
                <Typography textAlign="center">{setting}</Typography>
              </MenuItem>
            ))}
          </Menu>
          {/* <Typography
            variant="h6"
            sx={
              {
                //   flexGrow: 1,
                //   display: 'flex',
                //   justifyContent: 'center',
                //   postition: 'absolute',
                //   left: 'auto',
                //   right: 'auto',
              }
            }
          >
            LOGO
          </Typography>
          <Typography
            variant="h6"
            sx={
              {
                //   flexGrow: 1,
                //   display: 'flex',
                //   left: 'auto',
                //   postition: 'absolute',
              }
            }
          ></Typography> */}
          {/* <Menu
            id="menu-appbar"
            // anchorOrigin={{
            //   vertical: 'bottom',
            //   horizontal: 'left',
            // }}
            // keepMounted
            // transformOrigin={{
            //   vertical: 'top',
            //   horizontal: 'left',
            // }}
            onClose={handleCloseNavMenu}
            sx={{
              display: { xs: 'block', md: 'none' },
            }}
          > */}

          {/* </Menu> */}
        </Toolbar>
      </AppBar>
    </Box>
  );
}
