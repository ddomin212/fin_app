import React from "react";
import { useEffect } from "react";
import { Navigate, useNavigate } from "react-router-dom";

function StaticLoad({ page }) {
  const navigator = useNavigate();
  useEffect(() => {
    navigator(`/${page}`);
    navigator(0);
  }, []);
  return <div>Loading...</div>;
}

export default StaticLoad;
