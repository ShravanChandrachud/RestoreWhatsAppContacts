const qrcode = require('qrcode-terminal');
const { Client, LocalAuth } = require('whatsapp-web.js'); // Correct import
const fs = require('fs');

// Create a WhatsApp client instance
const client = new Client({
    authStrategy: new LocalAuth(), // Use LocalAuth for session persistence
});

// Generate QR code when required
client.on('qr', (qr) => {
    console.log('QR RECEIVED', qr);
    qrcode.generate(qr, { small: true });
    console.log('Scan the QR code displayed above');
});

// Log when the client is ready
client.on('ready', () => {
    console.log('Client is ready!');

    client.getContacts().then((contacts) => {
        const contactMap = new Map();

        contacts.forEach((contact) => {
            if (!contact.isBusiness) {
                const name = contact.name ? contact.name : 'Unknown Name';
                const phoneNumber = contact.number ? contact.number : 'Unknown Number';

                if (name !== 'Unknown Name' && phoneNumber !== 'Unknown Number') {
                    // Overwrite previous entry with the latest one
                    contactMap.set(name, phoneNumber);
                }
            }
        });

        // Create CSV from the map
        let csv = "Name,Phone Number\n";
        contactMap.forEach((phoneNumber, name) => {
            csv += `${name},${phoneNumber}\n`;
        });

        // Save to CSV file
        fs.writeFileSync("contacts.csv", csv);
        console.log("Contacts saved to contacts.csv");

        process.exit(0);
    });
});

// Handle errors
client.on('error', (err) => {
    console.error('Error:', err);
    process.exit(1);
});

// Start the client
client.initialize();
