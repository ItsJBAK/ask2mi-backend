const express = require('express');
const cors = require('cors');
const { google } = require('googleapis');

const app = express();
app.use(cors());
app.use(express.json());

// Auth with service account
const auth = new google.auth.GoogleAuth({
  credentials: JSON.parse(process.env.GOOGLE_CREDENTIALS),
  scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});

const SHEET_ID = process.env.SHEET_ID;

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.post('/ask', async (req, res) => {
  try {
    const question = req.body.question;
    const timestamp = new Date().toISOString();

    const authClient = await auth.getClient();
    const sheets = google.sheets({ version: 'v4', auth: authClient });

    await sheets.spreadsheets.values.append({
      spreadsheetId: SHEET_ID,
      range: 'Ask2MiQuestions!A:B',
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        values: [[timestamp, question]],
      },
    });

    console.log('📨 Question saved to Google Sheets:', question);
    res.json({ status: 'success' });
  } catch (error) {
    console.error('❌ Error writing to sheet:', error);
    res.status(500).json({ error: 'Failed to save question.' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ Ask2Mi backend listening on port ${PORT}`));
