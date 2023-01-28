import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../store/store";
import { fetchBox } from "../store/user";

/** Gets the user box, module id and stage id */
const useUserProgress = () => {
  const loaded = useAppSelector((state) => state.user.flags.box);
  const dispatch = useAppDispatch();
  const box = useAppSelector((state) => state.user.progress.box);
  const stage = useAppSelector((state) => state.user.progress.stage);
  const module = useAppSelector((state) => state.user.progress.module);

  useEffect(() => {
    if (!loaded) dispatch(fetchBox());
  }, [loaded]);

  return { box, stage, module };
};

export default useUserProgress;
