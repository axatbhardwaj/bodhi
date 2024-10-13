import { LineChartWithLabel } from "@/components/Dashboard/LineChart";
import React from "react";

const page = async () => {
  // const session: any = await checkAuth()
  // const id = session.user.id
  // const {tokenSum, timestamp} = await getTokenCount(id)

  return (
    <div>
      <LineChartWithLabel />
    </div>
  );
};

export default page;
