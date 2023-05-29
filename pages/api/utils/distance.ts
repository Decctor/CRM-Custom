import { apiHandler, validateAuthentication } from "@/utils/api";
import { NextApiHandler } from "next";
import query from "../kits/query";
import axios from "axios";

type GetResponse = {
  data: number;
};
const removeAccents = (str: string) =>
  str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");

const getDistance: NextApiHandler<GetResponse> = async (req, res) => {
  await validateAuthentication(req);
  const { destination, origin } = req.query;
  if (typeof destination === "string" && typeof origin === "string") {
    const fixedDestination = removeAccents(destination);
    const fixedOrigin = removeAccents(origin);
    const url = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${fixedOrigin}&destinations=${fixedDestination}&departure_time=now&key=${process.env.DISTANCE_API}`;

    const { data: apiResponse } = await axios.post(url, {});
    const distance = apiResponse.rows[0]?.elements[0]?.distance?.value / 1000;
    console.log("DISTANCIA", distance);
    res.json({ data: distance });
  }
};

export default apiHandler({
  GET: getDistance,
});
