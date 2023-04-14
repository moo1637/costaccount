import { Container, Grid } from "@mui/material";
import React from "react";
import NavBar from "./NavBar";

type AppLayoutProps = {
  children: React.ReactNode;
};

export default function Layout({ children }: AppLayoutProps) {
  return (
    <Container
      style={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <NavBar />
      <div className="container">{children}</div>
    </Container>
  );
}
