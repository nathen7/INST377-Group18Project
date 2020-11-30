// These are our required libraries to make the server work.
/* eslint-disable no-console */
/* eslint-disable no-unused-vars */
import express from 'express';
import dotenv from 'dotenv';
import fetch from 'node-fetch';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

const headers = {
  "Content-Type": "application/json",
  "X-API-Key": "OnpCHRo4oN6GSlWRpONklKsOJv5RxiyXriiKrzJq"
}

app.route('/house/members')
  .get(async(req, res) => {
    const data = await fetch('https://api.propublica.org/congress/v1/116/house/members.json',
      { 
        method: 'GET',
        headers: headers
      }
    );
    const json = await data.json();
    res.json(json.results[0]);
  })
  .post(async(req, res) => {
    console.log('POST request detected');
    // const data = await fetch('https://data.princegeorgescountymd.gov/resource/umjn-t2iz.json');
    // const json = await data.json();
    // console.log('fetch request data', data);
    // res.json(json);
    //console.log('Form data in res.body', req.body);
    //res.json(countries);
  });

app.route('/senate/members')
  .get(async(req, res) => {
    const data = await fetch('https://api.propublica.org/congress/v1/116/senate/members.json',
      { 
        method: 'GET',
        headers: headers
      }
    );
    const json = await data.json();
    res.json(json.results[0]);
  })
  .post(async(req, res) => {
    console.log('POST request detected');
    // const data = await fetch('https://data.princegeorgescountymd.gov/resource/umjn-t2iz.json');
    // const json = await data.json();
    // console.log('fetch request data', data);
    // res.json(json);
    //console.log('Form data in res.body', req.body);
    //res.json(countries);
  });

app.route('/profile')
  .get(async(req, res) => {
    const memberId = req.query.memberId;
    console.log("memberId=", memberId);
    const data = await fetch('https://api.propublica.org/congress/v1/members/' + memberId + '.json',
    { 
      method: 'GET',
      headers: headers
    }
    );
    const json = await data.json();
    res.json(json.results[0]);
  })
  .post(async(req, res) => {
    console.log('POST request detected');
    // const data = await fetch('https://data.princegeorgescountymd.gov/resource/umjn-t2iz.json');
    // const json = await data.json();
    // console.log('fetch request data', data);
    // res.json(json);
    //console.log('Form data in res.body', req.body);
    //res.json(countries);
  });

app.route('/memberBills')
  .get(async(req, res) => {
    const memberId = req.query.memberId;
    console.log("memberId=", memberId);
    const data = await fetch('https://api.propublica.org/congress/v1/members/' + memberId + '/bills/active.json',
    { 
      method: 'GET',
      headers: headers
    }
    );
    const json = await data.json();
    res.json(json.results[0]);
  })
  .post(async(req, res) => {
    console.log('POST request detected');
    // const data = await fetch('https://data.princegeorgescountymd.gov/resource/umjn-t2iz.json');
    // const json = await data.json();
    // console.log('fetch request data', data);
    // res.json(json);
    //console.log('Form data in res.body', req.body);
    //res.json(countries);
  });

app.listen(port, () => {
  console.log(`Example app listening on port ${port}!`);
});
