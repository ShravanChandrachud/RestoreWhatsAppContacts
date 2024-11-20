const qrcode = require('qrcode-terminal');
const { Client, LocalAuth } = require('whatsapp-web.js'); // Correct import
const fs = require('fs');

// Create a WhatsApp client instance
const client = new Client({
    authStrategy: new LocalAuth(), // Use LocalAuth for session persistence
});

// Generate QR code when required
client.on('qr', (qr) => {
    // Generate and scan this code with your phone
    console.log('QR RECEIVED', qr);
});

// Log when the client is ready
client.on('ready', () => {
    console.log('Client is ready!');

    // Fetch all contacts
    client.getContacts().then((contacts) => {
        // Create a CSV string
        let csv = "Name,Phone Number\n";
        contacts.forEach((contact) => {
            if (!contact.isBusiness) {
                console.log("Contact = ", contact);
                const name = contact.name ? contact.name : 'Unknown Name';
                const phoneNumber = contact.number ? contact.number : 'Unknown Number';

                // Exclude business contacts
                if (name !== 'Unknown Name' && phoneNumber !== 'Unknown Number') {
                    csv += `${name},${phoneNumber}\n`;
                }
            }
        });

        // Save to CSV file
        fs.writeFileSync("contacts.csv", csv);
        console.log("Contacts saved to contacts.csv");
    });
});

// Handle errors
client.on('error', (err) => {
    console.error('Error:', err);
});

// Start the client
client.initialize();
