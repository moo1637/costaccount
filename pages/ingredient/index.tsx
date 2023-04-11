import { useEffect, useState } from "react";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { getIngredientList } from "../api/dbconfig";
import { Button } from "@mui/material";
import Link from "next/link";

export default function Ingredient() {
  const [rows, setRows] = useState([]);
  const [pageNumber, setPageNumber] = useState(1);
  const columns: GridColDef[] = [
    { field: "name", headerName: "이름", width: 80 },
    { field: "price", headerName: "가격", width: 80 },
    { field: "weight", headerName: "중량", width: 80 },
  ];
  useEffect(() => {
    getIngredientList(pageNumber).then((data) => {
      console.log("data", data);

      setRows(data);
    });
  }, [pageNumber]);
  useEffect(() => {
    console.log("rows", rows);
  }, [rows]);
  return (
    <>
      <h1 style={{ marginBottom: 10 }}>재료 관리</h1>
      <DataGrid rows={rows} columns={columns} getRowId={(row) => row.id} />
      <Link
        href={{ pathname: "/ingredient/new", query: { new: true } }}
        as="/ingredient/new"
      >
        <Button variant="contained" size="large">
          신규추가
        </Button>
      </Link>
    </>
  );
}
