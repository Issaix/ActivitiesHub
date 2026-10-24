import { Grid } from "@mui/material";
import ActivityList from "./ActivityList";

type props = {
  activities: Activity[];
}

export default function ActivityDashboard({ activities }: props) {
  return (
    <Grid container>
      <Grid size={9}>
        <ActivityList activities={activities} />
      </Grid>
    </Grid>
  );
}

