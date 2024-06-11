import React, { createContext, useState, useEffect, useContext } from "react";
import { InitialDataContext } from "../contexts/InitialDataContext";

export function useInitialDataContext() {
  const context = useContext(InitialDataContext);
  if (context === undefined) {
    throw new Error(
      "useInitialDataContext must be used within an InitialDataProvider"
    );
  }
  return context;
}
