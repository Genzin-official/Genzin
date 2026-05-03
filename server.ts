import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { google } from 'googleapis';
import { GoogleAuth } from 'google-auth-library';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Google Sheets Helper
  async function appendToSheet(orderData: any) {
    const spreadsheetId = process.env.GOOGLE_SHEETS_ID;
    const clientEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
    const privateKey = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n');

    if (!spreadsheetId || !clientEmail || !privateKey) {
      console.warn('Google Sheets configuration missing. Skipping sync.');
      return;
    }

    try {
      const auth = new GoogleAuth({
        credentials: {
          client_email: clientEmail,
          private_key: privateKey,
        },
        scopes: ['https://www.googleapis.com/auth/spreadsheets'],
      });

      const sheets = google.sheets({ version: 'v4', auth });
      
      const values = [
        [
          new Date().toISOString(),
          orderData.id,
          orderData.userEmail,
          orderData.billingInfo.firstName + ' ' + orderData.billingInfo.lastName,
          orderData.billingInfo.address + ', ' + orderData.billingInfo.city + ' ' + orderData.billingInfo.zipCode,
          orderData.billingInfo.phone,
          orderData.items.map((item: any) => `${item.name} (${item.quantity})`).join('\n'),
          orderData.total,
          orderData.status
        ]
      ];

      await sheets.spreadsheets.values.append({
        spreadsheetId,
        range: 'A1',
        valueInputOption: 'USER_ENTERED',
        requestBody: {
          values,
        },
      });
      console.log('Order synced to Google Sheets successfully.');
    } catch (error) {
      console.error('Error syncing to Google Sheets:', error);
      throw error;
    }
  }

  // API Routes
  app.post('/api/sync-order', async (req, res) => {
    try {
      await appendToSheet(req.body);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: 'Failed to sync to Google Sheets' });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
