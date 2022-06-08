const express = require('express');
const users = require('../models/users');
const records = require('../models/records');

const router = express.Router();

/* GET home page. */
router.get('/login', (req, res) => {
  let username = req.query.username || req.params.username;
  // let ip = req.connection.remoteAddress;
  // let port = req.connection.remotePort;
  let sessionId = req.session.id;
  console.log(sessionId);
  if (username) {
    req.session.username = username;
    users.addUser(username, sessionId);

    res.json({
      msg: 'success',
      code: '200',
    });
  } else {
    res.json({
      msg: 'username is required',
      code: '201',
    });
  }
});

router.get('/logout', (req, res) => {
  if (req.session.username) {
    req.session.destroy((err) => {
      if (err) {
        console.log(err);
      }
    });
    res.clearCookie('iouser', { path: '/' });
    res.json({
      code: '200',
      msg: 'success',
    });
  } else {
    res.json({
      code: '202',
      msg: 'log out error,you are not logged in',
    });
  }
});

router.get('/others', (req, res) => {
  let sessionId = req.session.id;
  let username = req.session.username;
  if (sessionId && username) {
    res.json({
      msg: 'success',
      code: '200',
      data: users.otherUsers(sessionId),
    });
  } else {
    res.json({
      msg: 'sessionId and username are not null',
      code: '203',
    });
  }
});

router.get('/testlogin', (req, res) => {
  // console.log(req.cookies);
  // console.log(req.signedCookies);
  // console.log(req.session);
  let username = req.session.username;
  if (username) {
    res.json({
      msg: 'logged in',
      code: '200',
      username,
    });
  } else {
    res.json({
      msg: 'not log in',
      code: '204',
    });
  }
});

router.get('/records', (req, res) => {
  records.getAllRecords()
    .then((docs) => {
      console.log(docs);
      res.json({
        code: 200,
        msg: 'success',
        data: docs,
      });
    })
    .catch((err) => {
      console.log(err);
      res.json({
        code: '205',
        msg: 'get records error',
      });
    });
});

router.get('/user', (req, res) => {
  let sessionId = req.session.id;
  let username = req.session.username;
  if (username) {
    res.json({
      code: '200',
      msg: '',
      data: {
        sessionId,
        username,
      },
    });
  } else {
    res.json({
      code: '206',
      msg: 'not log in',
    });
  }
});

module.exports = router;
