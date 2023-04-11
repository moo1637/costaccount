import { Container } from "@mui/material";
import React from "react";
import NavBar from "./NavBar";

type AppLayoutProps = {
  children: React.ReactNode;
};

export default function Layout({ children }: AppLayoutProps) {
  return (
    <Container>
      <NavBar />
      <div className="container">{children}</div>
    </Container>
  );
}
