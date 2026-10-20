import { Grid, List, ListItem, ListItemText} from "@mui/material";

type props = {
  activities: Activity[];
}

export default function ActivityDashboard({ activities }: props) {
  return (
    <Grid container>
      <Grid size={9}>
        <List>
          {activities.map((activity: Activity) => (
            <ListItem key={activity.id}>
              <ListItemText>{activity.title}</ListItemText>
            </ListItem>
          ))}
        </List>
      </Grid>
    </Grid>
  );
}

