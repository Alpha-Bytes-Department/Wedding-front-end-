import { useAxios } from "../../../../Component/Providers/useAxios";
import { CeremonyApiService } from "../services/ceremonyApi";
import { useMemo } from "react";

export const useCeremonyApi = () => {
  const axios = useAxios();

  const ceremonyApi = useMemo(() => new CeremonyApiService(axios), [axios]);

  return ceremonyApi;
};
