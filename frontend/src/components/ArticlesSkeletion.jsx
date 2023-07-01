import { Card, CardContent, Grid, Skeleton } from "@mui/material";

export default function ArticlesSkeleton() {
  return [1,2,3,4,5].map((v) => (
    <Grid key={v} item xs={12}>
      <Card sx={{ display: "flex", flexDirection: "row" }}>
        <Skeleton variant="rectangular" width={300} height={200} />
        <CardContent sx={{ flexGrow: 1 }}>
          <Skeleton variant="text" width={300} />
          <Skeleton variant="text" width={100} />
          <Skeleton variant="text" width={150} />
          <Skeleton variant="text" width={200} />
          <Skeleton variant="text" width="100%" />
          <Skeleton variant="text" width="100%" />
          <Skeleton variant="text" width="100%" />
        </CardContent>
      </Card>
    </Grid>
  ));
}
