import { Box } from "@mui/material";
import ActivityCard from "./ActivityCard";

type props = {
  activities: Activity[];
}

export default function ActivityList({ activities }: props) {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
        {activities.map((activity) => (
            <ActivityCard key={activity.id} activity={activity} />
        ))}
    </Box>
  )
}