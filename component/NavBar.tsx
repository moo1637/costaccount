import Link from "next/link";
import { useRouter } from "next/router";
import HomeIcon from "@mui/icons-material/Home";
import AppBar from "@mui/material/AppBar";

export default function NavBar() {
  const router = useRouter();

  return (
    <nav
      style={{
        display: "flex",
        flexDirection: "row",
      }}
    >
      {router.pathname !== "/" ? (
        <Link href="/">
          <HomeIcon />
        </Link>
      ) : (
        <></>
      )}
    </nav>
  );
}
