
interface Contact {
  name: string;
  phone: string;
  email: string;
}

const CODE_WORDS_KEY = 'safewords_code_words';
const CONTACTS_KEY = 'contacts'; 

export const saveCodeWords = (codeWords: string[]): void => {
  localStorage.setItem(CODE_WORDS_KEY, JSON.stringify(codeWords));
};

export const loadCodeWords = (): string[] => {
  try {
    const savedWords = localStorage.getItem(CODE_WORDS_KEY);
    return savedWords ? JSON.parse(savedWords) : [];
  } catch (error) {
    console.error('Error loading code words:', error);
    return [];
  }
};


export const saveContacts = (contacts: Contact[]): void => {

  localStorage.setItem(CONTACTS_KEY, JSON.stringify(contacts));
  localStorage.setItem('safewords_contacts', JSON.stringify(contacts));
  console.log('Contacts saved to localStorage:', contacts);
};

export const loadContacts = (): Contact[] => {
  try {

    const savedContacts = localStorage.getItem(CONTACTS_KEY);
    

    const contactsData = savedContacts || localStorage.getItem('safewords_contacts');
    
    const contacts = contactsData ? JSON.parse(contactsData) : [];
    console.log('Contacts loaded from localStorage:', contacts);
    return contacts;
  } catch (error) {
    console.error('Error loading contacts:', error);
    return [];
  }
};
