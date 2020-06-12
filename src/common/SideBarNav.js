/* eslint-disable react/no-multi-comp */
/* eslint-disable react/display-name */

import React from 'react';
import clsx from 'clsx';
import Link from './Link';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import { List, ListItem, Button, colors } from '@material-ui/core';

// icons
import SettingsIcon from '@material-ui/icons/Settings';

const useStyles = makeStyles(theme => ({
  root: {},
  item: {
    display: 'flex',
    paddingTop: 0,
    paddingBottom: 0
  },
  button: {
    color: colors.blueGrey[800],
    padding: '10px 8px',
    justifyContent: 'flex-start',
    textTransform: 'none',
    letterSpacing: 0,
    width: '100%',
    fontWeight: theme.typography.fontWeightMedium
  },
  icon: {
    color: theme.palette.icon,
    width: 24,
    height: 24,
    display: 'flex',
    alignItems: 'center',
    marginRight: theme.spacing(1)
  },
  active: {
    color: theme.palette.primary.main,
    fontWeight: theme.typography.fontWeightMedium,
    '& $icon': {
      color: theme.palette.primary.main
    }
  }
}));



const SidebarNav = props => {
  const { className, ...rest } = props;
  const pages = [
    {
        title: 'News',
        href: '/news',
        icon: <SettingsIcon />
    },
    {
        title: 'About',
        href: '/about',
        icon: <SettingsIcon />
    }
  ];

  const s = useStyles();

  return (
    <List
      {...rest}
      className={clsx(s.root, className)}
    >
      {pages.map(page => (
        <ListItem
          className={s.item}
          disableGutters
          key={page.title}
        >
          <Button
          
            className={s.button}
            component={Link}
            href={page.href}
          >
            <div className={s.icon}>{page.icon}</div>
            {page.title}
          </Button>
        </ListItem>
      ))}
    </List>
  );
};

SidebarNav.propTypes = {
  className: PropTypes.string,
};

export default SidebarNav;
