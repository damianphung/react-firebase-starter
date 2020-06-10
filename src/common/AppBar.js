/**
 * React Starter Kit for Firebase
 * https://github.com/kriasoft/react-firebase-starter
 * Copyright (c) 2015-present Kriasoft | MIT License
 */

import clsx from 'clsx';
import React from 'react';
import Avatar from '@material-ui/core/Avatar';
import MuiAppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';

import Drawer from '@material-ui/core/Drawer';
import {
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListSubheader,
} from '@material-ui/core';

import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import { makeStyles } from '@material-ui/core/styles';
import { createFragmentContainer, graphql } from 'react-relay';
import { Typography } from '@material-ui/core';

import Link from './Link';
import UserMenu from './UserMenu';
import { useConfig, useHistory, useAuth } from '../hooks';

const useStyles = makeStyles(theme => ({
  root: {
  //  backgroundColor: '#3f51b5',
  //  backgroundImage: 'linear-gradient(-225deg, #3db0ef, #5e5bb7)',
  },
  title: {
    fontFamily: theme.typography.monoFamily,
    fontWeight: 300,
    fontSize: '1.25rem',
  },
  titleLink: {
    color: 'inherit',
    textDecoration: 'none',
  },
  avatarButton: {
    padding: theme.spacing(0.5),
    marginLeft: theme.spacing(1),
  },
  avatar: {
    width: 32,
    height: 32,
  },

  // MUI
  paper: {
    //background: "blue",
//    backgroundImage: 'linear-gradient(-225deg, #3db0ef, #5e5bb7)',
  },
  listSubheader: {
    color: theme.palette.text.secondary
  },
  listItem: {
    cursor: 'pointer',
    '&:hover': {
      backgroundColor: theme.palette.primary.light,
      borderLeft: `4px solid ${theme.palette.primary.main}`,
      borderRadius: '4px',
      '& $listItemIcon': {
        color: theme.palette.primary.main,
        marginLeft: '-4px'
      }
    },
    '& + &': {
      marginTop: theme.spacing.unit
    }
  },
  activeListItem: {
    borderLeft: `4px solid ${theme.palette.primary.main}`,
    borderRadius: '4px',
    backgroundColor: theme.palette.primary.light,
    '& $listItemText': {
      color: theme.palette.text.primary
    },
    '& $listItemIcon': {
      color: theme.palette.primary.main,
      marginLeft: '-4px'
    }
  },
  listItemIcon: {
    marginRight: 0
  },
  listItemText: {
    fontWeight: 500,
    color: theme.palette.text.secondary
  },
  listDivider: {
    marginBottom: theme.spacing.unit * 2,
    marginTop: theme.spacing.unit * 2
  }


}));

function AppBar(props) {
  const {
    className,
    me,
    relay,
    close,
    children,
    onOpenSettings,
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

  return (
    {/*<MuiAppBar className={clsx(s.root, className)} elevation={0} {...other}>*/},
    <Drawer className={clsx(s.paper, className)} anchor="left" {...other} open={true}>
      <List component="div" disablePadding >
      <ListItem  className={clsx(s.activeListItem, className)} > 
        <Typography className={s.title} variant="h1">
          <Link className={s.titleLink} href="/">
            {app.name}
          </Link>
        </Typography>
      </ListItem>
        <span style={{ flexGrow: 1 }} />
        {close ? (
          <IconButton onClick={handleClose} color="inherit">
            <CloseIcon />
          </IconButton>
        ) : (

          <React.Fragment>
    <ListItem  className={clsx(s.listItem, className)} > 
            <Button color="inherit" component={Link} href="/news">
              News
            </Button>
    </ListItem>
            {children}
            {me && (
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
            )}
            {me && (
              <UserMenu
                id="user-menu"
                role="menu"
                open={Boolean(userMenuEl)}
                anchorEl={userMenuEl}
                onClose={closeUserMenu}
                onOpenSettings={onOpenSettings}
              />
            )}
            {!me && (
    <ListItem  className={clsx(s.listItem, className)} >
              <Button className={s.button} color="inherit" onClick={signIn}>
                Log In / Sign Up
              </Button>
    </ListItem>
            )}
          </React.Fragment>
        )}
    </List>
    </Drawer>
//    {/*</MuiAppBar>*/}
  );
}

export default createFragmentContainer(AppBar, {
  me: graphql`
    fragment AppBar_me on User {
      id
      photoURL
      displayName
    }
  `,
});
