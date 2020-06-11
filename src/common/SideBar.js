/**
 * Drawer UI
 */

import clsx from 'clsx';
import React from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import { Typography } from '@material-ui/core';

import Link from './Link';
import { makeStyles } from '@material-ui/core/styles';
import { createFragmentContainer, graphql } from 'react-relay';

import Drawer from '@material-ui/core/Drawer';
import {
  Divider,
  List,
  ListItem,
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
  item: {
    display: 'flex',
    paddingTop: 0,
    paddingBottom: 0
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

    const s = useStyles();

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
              <Divider className={s.divider} />
            </div> 
          )}
          
          <List className={clsx(s.root, className)} disablePadding >
            {/* <ListItem  className={clsx(s.listItem, className)} >                   
            {!me && (
              <Button className={s.button} color="inherit" onClick={signIn}>
                Log In / Sign Up
              </Button>
            )}                
            </ListItem>  */}
            <ListItem  className={clsx(s.listItem, className)} >        
              <Button color="inherit" component={Link} href="/news">
                News
              </Button>
            </ListItem> 
            <ListItem  className={clsx(s.listItem, className)} > 
              <Button color="inherit" component={Link} href="/about">
                About
              </Button> 
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



