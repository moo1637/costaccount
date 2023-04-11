import { TextField } from "@mui/material";

export default function Recipe() {
  return (
    <>
      <h1>레시피등록</h1>
      <TextField required id="recipeName" label="레시피명" variant="standard" />
    </>
  );
}
