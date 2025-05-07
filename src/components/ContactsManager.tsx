
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { X, Info } from "lucide-react";
import { toast } from "sonner";
import { saveContacts } from "@/utils/storageService";

interface Contact {
  name: string;
  phone: string;
  email: string;
}

interface ContactsManagerProps {
  contacts: Contact[];
  setContacts: React.Dispatch<React.SetStateAction<Contact[]>>;
}

const ContactsManager = ({ contacts, setContacts }: ContactsManagerProps) => {
  const [newContact, setNewContact] = useState<Contact>({
    name: "",
    phone: "",
    email: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewContact(prev => ({ ...prev, [name]: value }));
  };

  const addContact = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newContact.name.trim()) {
      toast.error("Please enter a contact name");
      return;
    }
    
    if (!newContact.phone.trim() && !newContact.email.trim()) {
      toast.error("Please enter at least a phone number or email");
      return;
    }

    // Email validation
    if (newContact.email.trim() && !validateEmail(newContact.email)) {
      toast.error("Please enter a valid email address");
      return;
    }
    
    // Check if we've hit the maximum of 5 contacts
    if (contacts.length >= 5) {
      toast.error("Maximum of 5 emergency contacts allowed");
      return;
    }
    
    const updatedContacts = [...contacts, { ...newContact }];
    setContacts(updatedContacts);
    saveContacts(updatedContacts);
    setNewContact({ name: "", phone: "", email: "" });
    toast.success("Emergency contact added");
  };

  const removeContact = (contactToRemove: Contact) => {
    const updatedContacts = contacts.filter(
      contact => contact.name !== contactToRemove.name || 
                contact.phone !== contactToRemove.phone
    );
    setContacts(updatedContacts);
    saveContacts(updatedContacts);
    toast.info("Contact removed");
  };
  
  // Simple email validation function
  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  return (
    <div className="space-y-4 mt-8">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-medium">Emergency Contacts</h3>
        <div className="text-xs text-muted-foreground">
          {contacts.length}/5 contacts
        </div>
      </div>
      
      <p className="text-muted-foreground">
        Add up to 5 people who will receive alerts when your code word is detected
      </p>
      
      {contacts.length === 5 && (
        <div className="flex items-center gap-2 p-3 bg-colors-bg--500 border border-tertiary--800 rounded-md text-tertiary--500">
          <Info className="h-4 w-4" />
          <p className="text-sm">Maximum 5 contacts reached. Remove a contact to add another.</p>
        </div>
      )}
      
      {contacts.length < 5 && (
        <form onSubmit={addContact} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                name="name"
                value={newContact.name}
                onChange={handleInputChange}
                placeholder="Contact name"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                name="phone"
                type="tel"
                value={newContact.phone}
                onChange={handleInputChange}
                placeholder="Phone number"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={newContact.email}
                onChange={handleInputChange}
                placeholder="Email address"
              />
            </div>
          </div>
          
          <div className="flex justify-end">
            <Button type="submit">Add Contact</Button>
          </div>
        </form>
      )}
      
      {contacts.length > 0 ? (
        <div className="space-y-2 mt-4">
          {contacts.map((contact, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-muted rounded-md">
              <div>
                <p className="font-medium">{contact.name}</p>
                <div className="text-sm text-muted-foreground">
                  {contact.phone && <p>{contact.phone}</p>}
                  {contact.email && <p>{contact.email}</p>}
                </div>
              </div>
              <button
                onClick={() => removeContact(contact)}
                className="p-1 hover:bg-background rounded"
                aria-label="Remove contact"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      ) : (
        <p className="italic text-muted-foreground">No emergency contacts added yet</p>
      )}
    </div>
  );
};

export default ContactsManager;
