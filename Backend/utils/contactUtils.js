const fs = require("fs").promises;
const path = require("path");

const CONTACT_FILE = path.join(__dirname, "../data/contacts.json");

const ensureContactFile = async () => {
  try {
    await fs.access(CONTACT_FILE);
  } catch {
    await fs.writeFile(CONTACT_FILE, JSON.stringify([]));
  }
};

exports.readContacts = async () => {
  await ensureContactFile();
  const data = await fs.readFile(CONTACT_FILE, "utf8");
  return JSON.parse(data);
};

exports.writeContact = async (contactData) => {
  await ensureContactFile();
  const contacts = await exports.readContacts();
  contacts.push(contactData);
  await fs.writeFile(CONTACT_FILE, JSON.stringify(contacts, null, 2));
  return contactData;
}; 