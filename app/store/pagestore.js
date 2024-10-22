import { blueClient } from "./client";
import { create } from "zustand";
import { useLogInStore } from "./login";

export const useAppPageStore = create((set, get) => ({
  page: null,
  pages_list: [],
  drop_pages: [],
  filter: "",
  total: 0,
  pages: 1,
  page_num: 1,
  size: 15,
  filtered_pages: [],
  getPages: async (page_num, size) => {
    let token = useLogInStore.getState(page_num, size).access_token;
    await blueClient
      .request({
        method: "GET",
        url: `/page?page=${page_num}&size=${size}`,
        headers: {
          "Content-Type": "application/json",
          "X-APP-TOKEN": token,
        },
      })
      .then(function (response) {
        set((state) => ({
          ...state,
          pages_list: response?.data?.data,
          filtered_pages: response?.data?.data,
          total: response?.data?.total,
          pages: response?.data?.pages,
        }));
      })
      .catch((response) => {
        console.log(response);
        const responseError = response?.data?.details
          ? response?.data?.details
          : "Something Went Wrong, Try again";
        console.log(responseError);
      });
  },
  getDropPages: async () => {
    let token = useLogInStore.getState().access_token;

    await blueClient
      .request({
        method: "GET",
        url: `/pagedrop`,
        headers: {
          "Content-Type": "application/json",
          "X-APP-TOKEN": token,
        },
      })
      .then(function (response) {
        set((state) => ({
          ...state,
          drop_pages: response?.data?.data,
        }));
      })
      .catch((response) => {
        const responseError = response?.data?.details
          ? response?.data?.details
          : "Something Went Wrong, Try again";
        console.log(responseError);
      });
  },
  getSinglePage: async (id) => {
    let token = useLogInStore.getState().access_token;

    await blueClient
      .request({
        method: "GET",
        url: `/page/${id}`,
        headers: {
          "Content-Type": "application/json",
          "X-APP-TOKEN": token,
        },
      })
      .then(function (response) {
        // console.log(response?.data?.data);
        set((state) => ({
          ...state,
          page: response?.data?.data,
        }));
      })
      .catch((response) => {
        const responseError = response?.data?.details
          ? response?.data?.details
          : "Something Went Wrong, Try again";
        console.log(responseError);
      });
  },
  addPageRole: async (page_id, id, page_num, size) => {
    let token = useLogInStore.getState().access_token;
    await blueClient
      .request({
        method: "POST",
        url: `/rolepage/${page_id}/${id}`,
        headers: {
          "Content-Type": "application/json",
          "X-APP-TOKEN": token,
        },
      })
      .then(function () {
        get().getPages(page_num, size);
      })
      .catch((response) => {
        const responseError = response?.data?.details
          ? response?.data?.details
          : "Something Went Wrong, Try again";
        console.log(responseError);
      });
  },
  deletePageRole: async (page_id, id, page_num, size) => {
    let token = useLogInStore.getState().access_token;
    await blueClient
      .request({
        method: "DELETE",
        url: `/rolepage/${page_id}/${id}`,
        headers: {
          "Content-Type": "application/json",
          "X-APP-TOKEN": token,
        },
      })
      .then(function () {
        get().getPages(page_num, size);
      })
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
    get().filterPage();
  },
  setPage: (value) => {
    set((state) => ({
      ...state,
      page_num: value,
    }));
    get().getPages();
  },
  setSize: (value) => {
    let mod_size = value > 50 ? 50 : value;
    set((state) => ({
      ...state,
      size: mod_size,
    }));
    get().getPages(page_num, size);
  },
  filterPage: () => {
    let renderData;
    if (get().filter != "") {
      renderData = get().pages_list.filter((item) => {
        return item.name.toLowerCase().includes(get().filter.toLowerCase());
      });
    } else {
      renderData = get().pages_list;
    }
    set((state) => ({
      ...state,
      filtered_pages: renderData,
    }));
  },
  patchPage: async (data, page_num, size) => {
    let token = useLogInStore.getState().access_token;
    // console.log(data);
    await blueClient
      .request({
        method: "PATCH",
        url: `/page/${data?.id}`,
        headers: {
          "Content-Type": "application/json",
          "X-APP-TOKEN": token,
        },
        data: data,
      })
      .then(function () {
        get().getSinglePage(data?.id);
        get().getPages(page_num, size);
      })
      .catch((response, error) => {
        console.log(error);
        const responseError = response?.data?.details
          ? response?.data?.details
          : "Something Went Wrong, Try again";
        console.log(responseError);
      });
  },
  postPage: async (data, page_num, size) => {
    let token = useLogInStore.getState().access_token;
    await blueClient
      .request({
        method: "POST",
        url: `/page`,
        headers: {
          "Content-Type": "application/json",
          "X-APP-TOKEN": token,
        },
        data: data,
      })
      .then(function () {
        get().getPages(page_num, size);
      })
      .catch((response) => {
        const responseError = response?.data?.details
          ? response?.data?.details
          : "Something Went Wrong, Try again";
        console.log(responseError);
      });
  },
  deletePage: async (id, page_num, size) => {
    let token = useLogInStore.getState().access_token;
    await blueClient
      .request({
        method: "DELETE",
        url: `/page/${id}`,
        headers: {
          "Content-Type": "application/json",
          "X-APP-TOKEN": token,
        },
      })
      .then(function () {
        get().getPages(page_num, size);
      })
      .catch((response) => {
        const responseError = response?.data?.details
          ? response?.data?.details
          : "Something Went Wrong, Try again";
        console.log(responseError);
      });
  },
  activateDeactivate: async (id, status, page_num, size) => {
    let token = useLogInStore.getState().access_token;

    await blueClient
      .request({
        method: "PUT",
        url: `/page/${id}?active=${status.toString()}`,
        headers: {
          "Content-Type": "application/json",
          "X-APP-TOKEN": token,
        },
      })
      .then(function (response) {
        console.log(response);
        get().getPages(page_num, size);
        get().getSinglePage(id);
      })
      .catch((response) => {
        const responseError = response?.data?.details
          ? response?.data?.details
          : "Something Went Wrong, Try again";
        console.log(responseError);
      });
  },
}));
