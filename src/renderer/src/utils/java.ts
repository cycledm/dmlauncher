import axios from "axios";
import { objectToCamel } from "ts-case-convert";

export async function fetchJava<T>(url: string): Promise<T> {
  // 以50%的概率抛出错误
  // if (Math.random() < 0.9) {
  //   console.error("Random error occurred while fetching Java data.");
  //   throw new Error("Random error occurred while fetching Java data.");
  // }
  console.log(`Fetching data from: ${url}`);
  const response = await axios.get<unknown>(url, { headers: { accept: "application/json" } });
  if (response.status !== 200) {
    throw new Error(`Failed to fetch: ${response.statusText}`);
  }

  if (typeof response.data !== "object" || response.data === null) {
    throw new Error(`Unexpected response format: ${typeof response.data}`);
  }

  if (response.data instanceof Array) {
    return objectToCamel(response.data[0]) as T;
  }

  return objectToCamel(response.data) as T;
}
