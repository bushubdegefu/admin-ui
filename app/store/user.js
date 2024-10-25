import { blueClient } from "./client";
import { create } from "zustand";
import { useLogInStore } from "./login";

export const useUserStore = create((set, get) => ({
  user: null,
  users: [],
  filter: "",
  total: 0,
  pages: 1,
  page: 1,
  size: 15,
  filtered_users: [],
  getUsers: async (page, size) => {
    let token = useLogInStore.getState().access_token;
    await blueClient
      .request({
        method: "GET",
        url: `/user?page=${page}&size=${size}`,
        headers: {
          "Content-Type": "application/json",
          "X-APP-TOKEN": token,
        },
      })
      .then(function (response) {
        set((state) => ({
          ...state,
          users: response?.data?.data,
          filtered_users: response?.data?.data,
          total: response?.data?.total,
          pages: response?.data?.pages,
        }));
      })
      .catch((response) => {
        const responseError = response?.data?.details
          ? response?.data?.details
          : "Something Went Wrong, Try again";
        console.log(responseError);
      });
  },
  getSingleUser: async (id) => {
    let token = useLogInStore.getState().access_token;
    await blueClient
      .request({
        method: "GET",
        url: `/user/${id}`,
        headers: {
          "Content-Type": "application/json",
          "X-APP-TOKEN": token,
        },
      })
      .then(function (response) {
        set((state) => ({
          ...state,
          user: response?.data?.data,
        }));
      })
      .catch((response) => {
        const responseError = response?.data?.details
          ? response?.data?.details
          : "Something Went Wrong, Try again";
        console.log(responseError);
      });
  },
  addUserRole: async (user_id, role_id) => {
    let token = useLogInStore.getState().access_token;
    await blueClient
      .request({
        method: "POST",
        url: `/userrole/${user_id}/${role_id}`,
        headers: {
          "Content-Type": "application/json",
          "X-APP-TOKEN": token,
        },
      })
      .then(function (response) {
        console.log(response);
      })
      .catch((response) => {
        const responseError = response?.data?.details
          ? response?.data?.details
          : "Something Went Wrong, Try again";
        console.log(responseError);
      });
  },
  deleteUserRole: async (user_id, role_id) => {
    let token = useLogInStore.getState().access_token;
    await blueClient
      .request({
        method: "DELETE",
        url: `/userrole/${user_id}/${role_id}`,
        headers: {
          "Content-Type": "application/json",
          "X-APP-TOKEN": token,
        },
      })
      .then(function () {})
      .catch((response) => {
        const responseError = response?.data?.details
          ? response?.data?.details
          : "Something Went Wrong, Try again";
        console.log(responseError);
      });
  },

  setFilterValue: (value) => {
    set((state) => ({
      ...state,
      filter: value,
    }));
    get().filterUser();
  },
  setPage: (value) => {
    set((state) => ({
      ...state,
      page: value,
    }));
    get().getUsers(page, size);
  },
  setSize: (value) => {
    let mod_size = value > 50 ? 50 : value;
    set((state) => ({
      ...state,
      size: mod_size,
    }));
    get().getUsers(page, size);
  },
  filterUser: () => {
    let renderData;
    if (get().filter != "") {
      renderData = get().users.filter((item) => {
        return item.email.toLowerCase().includes(get().filter.toLowerCase());
      });
    } else {
      renderData = get().users;
    }
    set((state) => ({
      ...state,
      filtered_users: renderData,
    }));
  },
  activeUserCounts: () => {
    let renderData;
    renderData = get().users.filter((item) => {
      return item.disabled.toString().toLowerCase().includes("false");
    });
    let bottom = get().size > get().total ? get().total : get().size;

    let percentage = (renderData.length / bottom) * 100;
    return percentage.toFixed(2);
  },
  patchUser: async (data, page, size) => {
    console.log(data);
    let token = useLogInStore.getState().access_token;
    await blueClient
      .request({
        method: "PATCH",
        url: `/user/${data?.id}`,
        headers: {
          "Content-Type": "application/json",
          "X-APP-TOKEN": token,
        },
        data: data,
      })
      .then(function () {
        get().getSingleUser(data?.id);
        get().getUsers(page, size);
      })
      .catch((response) => {
        const responseError = response?.data?.details
          ? response?.data?.details
          : "Something Went Wrong, Try again";
        console.log(responseError);
      });
  },
  patchUser: async (data, page, size) => {
    console.log(data);
    let token = useLogInStore.getState().access_token;
    await blueClient
      .request({
        method: "PATCH",
        url: `/user/${data?.id}`,
        headers: {
          "Content-Type": "application/json",
          "X-APP-TOKEN": token,
        },
        data: data,
      })
      .then(function () {
        get().getSingleUser(data?.id);
        get().getUsers(page, size);
      })
      .catch((response) => {
        const responseError = response?.data?.details
          ? response?.data?.details
          : "Something Went Wrong, Try again";
        console.log(responseError);
      });
  },
  deleteUser: async (id, page, size) => {
    let token = useLogInStore.getState().access_token;
    await blueClient
      .request({
        method: "DELETE",
        url: `/user/${id}`,
        headers: {
          "Content-Type": "application/json",
          "X-APP-TOKEN": token,
        },
      })
      .then(function () {
        get().getUsers(page, size);
      })
      .catch((response) => {
        const responseError = response?.data?.details
          ? response?.data?.details
          : "Something Went Wrong, Try again";
        console.log(responseError);
      });
  },
  changePassword: async (data, reset, page, size) => {
    let token = useLogInStore.getState().access_token;
    await blueClient
      .request({
        method: "PUT",
        url: `/user?reset=${reset}`,
        headers: {
          "Content-Type": "application/json",
          "X-APP-TOKEN": token,
        },
        data: { email: data?.email, password: data?.password },
      })
      .then(function () {
        get().getUsers(page, size);
      })
      .catch((response) => {
        const responseError = response?.data?.details
          ? response?.data?.details
          : "Something Went Wrong, Try again";
        console.log(responseError);
      });
  },
  sendEmail: async (data) => {
    let token = useLogInStore.getState().access_token;
    await blueClient
      .request({
        method: "POST",
        url: `/email`,
        headers: {
          "Content-Type": "application/json",
          "X-APP-TOKEN": token,
        },
        data: data,
      })
      .then(function () {})
      .catch((response) => {
        const responseError = response?.data?.details
          ? response?.data?.details
          : "Something Went Wrong, Try again";
        console.log(responseError);
      });
  },
  activateDeactivate: async (id, status) => {
    let token = useLogInStore.getState().access_token;

    await blueClient
      .request({
        method: "PUT",
        url: `/user/${id}?status=${status.toString()}`,
        headers: {
          "Content-Type": "application/json",
          "X-APP-TOKEN": token,
        },
      })
      .then(function (response) {
        console.log(response);
        get().getUsers();
        get().getSingleUser(id);
      })
      .catch((response) => {
        const responseError = response?.data?.details
          ? response?.data?.details
          : "Something Went Wrong, Try again";
        console.log(responseError);
      });
  },
  postUser: async (data) => {
    let token = useLogInStore.getState().access_token;
    await blueClient
      .request({
        method: "POST",
        url: `/user`,
        headers: {
          "Content-Type": "application/json",
          "X-APP-TOKEN": token,
        },
        data: data,
      })
      .then(function () {
        get().getRoles();
      })
      .catch((response) => {
        const responseError = response?.response?.data?.details;
        console.log(responseError);
      });
  },
}));
