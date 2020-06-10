/**
 * React Starter Kit for Firebase
 * https://github.com/kriasoft/react-firebase-starter
 * Copyright (c) 2015-present Kriasoft | MIT License
 */

import Router from 'express';
import { toGlobalId } from 'graphql-relay';
import passport from './passport';

const router = new Router();
//
function authenticate(provider) {
  return (req, res, next) => {
    console.log('authenticate...');
    console.log('req... ', req);
    console.log('res... ', res);
    // console.log('next... ', next);
    function send(err, user) {
      const data = {
        type: 'LOGIN',
        error: err ? err.message : undefined,
        user: user
          ? {
              id: toGlobalId('User', user.id),
              username: user.username,
              email: user.email,
              emailVerified: user.email_verified,
              displayName: user.display_name,
              photoURL: user.photo_url,
              timeZone: user.time_zone,
              createdAt: user.created_at,
              updatedAt: user.updated_at,
              lastLoginAt: user.last_login_at,
            }
          : null,
      };

      res.send(`
<script>
  if (window.opener) {
    window.opener.postMessage(${JSON.stringify(data)}, '${process.env.APP_ORIGIN}');
    window.opener.focus();
    window.close();
  } else {
    window.location.href = '${data.error ? `/login?error=${encodeURIComponent(data.error)}` : '/'}';
  }
</script>`); // prettier-ignore
    }

    passport.authenticate(provider, (err, user) => {
      if (err) {
        send(err);
      } else if (user) {
        req
          .logIn(user)
          .then(() => {
            send(null, user);
          })
          .catch(err => {
            send(err);
          });
      } else {
        send(null, null);
      }
    })(req, res, next);
  };
}

router.get(
  '/login/google',
  passport.authenticate('google', { scope: ['profile', 'email'] }),
);

router.get(
  '/login/facebook',
  passport.authenticate('facebook', {
    //scope: ['public_profile', 'email'],
    scope: ['pages_messaging','pages_manage_metadata','pages_show_list','pages_manage_posts'],
  }),
);

router.get(
  '/login/facebook-token',
  passport.authenticate('facebook-token'),
  function(req, res) {
    // do something with req.user
    // alert('HELLO');
    // console.log('req = ' + req);
    // console.log('response = ' + res);
    res.send(200);
    // res.send(req.user ? 200 : 401);
  },
);

// router.get('/login/facebook-token', (req, res, next) => {
//   passport.authenticate('facebook-token', (error, user, info) => {
//     if (error || !user) {
//       return res.status(401).json({
//         error,
//         info,
//       });
//     }

//     if (req.sessionID && user) {
//       req.logIn(user, () => {
//         return res.json({
//           // sessionId: cookieSignature.sign(req.sessionID, 12345),
//           profile: user.profile,
//         });
//       });
//     }

//     next();
//   })(req, res, next);
// });

//
router.get('/login/google/return', authenticate('google'));
router.get('/login/facebook/return', authenticate('facebook'));
router.get('/login/facebook-token/return', authenticate('facebook-token'));

router.post('/login/clear', (req, res) => {
  req.logOut();
  res.sendStatus(200);
});

export default router;
