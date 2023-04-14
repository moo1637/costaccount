import { useEffect, useState, useRef } from "react";
import {
  DataGrid,
  GridColDef,
  GridRowSelectionModel,
  GridRowId,
} from "@mui/x-data-grid";
import { deleteIngredient, getIngredientList } from "../api/dbconfig";
import { Button, Snackbar } from "@mui/material";
import Link from "next/link";
import styles from "./ingredient.module.css";

export default function Ingredient() {
  const [rows, setRows] = useState<any[]>([]);
  const [pageNumber, setPageNumber] = useState(1);
  const [selectedRows, setSelectedRows] = useState<GridRowId[]>([]);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [message, setMessage] = useState("");
  const apiRef = useRef<any>(null);
  const columns: GridColDef[] = [
    { field: "name", headerName: "이름", width: 80 },
    { field: "price", headerName: "가격", width: 80 },
    { field: "weight", headerName: "중량", width: 80 },
    {
      field: "editBtn",
      headerName: "기타",
      width: 120,
      renderCell: ({ id }) => (
        <Link
          href={{ pathname: `/ingredient/${id}`, query: { new: false } }}
          as={`/ingredient/${id}`}
        >
          <Button variant="contained" size="small">
            수정
          </Button>
        </Link>
      ),
    },
  ];
  const getGridData = async () => {
    const data = await getIngredientList(pageNumber);
    setRows(data);
  };
  useEffect(() => {
    getGridData();
  }, [pageNumber]);
  const selectionModelChange = (rowSelectionModel: GridRowSelectionModel) => {
    setSelectedRows(rowSelectionModel);
  };
  const deleteRow = () => {
    console.log("selectedRows", selectedRows);
    if (selectedRows.length === 0) {
      setOpenSnackbar(true);
      setMessage("선택된 재료가 없습니다.");
      return;
    }
    if (confirm(`선택한 ${selectedRows.length}건을 삭제하시겠습니까?`)) {
      (async () => {
        const response = await deleteIngredient(selectedRows);
        if (response.success) {
          setOpenSnackbar(true);
          setMessage(response.message);
          getGridData();
        } else {
          // 실패 메세징 처리
        }
      })();
    }
  };
  const handleClose = () => {
    setOpenSnackbar(false);
    setMessage("");
  };

  return (
    <>
      <h1 style={{ marginBottom: 10 }}>재료 관리</h1>
      <Snackbar
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        open={openSnackbar}
        autoHideDuration={3000} // 3초 동안 보여줌
        onClose={handleClose}
        message={message}
      />
      <div style={{ height: "50vh" }}>
        <DataGrid
          apiRef={apiRef}
          rows={rows}
          columns={columns}
          autoPageSize
          getRowId={(row) => row.id}
          checkboxSelection
          onRowSelectionModelChange={selectionModelChange}
        />
      </div>
      <div className={styles.buttonDiv}>
        <Link
          href={{ pathname: "/ingredient/0", query: { new: true } }}
          as="/ingredient/0"
        >
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
