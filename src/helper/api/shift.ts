import { getAxiosInstance } from ".";

export const getShifts = async (daystart:string,dayend:string) => {
  const api = getAxiosInstance()
  const { data } = await api.get(`/shifts?order=DESC&order=ASC&cache=${daystart}&cache=${dayend}`);
  return data;
};

export const getShiftById = async (id: string) => {
  const api = getAxiosInstance()
  const { data } = await api.get(`/shifts/${id}`);
  return data;
};

export const createShifts = async (payload: any) => {
  const api = getAxiosInstance()
  const { data } = await api.post("/shifts", payload);
  return data;
};

export const updateShiftById = async (id: string, payload: any) => {
  const api = getAxiosInstance()
  const { data } = await api.patch(`/shifts/${id}`, payload);
  return data;
};

export const deleteShiftById = async (id: string, startDate:string, endDate:string) => {
  const api = getAxiosInstance()
  const { data } = await api.delete(`/shifts/${id}?startDate=${startDate}&endDate=${endDate}`);
  return data;
};