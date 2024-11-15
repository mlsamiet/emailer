import { google } from 'googleapis';
import fs from 'fs/promises';
import path from 'path';
const SCOPES = ['https://www.googleapis.com/auth/gmail.send'];
const TOKEN_PATH = path.join(process.cwd(), 'token.json');
const CREDENTIALS_PATH = path.join(process.cwd(), 'credentials.json');
const EMAILS_PATH = path.join(process.cwd(), 'utils/emails.txt');
const BODY_PATH = path.join(process.cwd(), 'utils/body.txt');
async function authorize() {
    const credentials = JSON.parse(await fs.readFile(CREDENTIALS_PATH, 'utf-8'));
    const { client_secret, client_id, redirect_uris } = credentials.installed;
    const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);

    try {
        const token = JSON.parse(await fs.readFile(TOKEN_PATH, 'utf-8'));
        oAuth2Client.setCredentials(token);
    } catch (error) {
        const authUrl = oAuth2Client.generateAuthUrl({
            access_type: 'offline',
            scope: SCOPES,
        });
        console.log('Authorize this app by visiting this URL:', authUrl);

        const code = await new Promise<string>((resolve) => {
            const rl = require('readline').createInterface({
                input: process.stdin,
                output: process.stdout,
            });
            rl.question('Enter the authorization code here: ', (code: string) => {
                rl.close();
                resolve(code);
            });
        });

        const tokenResponse = await oAuth2Client.getToken(code);
        oAuth2Client.setCredentials(tokenResponse.tokens);

        await fs.writeFile(TOKEN_PATH, JSON.stringify(tokenResponse.tokens));
        console.log('Token saved to', TOKEN_PATH);
    }

    return oAuth2Client;
}

function createEmail(to: string, subject: string, body: string) {
    const messageParts = [
        `To: ${to}`,
        'Content-Type: text/html; charset=UTF-8',
        `Subject: ${subject}`,
        '',
        body,
    ];
    const message = messageParts.join('\n');
    const encodedMessage = Buffer.from(message)
        .toString('base64')
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+$/, '');

    return encodedMessage;
}

async function sendEmail(auth: any, to: string, subject: string, body: string) {
    const gmail = google.gmail({ version: 'v1', auth });
    const raw = createEmail(to, subject, body);

    await gmail.users.messages.send({
        userId: 'me',
        requestBody: {
            raw,
        },
    });
    console.log(`Email sent to ${to}`);
}

async function getEmails() {
    const emailData = await fs.readFile(EMAILS_PATH, 'utf-8');
    return emailData.split('\n').map(email => email.trim()).filter(email => email);
}

async function getBodyContent() {
    return await fs.readFile(BODY_PATH, 'utf-8'); 
}

export async function sendBulkEmails(subject: string) {
    const auth = await authorize();
    const recipients = await getEmails();
    const body = await getBodyContent();

    for (const recipient of recipients) {
        try {
            await sendEmail(auth, recipient, subject, body);
        } catch (error) {
            console.error(`Error sending email to ${recipient}:`, error);
        }
    }
}

