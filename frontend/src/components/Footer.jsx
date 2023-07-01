import { Box, Typography } from "@mui/material";
import Copyright from "./Copyright";

export default function Footer() {
  return (
    <>
      <Box sx={{ bgcolor: "background.paper", p: 6 }} component="footer">
        <Typography
          variant="subtitle1"
          align="center"
          color="text.secondary"
          component="p"
        >
          News Aggregator Version 1.0
        </Typography>
        <Copyright />
      </Box>
    </>
  );
}
