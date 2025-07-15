const { google } = require('googleapis');
const fs = require('fs');
const path = require('path');

const auth = new google.auth.GoogleAuth({
  keyFile: path.join(__dirname, '../credentials.json'),
  scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});

const spreadsheetId = '10kxVikUY2ZdVznAWKNzvk790dkFZlkq9p-XkSwaCfks';
const sheetName = 'Sheet1';

async function addUserToSheet(userData) {
  const client = await auth.getClient();
  const sheets = google.sheets({ version: 'v4', auth: client });

  const values = [[userData.name, userData.email, userData.password]];
  const resource = { values };

  await sheets.spreadsheets.values.append({
    spreadsheetId,
    range: `${sheetName}!A1`,
    valueInputOption: 'USER_ENTERED',
    resource,
  });
}

async function findUserByEmail(emailToFind) {
  const client = await auth.getClient();
  const sheets = google.sheets({ version: 'v4', auth: client });

  const response = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range: `${sheetName}!A:C`,
  });

  const rows = response.data.values;
  if (!rows || rows.length === 0) {
    return null;
  }

  for (let row of rows) {
    const [name, email, password] = row;
    if (email === emailToFind) {
      return { name, email, password };
    }
  }

  return null;
}

async function saveExpenseToSheet(data) {
  const client = await auth.getClient();
  const sheets = google.sheets({ version: 'v4', auth: client });

  const values = [[
    data.email,
    data.amount,
    data.category,
    data.date,
    data.paymentMode,
    data.dayOfWeek || ''
  ]];

  await sheets.spreadsheets.values.append({
    spreadsheetId,
    range: 'Expenses!A1',
    valueInputOption: 'USER_ENTERED',
    resource: { values }
  });
}

async function getExpensesByEmail(emailToFind) {
  const client = await auth.getClient();
  const sheets = google.sheets({ version: 'v4', auth: client });

  const response = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range: 'Expenses!A2:F',
  });

  const rows = response.data.values || [];

  const filtered = rows
    .filter(row => row[0] === emailToFind)
    .map(row => ({
      email: row[0],
      amount: row[1],
      category: row[2],
      date: row[3],
      paymentMode: row[4],
      dayOfWeek: row[5] || ''
    }));

  return filtered;
}

module.exports = {
  addUserToSheet,
  findUserByEmail,
  saveExpenseToSheet,
  getExpensesByEmail
};
