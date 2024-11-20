import pandas as pd
from pywhatsapp import WhatsApp

# Create a WhatsApp instance
wa = WhatsApp()

# Scan QR code
print("Scan the QR code displayed in your terminal")
wa.login()

# Wait for login confirmation
while not wa.is_logged_in():
    pass

# Get all contacts
contacts = wa.get_contacts()

# Create a DataFrame
df = pd.DataFrame({
    "Name": [contact.name for contact in contacts],
    "Phone Number": [contact.phone_number for contact in contacts]
})

# Save to CSV file
df.to_csv("contacts.csv", index=False)

print("Contacts saved to contacts.csv")

