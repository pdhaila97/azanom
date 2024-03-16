import axios from "axios";
import { getUserInfo } from "./helperMethods";
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
    throw error?.response?.data; // Re-throw the error for further handling
  }
}
