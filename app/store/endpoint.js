import { blueClient } from "./client";
import { create } from "zustand";
import { useLogInStore } from "./login";
import { useFeatureStore } from "./feature";

export const useEndPointStore = create((set, get) => ({
  endpoint: null,
  endpoints: [],
  drop_endpoints: [],
  filter: "",
  total: 0,
  pages: 1,
  page: 1,
  size: 15,
  filtered_endpoints: [],
  getEndPoints: async (page, size) => {
    let token = useLogInStore.getState().access_token;
    await blueClient
      .request({
        method: "GET",
        url: `/endpoint?page=${page}&size=${size}`,
        headers: {
          "Content-Type": "application/json",
          "X-APP-TOKEN": token,
        },
      })
      .then(function (response) {
        set((state) => ({
          ...state,
          endpoints: response?.data?.data,
          filtered_endpoints: response?.data?.data,
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
  getAppEndPoints: async (uuid, page, size) => {
    let token = useLogInStore.getState().access_token;
    await blueClient
      .request({
        method: "GET",
        url: `/appendpointuuid/${uuid}?page=${page}&size=${size}`,
        headers: {
          "Content-Type": "application/json",
          "X-APP-TOKEN": token,
        },
      })
      .then(function (response) {
        set((state) => ({
          ...state,
          endpoints: response?.data?.data,
          filtered_endpoints: response?.data?.data,
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
  getDropEndPoints: async () => {
    let token = useLogInStore.getState().access_token;

    await blueClient
      .request({
        method: "GET",
        url: `/endpointdrop`,
        headers: {
          "Content-Type": "application/json",
          "X-APP-TOKEN": token,
        },
      })
      .then(function (response) {
        set((state) => ({
          ...state,
          drop_endpoints: response?.data?.data,
        }));
      })
      .catch((response) => {
        const responseError = response?.data?.details
          ? response?.data?.details
          : "Something Went Wrong, Try again";
        console.log(responseError);
      });
  },
  getSingleEndPoint: async (id) => {
    let token = useLogInStore.getState().access_token;

    await blueClient
      .request({
        method: "GET",
        url: `/endpoint/${id}`,
        headers: {
          "Content-Type": "application/json",
          "X-APP-TOKEN": token,
        },
      })
      .then(function (response) {
        set((state) => ({
          ...state,
          endpoint: response?.data?.data,
        }));
      })
      .catch((response) => {
        const responseError = response?.data?.details
          ? response?.data?.details
          : "Something Went Wrong, Try again";
        console.log(responseError);
      });
  },
  addEndPointFeature: async (endpoint_id, id) => {
    let token = useLogInStore.getState().access_token;
    let update_feature = useFeatureStore.getState().getSingleFeature;
    await blueClient
      .request({
        method: "PATCH",
        url: `/endpointfeature/${endpoint_id}?feature_id=${id}`,
        headers: {
          "Content-Type": "application/json",
          "X-APP-TOKEN": token,
        },
      })
      .then(function () {
        get().getSingleEndPoint(endpoint_id);
        update_feature(id, 1, 1);
      })
      .catch((response) => {
        const responseError = response?.data?.details
          ? response?.data?.details
          : "Something Went Wrong, Try again";
        console.log(responseError);
      });
  },
  deleteEndPointFeature: async (endpoint_id, id) => {
    let token = useLogInStore.getState().access_token;
    let update_feature = useFeatureStore.getState().getSingleFeature;
    await blueClient
      .request({
        method: "DELETE",
        url: `/endpointfeature/${endpoint_id}?feature_id=${id}`,
        headers: {
          "Content-Type": "application/json",
          "X-APP-TOKEN": token,
        },
      })
      .then(function () {
        get().getSingleEndPoint(endpoint_id);
        update_feature(id, 1, 1);
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
    get().filterEndPoint();
  },
  setPage: (value) => {
    set((state) => ({
      ...state,
      page: value,
    }));
    get().getEndPoints(page, size);
  },
  setSize: (value) => {
    let mod_size = value > 50 ? 50 : value;
    set((state) => ({
      ...state,
      size: mod_size,
    }));
    get().getEndPoints(page, size);
  },
  filterEndPoint: () => {
    let renderData;
    if (get().filter != "") {
      renderData = get().endpoints.filter((item) => {
        return item.name.toLowerCase().includes(get().filter.toLowerCase());
      });
    } else {
      renderData = get().endpoints;
    }
    set((state) => ({
      ...state,
      filtered_endpoints: renderData,
    }));
  },
  patchEndpoint: async (data, page, size) => {
    let token = useLogInStore.getState().access_token;
    await blueClient
      .request({
        method: "PATCH",
        url: `/endpoint/${data?.id}`,
        headers: {
          "Content-Type": "application/json",
          "X-APP-TOKEN": token,
        },
        data: data,
      })
      .then(function () {
        get().getSingleEndPoint(data?.id);
        get().getEndPoints(page, size);
      })
      .catch((response) => {
        const responseError = response?.data?.details
          ? response?.data?.details
          : "Something Went Wrong, Try again";
        console.log(responseError);
      });
  },
  postEndpoint: async (data, page, size) => {
    let token = useLogInStore.getState().access_token;
    console.log(data);
    await blueClient
      .request({
        method: "POST",
        url: `/endpoint`,
        headers: {
          "Content-Type": "application/json",
          "X-APP-TOKEN": token,
        },
        data: data,
      })
      .then(function () {
        get().getEndPoints(page, size);
      })
      .catch((response) => {
        const responseError = response?.data?.details
          ? response?.data?.details
          : "Something Went Wrong, Try again";
        console.log(responseError);
      });
  },
  deleteEndpoint: async (id, page, size) => {
    let token = useLogInStore.getState().access_token;
    await blueClient
      .request({
        method: "DELETE",
        url: `/endpoint/${id}`,
        headers: {
          "Content-Type": "application/json",
          "X-APP-TOKEN": token,
        },
      })
      .then(function () {
        get().getEndPoints(page, size);
      })
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
        url: `/endpoint/${id}?active=${status.toString()}`,
        headers: {
          "Content-Type": "application/json",
          "X-APP-TOKEN": token,
        },
      })
      .then(function (response) {
        console.log(response);
        get().getEndPoints(page, size);
        get().getSingleEndPoint(id);
      })
      .catch((response) => {
        const responseError = response?.data?.details
          ? response?.data?.details
          : "Something Went Wrong, Try again";
        console.log(responseError);
      });
  },
}));
