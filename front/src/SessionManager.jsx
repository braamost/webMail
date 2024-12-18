export const generateTabId = () => {
    return `tab_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  };
  
  export const getTabId = () => {
    let tabId = sessionStorage.getItem('tabId');
    if (!tabId) {
      tabId = generateTabId();
      sessionStorage.setItem('tabId', tabId);
    }
    return tabId;
  };
  
  export const getUserForTab = () => {
    const tabId = getTabId();
    const userSessions = JSON.parse(localStorage.getItem('userSessions')) || {};
    return userSessions[tabId] || null;
  };
  
  export const setUserForTab = (userData) => {
    const tabId = getTabId();
    const userSessions = JSON.parse(localStorage.getItem('userSessions')) || {};
    userSessions[tabId] = userData;
    localStorage.setItem('userSessions', JSON.stringify(userSessions));
  };
  
  export const removeUserForTab = () => {
    const tabId = getTabId();
    const userSessions = JSON.parse(localStorage.getItem('userSessions')) || {};
    delete userSessions[tabId];
    localStorage.setItem('userSessions', JSON.stringify(userSessions));
  };