import React, { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../store/store";
import { fetchModules, ModuleItem } from "../store/game-data";
import useModules from "./useModules";

/** Gets a module by its id */
const useModule = (id: string | undefined) => {
  const modules = useModules();
  if (id) return modules.find(el => el._id == id);
  else return undefined;
};

export default useModule;
