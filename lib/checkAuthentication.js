import { getTokenFromLocalCookie } from "./auth";

export const checkAuthentication = async () => {
    let token = getTokenFromLocalCookie() || null;
    return !!token; // Return true if token exists, indicating that the user is authenticated
};
