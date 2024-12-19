import axios from 'axios';

export async function FetchContacts(userId) {
    try {
        const response = await axios.get(`http://localhost:8080/api/contacts/user/${userId}`, {
            headers: {
                'Content-Type': 'application/json',
            }
        });
        console.log(response.data , "gggg");
        return response.data;
    } catch (error) {
        if (error.response) {
            // Server responded with error status
            throw new Error(`Server error: ${error.response.status} - ${error.response.data}`);
        } else if (error.request) {
            // Request was made but no response received
            throw new Error('No response received from server');
        } else {
            // Error in request setup
            throw new Error(`Error setting up request: ${error.message}`);
        }
    }
}



export async function CreateContact(userId, userName, email , setError) {
  const contactData = {
      contactName: userName,
      contactEmail: email,
      user: { id: userId } // Include the user object with an id
  };
  console.log(contactData);

  try {
      const response = await fetch('http://localhost:8080/api/contacts', { // Adjust URL if necessary
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify(contactData),
      });

      if (!response.ok) {
          throw new Error(`Error: ${response.statusText}`);
      }

      const newContact = await response.json();
      console.log('Contact added:', newContact);
      return newContact; // Return the created contact
  } catch (error) {
      setError("The User Email Not Found");
      console.error('Error creating contact:', error);
      throw error;
  }
}



 export async function handleDeleteContact (contactId) {
  try {
      const response = await fetch("http://localhost:8080/api/contacts", {
          method: "DELETE",
          headers: {
              "Content-Type": "application/json",
          },
          body: JSON.stringify({ id: contactId }), // Send only the ID
      });

      if (!response.ok) {
          throw new Error(`Failed to delete contact with ID: ${contactId}`);
      }

      console.log(`Contact with ID ${contactId} successfully deleted.`);
  } catch (error) {
      console.error("Error deleting contact:", error);
  }
};

