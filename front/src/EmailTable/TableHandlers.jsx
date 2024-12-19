import axios from "axios";

export async function MovetoFolder(folder, id, setError) {
  try {
    console.log("folder and id ", folder, id);
    const response = await axios.put(
      `http://localhost:8080/api/emails/${folder}/${id}`
    );
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
    throw error;
  }
}

export const handleRefresh = () => {
  window.location.reload(); // Refresh the page
};

// Button Handlers

export const handleSelectedOnClick = async (
  folder,
  selectedRows,
  setError,
  setEmails
) => {
  const shouldKeepInView = folder === "read" || folder === "starred";
  const currentPath = window.location.pathname;
  const isStarredRoute = currentPath.includes("/Starred");

  try {
    // Optimistically update UI
    setEmails((prevEmails) => {
      if (shouldKeepInView) {
        return prevEmails
          .map((email) => {
            const isSelected = selectedRows.find(
              (selected) => selected.id === email.id
            );
            if (isSelected) {
              const newValue =
                !email[folder === "starred" ? "isStarred" : "isRead"];

              // If we're in Starred route and unstarring, filter out the email
              if (isStarredRoute && folder === "starred" && !newValue) {
                return null;
              }

              return {
                ...email,
                [folder === "starred" ? "isStarred" : "isRead"]: newValue,
              };
            }
            return email;
          })
          .filter(Boolean); // Remove null entries
      } else {
        // Remove emails that are being moved to other folders
        return prevEmails.filter(
          (email) => !selectedRows.find((selected) => selected.id === email.id)
        );
      }
    });

    // Perform API calls
    await Promise.all(
      selectedRows.map((email) => MovetoFolder(folder, email.id, setError))
    );
  } catch (error) {
    console.error("Failed to update emails", error);
    setError(`Failed to update emails`);
  }
};

export const handleIconClick = async (folder, email, setError, setEmails) => {
  const shouldKeepInView = folder === "read" || folder === "starred";
  const currentPath = window.location.pathname;
  const isStarredRoute = currentPath.includes("/Starred");

  try {
    await MovetoFolder(folder, email.id, setError);

    setEmails((prevEmails) => {
      if (shouldKeepInView) {
        return prevEmails
          .map((e) => {
            if (e.id === email.id) {
              const newValue =
                !e[folder === "starred" ? "isStarred" : "isRead"];

              // If we're in Starred route and unstarring, filter out the email
              if (isStarredRoute && folder === "starred" && !newValue) {
                return null;
              }

              return {
                ...e,
                [folder === "starred" ? "isStarred" : "isRead"]: newValue,
              };
            }
            return e;
          })
          .filter(Boolean); // Remove null entries
      } else {
        // Remove email for other folder moves
        return prevEmails.filter((e) => e.id !== email.id);
      }
    });
  } catch (error) {
    console.error("Failed to update email", error);
    setError(`Failed to update email`);
  }
};

export const formatTimestamp = (timestamp) => {
  if (!timestamp) return "";
  const date = new Date(timestamp);
  return date.toLocaleString();
};
