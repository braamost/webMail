
import { UserIsFound } from "./CheckUserExistence";
import { createEmail } from "./CreateEmail";
import { UserEmailCreation } from "./addUserEmail";
export async function emailCreation(
  senderId,
  receiverEmail,
  subject,
  body,
  isRead,
  folder,
  emailDirection,
  setError
) {
  try {
    const receiverId = await UserIsFound(receiverEmail);

    const emailId = await createEmail(subject, body, isRead, folder,emailDirection);

    const userEmailData = await UserEmailCreation(senderId, receiverId, emailId);

    return emailId;
  } catch (error) {
    if (error.response) {
      const { status, data } = error.response;
      if (status === 404) {
        setError(data.message || data);
      } else {
        setError(`Server error: ${data.message || data}`);
      }
    } else if (error.request) {
      setError("No response from server. Please check your connection.");
    } else {
      setError(`Error: ${error.message}`);
    }
    return null;
  }
}
