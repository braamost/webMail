
import { UserIsFound } from "../NewMail/EmailCreationHandling/CheckUserExistence";
import { createEmail } from "../NewMail/EmailCreationHandling/CreateEmail";
import { UserEmailCreation } from "../NewMail/EmailCreationHandling/addUserEmail";
export async function CreateStarredCopy(
  emailOfSender,
  receiverEmail,
  subject,
  body,
  isRead,
  folder,
  emailDirection,
) {
  try {
    const receiverId = await UserIsFound(receiverEmail);
    console.log(receiverId)
    const senderId = await UserIsFound(emailOfSender);
    console.log(senderId)
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
