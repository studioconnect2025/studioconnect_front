"use client";

import React from "react";
import { ClipLoader } from "react-spinners";

const brand = {
  primary: "#015E88",
};

export const Loader: React.FC = () => {
  return (
    <div className="flex justify-center items-center py-4">
      <ClipLoader color={brand.primary} size={25} />
    </div>
  );
};
