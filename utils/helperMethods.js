export function getUserInfo () {
    const userInfo = localStorage.getItem('userInfo');
    if(userInfo) {
        return JSON.parse(userInfo);
    }

    return {};
}

export function setUserInfo(userInfo) {
    localStorage.setItem('userInfo', JSON.stringify(userInfo));
}

export function deleteUserInfo() {
    localStorage.removeItem('userInfo');
}