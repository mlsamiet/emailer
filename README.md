
# Bulk Email Sender using Gmail API and Bun
This script allows you to send bulk emails using Gmail's API. The email content is loaded from a text file, and the recipients are fetched from a separate text file. The script is built using TypeScript and can be executed using `bun`.
## Table of Contents
- [Installation](#installation)
- [Creating Tokens and Authorization](#creating-tokens-and-authorization)
- [Adding Email Body and Recipients](#adding-email-body-and-recipients)
- [Using `bun send` to Send Emails](#using-bun-send-to-send-emails)

## Installation

Follow the steps below to install the necessary packages and set up the project.

1. **Clone or download the repository** to your local machine.

2. **Install Bun** (if not already installed):
   - Bun is a fast JavaScript bundler and runtime. To install it, run:
     ```bash
     curl -fsSL https://bun.sh/install | bash
     ```
   - For more installation details, visit [https://bun.sh](https://bun.sh).

3. **Install Dependencies**:
   - The script uses `googleapis` for the Gmail API and `fs/promises` for file handling.
   - Install the dependencies by running the following command:
     ```bash
     bun install 
     ```

## Creating Tokens and Authorization

Before sending emails, you need to authenticate your app using Google's OAuth 2.0 credentials.

### Step-by-Step Authorization

1. **Run the Script to Get the Authorization Code**:
   - To start the OAuth flow, execute the following command:
     ```bash
     bun send
     ```
   
2. **Get the Authorization URL**:
   - When running the script for the first time, it will log a URL to the console. Copy and paste that URL into your browser to grant access to the Gmail API.
     - Example:
       ```
       Authorize this app by visiting this URL: https://accounts.google.com/o/oauth2/v2/auth?access_type=offline&scope=**
       ```

3. **Enter the Authorization Code**:
   - After granting permission, Google will redirect you to `localhost` with a code in the URL (e.g., `http://localhost/?code=AUTHORIZATION_CODE`).
   - Copy the authorization code and paste it into the console when prompted.
   - The script will then save the token in `token.json` for future use.

## Adding Email Body and Recipients

### 1. **Add Recipients in `emails.txt`**:
   - Create a file called `emails.txt` in your project directory.
   - Add one email per line like this:
     ```
     email1@example.com
     email2@example.com
     email3@example.com
     ```

### 2. **Add Email Body in `body.txt`**:
   - Create a file called `body.txt` in your project directory.
   - Write the HTML-formatted email content inside this file, such as:
     ```html
     <p>Hello,</p>
     <p>This is a bulk email test.</p>
     <p>Thank you!</p>
     ```

## Using `bun send` to Send Emails

### Step-by-Step Usage

1. **Edit the Subject Line**:
   - Open `index.ts` and change the subject line in the code if needed:
     ```typescript
     const subject = 'Your Custom Subject Here';
     ```

2. **Send Emails**:
   - Run the following command to send the bulk emails:
     ```bash
     bun send
     ```

   - The script will read the emails from `emails.txt`, fetch the body from `body.txt`, and send the emails using the Gmail API.

### Expected Output

- For each email, the script will output:
  ```
  Email sent to email1@example.com
  Email sent to email2@example.com
  ...
  ```
- If there’s an error, it will be logged for the recipient.

---

## Troubleshooting

- **Authorization Issues**:
  - Ensure that you’ve granted access to the Gmail API by following the authorization steps correctly. If the token expires, simply re-run the script to generate a new token.

- **Email Not Sent**:
  - Double-check that your `emails.txt` file is formatted correctly (one email per line).
  - Ensure your Gmail account is able to send bulk emails. Google may limit the number of emails that can be sent in a short period.

