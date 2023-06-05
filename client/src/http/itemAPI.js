import { $authHost, $host } from "./index";

export const createType = async (type) => {
  const { data } = await $authHost.post("api/type", type);
  return data;
};

export const fetchTypes = async () => {
  const { data } = await $host.get("api/type");
  return data;
};

export const createBrand = async (brand) => {
  const { data } = await $authHost.post("api/brand", brand);
  return data;
};

export const fetchBrands = async () => {
  const { data } = await $host.get("api/brand");
  return data;
};

export const createItem = async (item) => {
  const { data } = await $authHost.post("api/item", item);
  return data;
};

export const fetchItems = async (typeId, brandId, page, limit = 24) => {
  const { data } = await $host.get("api/item", {
    params: {
      typeId,
      brandId,
      page,
      limit,
    },
  });
  return data;
};

export const fetchOneItem = async (id) => {
  const { data } = await $host.get("api/item/" + id);
  return data;
};
