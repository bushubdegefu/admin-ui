import { blueClient } from "./client";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { jwtDecode } from "jwt-decode";

export const useLogInStore = create(
  persist(
    (set, get) => ({
      blue_admin_token: false,
      access_token: "anonymous",
      refresh_token: null,
      roles: null,
      user_name: null,
      user_id: null,
      responseError: null,
      setToken: async (data) => {
        await blueClient
          .request({
            method: "POST",
            url: "/login",
            headers: {
              "Content-Type": "application/json",
            },
            data: data,
          })
          .then(function (response) {
            const access_token = response?.data?.data.access_token;
            const refresh_token = response?.data?.data.refresh_token;
            const user = jwtDecode(access_token);

            set((state) => ({
              ...state,
              blue_admin_token: true,
              roles: user?.roles,
              user_name: user?.email,
              user_id: user?.uuid,
              access_token: access_token,
              refresh_token: refresh_token,
            }));
          })
          .catch((response) => {
            const responseError = response?.data?.details
              ? response?.data?.details
              : "Something Went Wrong, Try again";
            console.log(responseError);
            console.log(response);
          });
      },
      refToken: async () => {
        await blueClient
          .request({
            method: "POST",
            url: "/login",
            headers: {
              "Content-Type": "application/json",
            },
            data: {
              grant_type: "refresh_token",
              email: "refresh@refresh.com",
              password: "refreshtoken",
              token: get().refresh_token,
            },
          })
          .then(function (response) {
            const access_token = response?.data?.data.access_token;
            const refresh_token = response?.data?.data.refresh_token;

            set((state) => ({
              ...state,
              access_token: access_token,
              refresh_token: refresh_token,
            }));
          })
          .catch((response, error) => {
            const responseError = response?.data?.details
              ? response?.data?.details
              : "Something Went Wrong, Try again";
            console.log(error);
            console.log(responseError);
          });
      },
      resetTokenLogout: () =>
        set({
          blue_admin_token: false,
          roles: null,
          user_name: null,
          user_id: null,
          access_token: "anonymous",
          refresh_token: null,
          responseError: null,
        }),
    }),
    {
      name: "login-storage", // name of the item in the storage (must be unique)
      storage: createJSONStorage(() => sessionStorage), // (optional) by default, 'localStorage' is used
    },
  ),
);
