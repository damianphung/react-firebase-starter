/**
 * React Starter Kit for Firebase
 * https://github.com/kriasoft/react-firebase-starter
 * Copyright (c) 2015-present Kriasoft | MIT License
 */

import uuid from 'uuid';
import passport from 'passport';
import jwt from 'jwt-passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as FacebookStrategy } from 'passport-facebook';

import db from './db';
import { upsertUser, upsertPage } from './utils';
import axios from 'axios'

const origin =
  process.env.NODE_ENV === 'production' ? `${process.env.APP_ORIGIN}` : '';

passport.framework(
  jwt({
    name: process.env.JWT_NAME,
    secret: process.env.JWT_SECRET,
    issuer: origin,
    expiresIn: '1y',
    cookie: {
      maxAge: 31536000000 /* 1 year */,
    },
    createToken: req => ({
      sub: req.user.id,
      jti: uuid.v4(),
    }),
    saveToken: token =>
      db.table('user_tokens').insert({
        user_id: token.sub,
        token_id: token.jti,
      }),
    deleteToken: token =>
      db
        .table('user_tokens')
        .where({ token_id: token.jti })
        .del(),
    findUser: token =>
      db
        .table('user_tokens')
        .leftJoin('users', 'users.id', 'user_tokens.user_id')
        .where({ 'user_tokens.token_id': token.jti })
        .select('users.*')
        .first(),
  }),
);

// https://github.com/jaredhanson/passport-google-oauth2
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: `${process.env.APP_ORIGIN}/login/google/return`,
      passReqToCallback: true,
    },
    (req, accessToken, refreshToken, profile, cb) => {
      const credentials = { accessToken, refreshToken };
      upsertUser(profile, credentials)
        .then(user => cb(null, user))
        .catch(err => cb(err));
    },
  ),
);
// https://github.com/jaredhanson/passport-facebook
passport.use(
  new FacebookStrategy(
    {
      clientID: process.env.FACEBOOK_APP_ID,
      clientSecret: process.env.FACEBOOK_APP_SECRET,
      graphAPIVersion: 'v7.0',
      callbackURL: `${process.env.APP_ORIGIN}/login/facebook/return`,
      profileFields: [
        'id',
        'cover',
        'name',
        'displayName',
        'age_range',
        'link',
        'gender',
        'locale',
        'picture',
        'timezone',
        'updated_time',
        'verified',
        'email',
      ],
      passReqToCallback: true,
    },
    (req, accessToken, refreshToken, profile, cb) => {
      console.log("Adding creds passport facebook strategy");
      //console.log(profile)
      let credentials;
      let pageInfoList;
      //const credentials = { accessToken, refreshToken };
      // extender USER TOKEN. client id, app id /secret
      axios.get("https://graph.facebook.com/v7.0/oauth/access_token?" 
          + "fb_exchange_token=" + accessToken
          + "&client_id=" + process.env.FACEBOOK_APP_ID
          + "&client_secret=" + process.env.FACEBOOK_APP_SECRET
          + "&grant_type=fb_exchange_token")
        .then( function(response) {
            //console.log("user token extended")
            // update the short lived user token for long lived one.
            //console.log("Short token = ", accessToken);
            accessToken = response.data.access_token
            //console.log("Long token = ", accessToken);

            console.log("Requesting for page access token");
            return axios.get("https://graph.facebook.com/v7.0/" + profile.id + "/accounts"
                + "?access_token=" + response.data.access_token 
            )
          }
        )
        .then(function(response) {
            console.log("response from extended page token to pass to upsert...")
            //console.log("TOKEN - ", response.data);
            pageInfoList = response.data;
            // Update accessToken to long lived token
            credentials = { accessToken, refreshToken };
            return Promise.resolve(upsertUser(profile, credentials))
        })
        .then(function(user) {
            console.log("Resolving");
            return Promise.resolve(upsertPage(profile, user, pageInfoList))
        })
        .then(function(user) {
            console.log("callback");
            cb(null, user)
        })
        .catch(err => cb(err));

        
       //upsertUser(profile, credentials)
       // .then(user => cb(null, user))
       // .catch(err => cb(err));
    },
  ),
);


export default passport;
