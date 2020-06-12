/**
 * Drawer UI
 * 
 */

import clsx from 'clsx';
import React from 'react';
import Avatar from '@material-ui/core/Avatar';

import IconButton from '@material-ui/core/IconButton';
import { Typography } from '@material-ui/core';
import SideBarNav from './SideBarNav';
import { makeStyles } from '@material-ui/core/styles';
import { createFragmentContainer, graphql } from 'react-relay';

import Drawer from '@material-ui/core/Drawer';
import {
  Divider
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
    backgroundColor: theme.palette.white,
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    padding: theme.spacing(2)
  },
  divider: {
    margin: theme.spacing(2, 0)
  },
  nav: {
    marginBottom: theme.spacing(2)
  },
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
          <div className={clsx(s.root, className)}>
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
            <SideBarNav className={s.nav}/>
          </div>
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



