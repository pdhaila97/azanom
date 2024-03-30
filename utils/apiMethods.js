import axios from "axios";
import { deleteUserInfo, getUserInfo } from "./helperMethods";
import { get } from "lodash";

export async function axiosCall(
  url,
  method = "GET",
  data = null,
  headers = {},
  options = {}
) {
  const { sendToken = false } = options;
  try {

    const response = await axios({
      method,
      url,
      data,
      headers: {
        ...headers,
        ...(sendToken ? {'Authorization': 'Bearer ' + get(getUserInfo(), 'token')} : {})
      },
    });
    return response.data;
  } catch (error) {
    if(error?.response?.data?.message === 'jwt expired') {
      deleteUserInfo();
    }
    throw error?.response?.data; // Re-throw the error for further handling
  }
}
