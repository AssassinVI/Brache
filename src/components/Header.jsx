import { Typography, Box, useTheme } from "@mui/material";
import { tokens } from "../theme";

const Header = ({ title, subtitle, warm = false }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  subtitle = subtitle.split("\n")
  return (
    <Box mb="30px">
      <Typography
        variant="h2"
        color={colors.grey[100]}
        fontWeight="bold"
        sx={{ m: "0 0 5px 0" }}
      >
        {title}
      </Typography>
      {typeof subtitle === "object" &&
        subtitle.map((item, i) => {
          return (
            <Typography variant="h5" sx={{ display: "block", lineHeight: "1.5" }} color={warm ? "red" : colors.greenAccent[400]} key={i}>
              {item}
            </Typography>
          )
        })
      }
    </Box>
  );
};

export default Header;
