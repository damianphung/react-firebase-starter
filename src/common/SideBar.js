/**
 * Drawer UI
 */

import clsx from 'clsx';
import React from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import { Typography } from '@material-ui/core';
import { useState } from 'react';
import { useMediaQuery } from '@material-ui/core';
import { useTheme } from '@material-ui/core/styles';
import { Badge, Hidden } from '@material-ui/core';

import MenuIcon from '@material-ui/icons/Menu';                                                                                                                                               
import InputIcon from '@material-ui/icons/Input';  


import { makeStyles } from '@material-ui/core/styles';
import { createFragmentContainer, graphql } from 'react-relay';
import { useConfig, useHistory, useAuth } from '../hooks';

import Drawer from '@material-ui/core/Drawer';
import {
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListSubheader,
} from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  drawer: {
    width: 240,
    [theme.breakpoints.up('lg')]: {
      marginTop: 64,
      height: 'calc(100% - 64px)'
    }
  },  
  root: {
  //  backgroundColor: '#3f51b5',
  //  backgroundImage: 'linear-gradient(-225deg, #3db0ef, #5e5bb7)',
  },
  divider: {
    margin: theme.spacing(2, 0)
  },
  //
  avatarRoot: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    minHeight: 'fit-content'
  },
  avatarButton: {
    padding: theme.spacing(0.5),
    marginLeft: theme.spacing(1),
  },
  avatar: {
    width: 60,
    height: 60
  }
}));


function SideBar(props) {
    const {
      className,
      me,
      relay,
      close,
      children,
      onOpenSettings,
      open,
      variant,
      onClose,
      ...other
    } = props;
    const [userMenuEl, setUserMenuEl] = React.useState(null);
    const { app } = useConfig();
    const history = useHistory();
    const auth = useAuth();
    const s = useStyles();
    

    function handleClose() {
      history.replace('/');
    }
  
    function openUserMenu(event) {
      setUserMenuEl(event.currentTarget);
    }
  
    function closeUserMenu() {
      setUserMenuEl(null);
    }
  
    function signIn() {
      closeUserMenu();
      auth.signIn();
    }
  //          className={clsx(s.root, className)} 
    return (
        <Drawer 

          classes={{ paper: s.drawer }}
          anchor="left" {...other} 
          open={open}
          onClose={onClose}
          variant={variant} >        
                {me && (
                  <div className={clsx(s.avatarRoot, className)}>
                    <IconButton
                      className={s.avatarButton}
                      onClick={openUserMenu}
                      aria-owns={userMenuEl ? 'user-menu' : null}
                      aria-haspopup="true"
                    >
                      <Avatar
                        className={s.avatar}
                        src={me.photoURL}
                        alt={me.displayName}
                      />
                      
                    </IconButton>
                    <Typography>
                      Welcome
                    </Typography>
                    <Typography>
                    {me.displayName}
                    </Typography>
                  </div> 
                )}
                <Divider className={s.divider} />
                <List className={clsx(s.root, className)} disablePadding >
                  <ListItem  className={clsx(s.listItem, className)} >                   
                  {!me && (
                    <Button className={s.button} color="inherit" onClick={signIn}>
                      Log In / Sign Up
                    </Button>
                  )}                
                  </ListItem>               
            </List>
        </Drawer>
    );
}


// export default SideBar;
export default createFragmentContainer(SideBar, {
  me: graphql`
    fragment SideBar_me on User {
      id
      photoURL
      displayName
    }
  `,
});



