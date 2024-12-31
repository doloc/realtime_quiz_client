// Cookie utility functions
export const COOKIE_EXPIRY = {
    HOUR: 1/24,  // 1 hour in days
    DAY: 1,
    WEEK: 7,
    MONTH: 30
};

export const setCookie = (name: string, value: string, expiryInDays: number) => {
    const date = new Date();
    date.setTime(date.getTime() + (expiryInDays * 24 * 60 * 60 * 1000));
    const expires = `expires=${date.toUTCString()}`;
    document.cookie = `${name}=${value};${expires};path=/;SameSite=Strict`;
};

export const getCookie = (name: string): string | null => {
    const nameEQ = `${name}=`;
    const cookies = document.cookie.split(';');
    
    for (let i = 0; i < cookies.length; i++) {
        let cookie = cookies[i];
        while (cookie.charAt(0) === ' ') {
        cookie = cookie.substring(1, cookie.length);
        }
        if (cookie.indexOf(nameEQ) === 0) {
        return cookie.substring(nameEQ.length, cookie.length);
        }
    }
    return null;
};

export const deleteCookie = (name: string) => {
    document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
};