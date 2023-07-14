import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../store/store";
import { fetchModules } from "../store/modules";

/** Gets the user modules */
const useModules = () => {
  const dispatch = useAppDispatch();
  const modules = useAppSelector((state) => state.modules.data);

  useEffect(() => {
    if (modules.length == 0) {
      dispatch(fetchModules());
    }
  }, [modules]);

  return modules;
};

export default useModules;
