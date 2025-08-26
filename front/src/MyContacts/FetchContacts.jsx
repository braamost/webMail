import axios from 'axios';

export async function FetchContacts(user) {
    try {
        const response = await axios.get(`http://localhost:8080/api/contacts/user/${user.id}`, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${user.token}` 
            }
        });
        console.log(response.data , "zz");

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



export async function CreateContact(user, userName, email , setError) {
  const contactData = {
      contactName: userName,
      contactEmail: email,
      user: {id:user.id}
  };
  console.log(contactData);
  try {
      const response = await axios.post('http://localhost:8080/api/contacts', contactData, { 
          headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${user.token}`
          },
      });

      const newContact = response.data;
      console.log('Contact added:', newContact);
      return newContact; // Return the created contact
  } catch (error) {
      setError(error.response?.data?.message || 'Error creating contact');
      console.error('Error creating contact:', error);
  }
}



 export async function handleDeleteContact (user, contactId, setError) {
  try {
      const response = await axios.delete(`http://localhost:8080/api/contacts/${contactId}`,{
          headers: {
              "Authorization" : `Bearer ${user.token}`
          },
      });
      console.log(`Contact with ID ${contactId} successfully deleted.`);
  } catch (error) {
        setError(error.response?.data?.message || 'Error deleting contact');
        console.error("Error deleting contact:", error);
  }
};

