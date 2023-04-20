import { Box, Button, Snackbar, TextField } from "@mui/material";
import {
  DataGrid,
  GridColDef,
  GridFilterItem,
  GridRowId,
  GridRowSelectionModel,
} from "@mui/x-data-grid";
import Link from "next/link";
import { BaseSyntheticEvent, useRef, useState } from "react";
import { Recipe } from "../api/dbconfig";
import styles from "./recipe.module.css";

export default function RecipeList() {
  const [rows, setRows] = useState<Recipe[]>([]);
  const [selectedRows, setSelectedRows] = useState<GridRowId[]>([]);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [message, setMessage] = useState("");
  const [filterModel, setFilterModel] = useState<{ items: GridFilterItem[] }>({
    items: [],
  });
  const [name, setName] = useState<string>("");
  const columns: GridColDef[] = [
    { field: "name", headerName: "이름", width: 80 },
  ];

  const deleteRow = () => {
    //삭제
  };
  const selectionModelChange = (rowSelectionModel: GridRowSelectionModel) => {
    setSelectedRows(rowSelectionModel);
  };
  const handleClose = () => {
    setOpenSnackbar(false);
    setMessage("");
  };
  const searchName = (e: BaseSyntheticEvent) => {
    e.preventDefault();
    if (name === "") clearFilter();
    else
      setFilterModel({
        items: [{ field: "name", value: name, operator: "contains" }],
      });
  };
  const clearFilter = () => {
    setName("");
    setFilterModel({ items: [] });
    document.getElementById("searchText")?.focus();
  };
  return (
    <>
      <h1>레시피관리</h1>
      <Snackbar
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        open={openSnackbar}
        autoHideDuration={3000} // 3초 동안 보여줌
        onClose={handleClose}
        message={message}
      />
      <Box
        component="form"
        onSubmit={searchName}
        sx={{
          marginBottom: 1,
          display: "flex",
          flexDirection: "row",
          alignItems: "baseline",
        }}
      >
        <TextField
          id="searchText"
          label="이름"
          value={name}
          onChange={(e: BaseSyntheticEvent) => {
            setName(e.target.value);
          }}
          variant="standard"
        />
        <Button type="submit">검색</Button>
        <Button onClick={clearFilter}>초기화</Button>
      </Box>
      <div style={{ height: "50vh" }}>
        <DataGrid
          rows={rows}
          columns={columns}
          autoPageSize
          getRowId={(row) => row.id}
          checkboxSelection
          onRowSelectionModelChange={selectionModelChange}
          filterModel={filterModel}
          onFilterModelChange={(newModel) => setFilterModel(newModel)}
        />
      </div>
      <div className={styles.buttonDiv}>
        <Link href={{ pathname: "/recipe/0" }}>
          <Button variant="contained" size="large">
            신규추가
          </Button>
        </Link>

        <Button
          color="inherit"
          variant="contained"
          size="large"
          onClick={deleteRow}
        >
          삭제
        </Button>
      </div>
    </>
  );
}
