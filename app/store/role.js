import { blueClient } from "./client";
import { create } from "zustand";

import { useLogInStore } from "./login";

export const useRoleStore = create((set, get) => ({
  app: null,
  role: null,
  roles: [],
  endpoints: [],
  drop_roles: [],
  filter: "",
  total: 0,
  pages: 1,
  page: 1,
  size: 25,
  filtered_roles: [],
  getRoles: async (page, size) => {
    let token = useLogInStore.getState().access_token;
    await blueClient
      .request({
        method: "GET",
        url: `/role?page=${page}&size=${size}`,
        headers: {
          "Content-Type": "application/json",
          "X-APP-TOKEN": token,
        },
      })
      .then(function (response) {
        set((state) => ({
          ...state,
          roles: response?.data?.data,
          filtered_roles: response?.data?.data,
          total: response?.data?.total,
          pages: response?.data?.pages,
        }));
      })
      .catch((response) => {
        // console.log(response)
        const responseError = response?.data?.details
          ? response?.data?.details
          : "Something Went Wrong, Try again";
        console.log(responseError);
      });
  },
  getDropRoles: async () => {
    let token = useLogInStore.getState().access_token;
    await blueClient
      .request({
        method: "GET",
        url: `/droproles`,
        headers: {
          "Content-Type": "application/json",
          "X-APP-TOKEN": token,
        },
      })
      .then(function (response) {
        set((state) => ({
          ...state,
          drop_roles: response?.data?.data,
        }));
      })
      .catch((response) => {
        const responseError = response?.response?.data?.details;
        console.log(responseError);
      });
  },
  getSingleRole: async (id) => {
    let token = useLogInStore.getState().access_token;
    await blueClient
      .request({
        method: "GET",
        url: `/role/${id}`,
        headers: {
          "Content-Type": "application/json",
          "X-APP-TOKEN": token,
        },
      })
      .then(function (response) {
        set((state) => ({
          ...state,
          role: response?.data?.data,
        }));
      })
      .catch((response) => {
        const responseError = response?.response?.data?.details;
        console.log(responseError);
      });
    //    console.log(get().role)
    get().getSingleApp(get().role.app.Int64);
  },
  getRoleEndpoints: async (id) => {
    let token = useLogInStore.getState().access_token;
    await blueClient
      .request({
        method: "GET",
        url: `/role_endpoints?role_id=${id}`,
        headers: {
          "Content-Type": "application/json",
          "X-APP-TOKEN": token,
        },
      })
      .then(function (response) {
        set((state) => ({
          ...state,
          endpoints: response?.data?.data,
        }));
      })
      .catch((response) => {
        const responseError = response?.response?.data?.details;
        console.log(responseError);
      });
  },
  setFilterValue: (value) => {
    set((state) => ({
      ...state,
      filter: value,
    }));
    get().filterRole();
  },
  setPage: (value) => {
    set((state) => ({
      ...state,
      page: value,
    }));
    get().getRoles();
  },
  setSize: (value) => {
    let mod_size = value > 50 ? 50 : value;
    set((state) => ({
      ...state,
      size: mod_size,
    }));
    get().getRoles();
  },
  filterRole: () => {
    let renderData;
    if (get().filter != "") {
      renderData = get().roles.filter((item) => {
        return item.name.toLowerCase().includes(get().filter.toLowerCase());
      });
    } else {
      renderData = get().roles;
    }
    set((state) => ({
      ...state,
      filtered_roles: renderData,
    }));
  },
  activeRoleCounts: () => {
    let renderData;
    renderData = get().roles.filter((item) => {
      return item.active.toString().toLowerCase().includes("true");
    });
    let bottom = get().size > get().total ? get().total : get().size;

    let percentage = (renderData.length / bottom) * 100;
    return percentage.toFixed(2);
  },
  patchRole: async (data, page, size) => {
    let token = useLogInStore.getState().access_token;
    await blueClient
      .request({
        method: "PATCH",
        url: `/role/${data?.id}`,
        headers: {
          "Content-Type": "application/json",
          "X-APP-TOKEN": token,
        },
        data: data,
      })
      .then(function () {
        get().getSingleRole(data?.id);
        get().getRoles(page, size);
      })
      .catch((response) => {
        const responseError = response?.response?.data?.details;
        console.log(responseError);
      });
  },
  deleteRole: async (id, page, size) => {
    let token = useLogInStore.getState().access_token;
    await blueClient
      .request({
        method: "DELETE",
        url: `/role/${id}`,
        headers: {
          "Content-Type": "application/json",
          "X-APP-TOKEN": token,
        },
      })
      .then(function () {
        get().getRoles(page, size);
      })
      .catch((response) => {
        const responseError = response?.data?.details
          ? response?.data?.details
          : "Something Went Wrong, Try again";
        console.log(responseError);
      });
  },
  postRole: async (data, page, size) => {
    let token = useLogInStore.getState().access_token;
    await blueClient
      .request({
        method: "POST",
        url: `/role`,
        headers: {
          "Content-Type": "application/json",
          "X-APP-TOKEN": token,
        },
        data: data,
      })
      .then(function () {
        get().getRoles(page, size);
      })
      .catch((response) => {
        const responseError = response?.response?.data?.details;
        console.log(responseError);
      });
  },
  activateDeactivate: async (id, status) => {
    let token = useLogInStore.getState().access_token;

    await blueClient
      .request({
        method: "PUT",
        url: `/role/${id}?active=${status.toString()}`,
        headers: {
          "Content-Type": "application/json",
          "X-APP-TOKEN": token,
        },
      })
      .then(function () {
        get().getRoles(page, size);
        get().getSingleRole(id);
      })
      .catch((response) => {
        const responseError = response?.response?.data?.details;
        console.log(responseError);
      });
  },
  addAppToRole: async (app_id, role_id) => {
    let token = useLogInStore.getState().access_token;

    await blueClient
      .request({
        method: "PATCH",
        url: `/approle/${role_id}?app_id=${app_id}`,
        headers: {
          "Content-Type": "application/json",
          "X-APP-TOKEN": token,
        },
      })
      .then(function () {
        get().getSingleRole(role_id);
      })
      .catch((response) => {
        const responseError = response?.data?.details
          ? response?.data?.details
          : "Something Went Wrong, Try again";
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
        }));
      })
      .catch((response) => {
        const responseError = response?.data?.details
          ? response?.data?.details
          : "Something Went Wrong, Try again";
        console.log(responseError);
      });
  },
}));
