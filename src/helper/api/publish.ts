import { getAxiosInstance } from ".";

export const getPublish = async (daystart:string,dayend:string) => {
  const api = getAxiosInstance()
  const { data } = await api.get(`/publish?where[startDate]=${daystart}&where[endDate]=${dayend}`);
  return data;
};

export const createPublish = async (startDate:string, endDate:string) => {
  const api = getAxiosInstance()
  const payload={
    startDate,
    endDate,
    isPublish:true
  }
  const { data } = await api.post("/publish", payload);
  return data;
};