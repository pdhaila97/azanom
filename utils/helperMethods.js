import { upperCase } from "lodash";

export function getUserInfo() {
  const userInfo = localStorage.getItem("userInfo");
  if (userInfo) {
    return JSON.parse(userInfo);
  }

  return {};
}

export function setUserInfo(userInfo) {
  localStorage.setItem("userInfo", JSON.stringify(userInfo));
}

export function deleteUserInfo() {
  localStorage.removeItem("userInfo");
  location.href = "/";
}

export function stringAvatar(name) {
  function stringToColor(string) {
    let hash = 0;
    let i;

    for (i = 0; i < string.length; i += 1) {
      hash = string.charCodeAt(i) + ((hash << 5) - hash);
    }

    let color = "#";

    for (i = 0; i < 3; i += 1) {
      const value = (hash >> (i * 8)) & 0xff;
      color += `00${value.toString(16)}`.slice(-2);
    }
    /* eslint-enable no-bitwise */

    return color;
  }
  return {
    sx: {
      bgcolor: stringToColor(name),
    },
    children: `${upperCase(name.split(" ")[0][0])}${name.split(" ")[1] ? upperCase(name.split(" ")[1][0]) : ''}`,
  };
}
