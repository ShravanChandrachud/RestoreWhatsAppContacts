const qrcode = require('qrcode-terminal');
const { Client, LocalAuth } = require('whatsapp-web.js');
const fs = require('fs');
const puppeteer = require('puppeteer'); // Import puppeteer


// Create a WhatsApp client instance
const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: {
        executablePath: puppeteer.executablePath() // Set the executable path for Chromium
    }
});

// Function to introduce a delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Function to retrieve contacts with delay
async function retrieveContacts() {
    try {
        const contacts = await client.getContacts();
        const contactMap = new Map();

        for (const contact of contacts) {
            if (!contact.isBusiness) {
                const name = contact.name ? contact.name : 'Unknown Name';
                const phoneNumber = contact.number ? contact.number : 'Unknown Number';

                if (name !== 'Unknown Name' && phoneNumber !== 'Unknown Number') {
                    contactMap.set(name, phoneNumber);
                }
            }
        }

        console.log(`Total Contacts Retrieved: ${contactMap.size}`);

        // Create CSV from the map
        let csv = "Name,Phone Number\n";
        contactMap.forEach((phoneNumber, name) => {
            csv += `${name},${phoneNumber}\n`;
        });

        // Save to CSV file
        fs.writeFileSync("contacts.csv", csv);
        console.log("Contacts saved to contacts.csv");

    } catch (err) {
        console.error('Failed to retrieve contacts:', err);
    } finally {
        process.exit(0);
    }
}

// Generate QR code when required
client.on('qr', (qr) => {
    console.log('QR RECEIVED', qr);
    qrcode.generate(qr, { small: true });
    console.log('Scan the QR code displayed above');
});

// Log when the client is ready
client.on('ready', async () => {
    console.log('Client is ready!');
    await delay(60000);
    await retrieveContacts(); // Call the function to retrieve contacts
});

// Handle errors
client.on('error', (err) => {
    console.error('Error:', err);
    process.exit(1);
});

// Start the client
client.initialize();