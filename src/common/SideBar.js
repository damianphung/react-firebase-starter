/**
 * Drawer UI
 */

import clsx from 'clsx';
import React from 'react';
import { useState } from 'react';
import { useMediaQuery } from '@material-ui/core';
import { useTheme } from '@material-ui/core/styles';
import { Badge, Hidden } from '@material-ui/core';

import MenuIcon from '@material-ui/icons/Menu';                                                                                                                                               
import NotificationsIcon from '@material-ui/icons/NotificationsOutlined';                                                                                                                     
import InputIcon from '@material-ui/icons/Input';  

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
  
  // TODO: refactor and seperate Appbar and Drawer UI components
  // Topbar
    flexGrow: {                                                                                                                                                                                 
      flexGrow: 1                                                                                                                                                                               
    },                                                                                                                                                                                          
    signOutButton: {                                                                                                                                                                            
      marginLeft: theme.spacing(1)                                                                                                                                                              
    },    
  
    // MUI
    paper: {
      //background: "blue",
    //  backgroundImage: 'linear-gradient(-225deg, #3db0ef, #5e5bb7)',
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


function SideBar(props) {
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
    
    // MUI
    const theme = useTheme();
    const isDesktop = useMediaQuery(theme.breakpoints.up('lg'), { defaultmatches : true });
    const [openSidebar, setOpenSidebar] = useState(false);
    const handleSidebarOpen = () => {
      setOpenSidebar(true);
    };
    const handleSidebarClose = () => {
      setOpenSidebar(false);
    }
    const shouldOpenSidebar = isDesktop ? true : openSidebar;
    const [notifications] = useState([]);
    //
  
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
        <Drawer 
        className={clsx(s.paper, className)} 
        anchor="left" {...other} 
        open={shouldOpenSidebar}
        onClose={handleSidebarClose}
        variant={isDesktop ? 'persistent' : 'temporary'} >        
            <List component="div" disablePadding >
                <ListItem  className={clsx(s.listItem, className)} > 
                </ListItem>
            </List>
        </Drawer>
    );
}