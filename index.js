const nodemailer = require('nodemailer');
const mg = require('nodemailer-mailgun-transport');

const transporter = nodemailer.createTransport(
  mg({
    auth: {
      api_key: process.env.MAILGUN_API_KEY,
      domain: process.env.MAILGUN_DOMAIN,
    },
  }),
);
const express = require('express');
const bodyParser = require('body-parser');
const app = express();

app.set('port', (process.env.PORT || 3000));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.use(function(req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Cache-Control', 'no-cache');
    next();
});

app.post('/send-email', function(req, res) {
  const info = transporter.sendMail({
    from: process.env.MAILGUN_SENDER,
    to: req.body.event.data.new.email,
    subject: 'Your report is ready!',
    text: 'See attached report PDF',
  }).then(() => {
    res.json({'success': true})
  });
});

app.listen(app.get('port'), function() {
  console.log('Server started on: ' + app.get('port'));
});