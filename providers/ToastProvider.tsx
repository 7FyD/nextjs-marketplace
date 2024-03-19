"use client";

import { Toaster } from "react-hot-toast";

const ToasterProvider = () => {
  return (
    <Toaster
      toastOptions={{
        success: {
          style: {
            textAlign: "center",
          },
        },
        error: {
          style: {
            textAlign: "center",
          },
        },
      }}
    />
  );
};

export default ToasterProvider;
