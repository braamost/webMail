import axios from 'axios';
import {UserEmailCreation} from '../NewMail/EmailCreationHandling/addUserEmail';



export async function saveDraft( toMail, subject, body, attachments,user) {
    // Create draft data without id
    let draftData = {
        toMail,
        subject,
        body,
        attachments
    };


   

    console.log("Sending draft data:", draftData); // Debugging log

    try {
        const response = await axios.post("http://localhost:8080/api/emails/drafts/save", draftData);
        console.log("Draft saved:", response.data.id);
        const draftId = response.data.id;
        const receiverId = await UserEmailCreation(user.id, user.id, draftId);
        return draftId;
    } catch (error) {
        console.error("Error saving draft:", error);
    }
}

export async function updateDraft(draftId, userId, toMail, subject, message, attachments) {
    try {
        await axios.put(`http://localhost:8080/api/drafts/${draftId}`, {
            userId,
            toMail,
            subject,
            message,
            attachments
        });
    } catch (error) {
        console.error("Error updating draft:", error);
    }
}

export async function deleteDraft(draftId) {
    try {
        await axios.delete(`http://localhost:8080/api/emails/drafts/delete/${draftId}`);
    } catch (error) {
        console.error("Error deleting draft:", error);
    }
}
export async function fetchDrafts(userId) {
    try {
        const response = await axios.get(`http://localhost:8080/api/drafts/${userId}`);
        return response.data; // Return the draft object
    } catch (error) {
        console.error("Error fetching draft:", error);
        return null;
    }
}
