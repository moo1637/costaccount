import Link from "next/link";
import { useRouter } from "next/router";
import { Home, RouteRounded, Undo } from "@mui/icons-material";
import { IconButton } from "@mui/material";

export default function NavBar() {
  const router = useRouter();

  return (
    <nav>
      {router.pathname !== "/" ? (
        <>
          <IconButton color="primary" onClick={() => router.back()}>
            <Undo fontSize="large" />
          </IconButton>
          <Link href="/">
            <IconButton color="primary">
              <Home fontSize="large" />
            </IconButton>
          </Link>
        </>
      ) : (
        <></>
      )}
    </nav>
  );
}
