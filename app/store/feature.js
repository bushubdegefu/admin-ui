import { blueClient } from "./client";
import { create } from "zustand";

import { useLogInStore } from "./login";
import { useRoleStore } from "./role";

export const useFeatureStore = create((set, get) => ({
  feature: null,
  features: [],
  drop_features: [],
  filter: "",
  total: 0,
  pages: 1,
  page: 1,
  size: 15,
  filtered_features: [],
  getFeatures: async (page, size) => {
    let token = useLogInStore.getState().access_token;
    await blueClient
      .request({
        method: "GET",
        url: `/feature?page=${page}&size=${size}`,
        headers: {
          "Content-Type": "application/json",
          "X-APP-TOKEN": token,
        },
      })
      .then(function (response) {
        set((state) => ({
          ...state,
          features: response?.data?.data,
          filtered_features: response?.data?.data,
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
  getAppFeatures: async (uuid, page, size) => {
    let token = useLogInStore.getState().access_token;
    await blueClient
      .request({
        method: "GET",
        url: `/appfeatureuuid/${uuid}?page=${page}&size=${size}`,
        headers: {
          "Content-Type": "application/json",
          "X-APP-TOKEN": token,
        },
      })
      .then(function (response) {
        set((state) => ({
          ...state,
          features: response?.data?.data,
          filtered_features: response?.data?.data,
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
  getDropFeatures: async () => {
    let token = useLogInStore.getState().access_token;

    await blueClient
      .request({
        method: "GET",
        url: `/featuredrop`,
        headers: {
          "Content-Type": "application/json",
          "X-APP-TOKEN": token,
        },
      })
      .then(function (response) {
        set((state) => ({
          ...state,
          drop_features: response?.data?.data,
        }));
      })
      .catch((response) => {
        const responseError = response?.data?.details
          ? response?.data?.details
          : "Something Went Wrong, Try again";
        toast.error(responseError, {
          position: "top-right",
        });
      });
  },
  getSingleFeature: async (id) => {
    let token = useLogInStore.getState().access_token;

    await blueClient
      .request({
        method: "GET",
        url: `/feature/${id}`,
        headers: {
          "Content-Type": "application/json",
          "X-APP-TOKEN": token,
        },
      })
      .then(function (response) {
        set((state) => ({
          ...state,
          feature: response?.data?.data,
        }));
      })
      .catch((response) => {
        const responseError = response?.data?.details
          ? response?.data?.details
          : "Something Went Wrong, Try again";
        toast.error(responseError, {
          position: "top-right",
        });
      });
  },
  addFeatureRole: async (feature_id, role_id) => {
    let token = useLogInStore.getState().access_token;
    let update_role = useRoleStore.getState().getSingleRole;
    await blueClient
      .request({
        method: "PATCH",
        url: `/featurerole/${feature_id}?role_id=${role_id}`,
        headers: {
          "Content-Type": "application/json",
          "X-APP-TOKEN": token,
        },
      })
      .then(function () {
        get().getSingleFeature(feature_id);
        update_role(role_id);
      })
      .catch((response) => {
        const responseError = response?.data?.details
          ? response?.data?.details
          : "Something Went Wrong, Try again";
        console.log(responseError);
      });
  },
  deleteFeatureRole: async (feature_id, role_id) => {
    let token = useLogInStore.getState().access_token;
    let update_role = useRoleStore.getState().getSingleRole;
    await blueClient
      .request({
        method: "DELETE",
        url: `/featurerole/${feature_id}?role_id=${role_id}`,
        headers: {
          "Content-Type": "application/json",
          "X-APP-TOKEN": token,
        },
      })
      .then(function () {
        get().getSingleFeature(feature_id);
        update_role(role_id);
      })
      .catch((response) => {
        const responseError = response?.data?.details
          ? response?.data?.details
          : "Something Went Wrong, Try again";
        console.log(responseError);
      });
  },
  deleteFeature: async (id, page, size) => {
    let token = useLogInStore.getState().access_token;
    await blueClient
      .request({
        method: "DELETE",
        url: `/feature/${id}`,
        headers: {
          "Content-Type": "application/json",
          "X-APP-TOKEN": token,
        },
      })
      .then(function () {
        get().getFeatures(page, size);
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
    get().filterFeature();
  },
  activeFeatureCounts: () => {
    let renderData;
    renderData = get().features.filter((item) => {
      return item.active.toString().toLowerCase().includes("true");
    });
    let bottom = get().size > get().total ? get().total : get().size;

    let percentage = (renderData.length / bottom) * 100;
    return percentage.toFixed(2);
  },
  setPage: (value) => {
    set((state) => ({
      ...state,
      page: value,
    }));
    get().getFeatures();
  },
  setSize: (value) => {
    let mod_size = value > 50 ? 50 : value;
    set((state) => ({
      ...state,
      size: mod_size,
    }));
    get().getFeatures(page, size);
  },
  filterFeature: () => {
    let renderData;
    if (get().filter != "") {
      renderData = get().features.filter((item) => {
        return item.name.toLowerCase().includes(get().filter.toLowerCase());
      });
    } else {
      renderData = get().features;
    }
    set((state) => ({
      ...state,
      filtered_features: renderData,
    }));
  },
  patchFeature: async (data, page, size) => {
    let token = useLogInStore.getState().access_token;
    await blueClient
      .request({
        method: "PATCH",
        url: `/feature/${data?.id}`,
        headers: {
          "Content-Type": "application/json",
          "X-APP-TOKEN": token,
        },
        data: data,
      })
      .then(function () {
        get().getSingleFeature(data?.id);
        get().getFeatures(page, size);
      })
      .catch((response) => {
        const responseError = response?.data?.details
          ? response?.data?.details
          : "Something Went Wrong, Try again";
        console.log(responseError);
      });
    console.log(responseError);
  },
  postFeature: async (data, page, size) => {
    let token = useLogInStore.getState().access_token;
    await blueClient
      .request({
        method: "POST",
        url: `/feature`,
        headers: {
          "Content-Type": "application/json",
          "X-APP-TOKEN": token,
        },
        data: data,
      })
      .then(function () {
        get().getFeatures(page, size);
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
        url: `/feature/${id}?active=${status.toString()}`,
        headers: {
          "Content-Type": "application/json",
          "X-APP-TOKEN": token,
        },
      })
      .then(function () {
        get().getFeatures();
        get().getSingleFeature(id);
      })
      .catch((response) => {
        const responseError = response?.data?.details
          ? response?.data?.details
          : "Something Went Wrong, Try again";
        console.log(responseError);
      });
  },
}));
