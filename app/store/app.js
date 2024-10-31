import { blueClient } from "./client";
import { create } from "zustand";

import { useLogInStore } from "./login";
// import { useFeatureStore } from './feature'

export const useAppStore = create((set, get) => ({
  app: null,
  apps: [],
  app_matrix: [],
  drop_apps: [],
  filter: "",
  total: 0,
  pages: 1,
  page: 1,
  size: 15,
  filtered_apps: [],
  status: null,
  getApps: async (page, size) => {
    let token = useLogInStore.getState().access_token;
    await blueClient
      .request({
        method: "GET",
        url: `/app?page=${page}&size=${size}`,
        headers: {
          "Content-Type": "application/json",
          "X-APP-TOKEN": token,
        },
      })
      .then(function (response) {
        set((state) => ({
          ...state,
          apps: response?.data?.data,
          filtered_apps: response?.data?.data,
          total: response?.data?.total,
          pages: response?.data?.pages,
          status: response?.status,
        }));
      })
      .catch((response) => {
        const responseError = response.response.data.details;
        console.log(responseError);
      });
  },
  getDropApps: async () => {
    let token = useLogInStore.getState().access_token;

    await blueClient
      .request({
        method: "GET",
        url: `/appsdrop`,
        headers: {
          "Content-Type": "application/json",
          "X-APP-TOKEN": token,
        },
      })
      .then(function (response) {
        set((state) => ({
          ...state,
          drop_apps: response?.data?.data,
        }));
      })
      .catch((response) => {
        const responseError = response.response.data.details;
        console.log(responseError);
      });
  },
  getSingleApp: async (id) => {
    let token = useLogInStore.getState().access_token;

    await blueClient
      .request({
        method: "GET",
        url: `/app/${id}`,
        headers: {
          "Content-Type": "application/json",
          "X-APP-TOKEN": token,
        },
      })
      .then(function (response) {
        set((state) => ({
          ...state,
          app: response?.data?.data,
          status: response?.status,
        }));
      })
      .catch((response) => {
        const responseError = response.response.data.details;
        console.log(responseError);
      });
  },
  getAppMatrix: async (app_id) => {
    let token = useLogInStore.getState().access_token;

    await blueClient
      .request({
        method: "GET",
        url: `/appsmatrix/${app_id}`,
        headers: {
          "Content-Type": "application/json",
          "X-APP-TOKEN": token,
        },
      })
      .then(function (response) {
        set((state) => ({
          ...state,
          app_matrix: response?.data?.data,
          status: response?.status,
        }));
      })
      .catch((response) => {
        set((state) => ({
          ...state,
          status: response?.status,
        }));
        const responseError = response.response.data.details;
        console.log(responseError);
      });
  },
  setFilterValue: (value) => {
    set((state) => ({
      ...state,
      filter: value,
    }));
    get().filterApp();
  },
  setPage: (value) => {
    set((state) => ({
      ...state,
      page: value,
    }));
    get().getApps();
  },
  setSize: (value) => {
    let mod_size = value > 50 ? 50 : value;
    set((state) => ({
      ...state,
      size: mod_size,
    }));
    get().getApps();
  },
  filterApp: () => {
    let renderData;
    if (get().filter != "") {
      renderData = get().apps.filter((item) => {
        return item.name.toLowerCase().includes(get().filter.toLowerCase());
      });
    } else {
      renderData = get().apps;
    }
    set((state) => ({
      ...state,
      filtered_apps: renderData,
    }));
  },
  patchApp: async (data, page, size) => {
    let token = useLogInStore.getState().access_token;
    await blueClient
      .request({
        method: "PATCH",
        url: `/app/${data?.id}`,
        headers: {
          "Content-Type": "application/json",
          "X-APP-TOKEN": token,
        },
        data: data,
      })
      .then(function (response) {
        set((state) => ({
          ...state,
          status: response?.status,
        }));
        get().getSingleApp(data?.id);
        get().getApps(page, size);
      })
      .catch((response) => {
        set((state) => ({
          ...state,
          status: response?.status,
        }));
        const responseError = response?.response?.data?.details;
        console.log(responseError);
      });
  },
  postApp: async (data, page, size) => {
    let token = useLogInStore.getState().access_token;
    await blueClient
      .request({
        method: "POST",
        url: `/app`,
        headers: {
          "Content-Type": "application/json",
          "X-APP-TOKEN": token,
        },
        data: data,
      })
      .then(function (response) {
        console.log(response.status);
        set((state) => ({
          ...state,
          status: response?.status,
        }));
        get().getApps(page, size);
      })
      .catch((response) => {
        set((state) => ({
          ...state,
          status: response?.status,
        }));
        console.log(response?.response?.data?.details);
        const responseError = response?.response?.data?.details;
        console.log(responseError);
      });
  },
  deleteApp: async (id, page, size) => {
    let token = useLogInStore.getState().access_token;
    await blueClient
      .request({
        method: "DELETE",
        url: `/app/${id}`,
        headers: {
          "Content-Type": "application/json",
          "X-APP-TOKEN": token,
        },
      })
      .then(function (response) {
        set((state) => ({
          ...state,
          status: response?.status,
        }));
        get().getApps(page, size);
      })
      .catch((response) => {
        set((state) => ({
          ...state,
          status: response?.status,
        }));
        const responseError = response.response.data.details;
        console.log(responseError);
      });
  },
  activateDeactivate: async (id, status) => {
    let token = useLogInStore.getState().access_token;

    await blueClient
      .request({
        method: "PUT",
        url: `/app/${id}?active=${status.toString()}`,
        headers: {
          "Content-Type": "application/json",
          "X-APP-TOKEN": token,
        },
      })
      .then(function (response) {
        set((state) => ({
          ...state,
          status: response?.status,
        }));
        get().getApps();
        get().getSingleApp(id);
      })
      .catch((response) => {
        set((state) => ({
          ...state,
          status: response?.status,
        }));
        const responseError = response.response.data.details;
        console.log(responseError);
      });
  },
}));
