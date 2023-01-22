import { ComponentLoader } from "adminjs";

const componentLoader = new ComponentLoader();

const Components = {
  ExportData: componentLoader.add("ExportData", "./export"),
  // other custom components
};

export { componentLoader, Components };
