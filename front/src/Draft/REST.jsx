import apiClient from '../utils/apiUtils';
import {UserEmailCreation} from '../NewMail/EmailCreationHandling/addUserEmail';



export async function saveDraft( toMail, subject, body, attachments,user ) {
    
    let draftData = {
        toMail,
        subject,
        body,
        attachments
    };

    console.log("Sending draft data:", draftData); // Debugging log

    try {
        const response = await apiClient.post("/api/emails/drafts/save", draftData);
        console.log("Draft saved:", response.data);
        const draftId = response.data.id;
        const receiverId = await UserEmailCreation(user.id, user.id, draftId);
        return draftId;
    } catch (error) {
        console.error("Error saving draft:", error);
    }
}

export async function updateDraft(draftId,toMail,subject,body,attachments) {
    try {
        console.log("Updating draft:", draftId); // Debugging log
        await apiClient.put(`/api/emails/drafts/update/${draftId}`, {
            toMail,
            subject,
            body,
            attachments
        });
    } catch (error) {
        console.error("Error updating draft:", error);
    }
}

export async function deleteDraft(draftId, userId) {
    try {
        await apiClient.delete(`/api/userEmails/${userId}/${userId}/${draftId}`);
        await apiClient.delete(`/api/emails/drafts/delete/${draftId}`);
        

    } catch (error) {
        console.error("Error deleting draft:", error);
    }
}
export async function fetchDrafts(userId) {
    try {
        const response = await apiClient.get(`/api/userEmails/emails/${userId}/draft`);
        console.log("Fetched drafts:", response.data);
        return response.data; // Return the draft object
    } catch (error) {
        console.error("Error fetching draft:", error);
        return null;
    }
}
