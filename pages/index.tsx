import { Box, Button } from "@mui/material";
import Link from "next/link";
import { doDatabaseStuff } from "./api/dbconfig";
import { useEffect } from "react";
import styles from "./index.module.css";

export default function Home() {
  useEffect(() => {
    doDatabaseStuff();
  }, []);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        "& button": { m: 1, width: "200px" },
      }}
    >
      <Link href="/ingredient">
        <Button variant="contained" size="large">
          재료등록
        </Button>
      </Link>
      <Link href="/recipe">
        <Button variant="contained" size="large">
          레시피등록
        </Button>
      </Link>
      <Link href="/costCalculator">
        <Button variant="contained" size="large">
          원가계산
        </Button>
      </Link>
    </Box>
  );
}
