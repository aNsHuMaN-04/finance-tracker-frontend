
const { google } = require('googleapis');
const fs = require('fs');
const path = require('path');

const auth = new google.auth.GoogleAuth({
  keyFile: path.join(__dirname, '../credentials.json'),
  scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});

async function addUserToSheet(userData) {
  const client = await auth.getClient();

  const sheets = google.sheets({ version: 'v4', auth: client });

const spreadsheetId = '10kxVikUY2ZdVznAWKNzvk790dkFZlkq9p-XkSwaCfks';

  const range = 'Sheet1!A1'; 

  const values = [
    [
      userData.name,
      userData.email,
      userData.password
    ]
  ];

  const resource = {
    values,
  };

  await sheets.spreadsheets.values.append({
    spreadsheetId,
    range,
    valueInputOption: 'USER_ENTERED',
    resource,
  });
}

module.exports = { addUserToSheet };
