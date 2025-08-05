const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.post('/ask', (req, res) => {
  const question = req.body.question;
  console.log('📨 New question received:', question);
  res.json({ status: 'success', received: question });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ Ask2Mi backend listening on port ${PORT}`));
