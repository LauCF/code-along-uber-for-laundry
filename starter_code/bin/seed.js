require('dotenv').config();

const mongoose = require('mongoose');
const User = require('../models/User');

const dbName = process.env.DBURL;
mongoose.connect('mongodb://localhost/uber-for-loundry', {useMongoClient: true});

const user = [
  {
    name: "Laura",
    email: "lau@lau.com",
    password: 123,
    isLaunderer: false,
    fee: null
  },
  {
    name: "Ismael",
    email: "ismael@ismael.com",
    password: "abc",
    isLaunderer: true,
    fee: 5
  },
  {
    name: "Paco",
    email: "paco@paco.com",
    password: 456,
    isLaunderer: false,
    fee: null
  },
]

User.create(user, (err, data) => {
  if (err) { throw(err) }
  console.log(`Created ${user.length} user`);
  mongoose.connection.close()
});