import { Alert, Box, Button, Snackbar, TextField } from "@mui/material";
import React, {
  BaseSyntheticEvent,
  ChangeEventHandler,
  useEffect,
  useState,
} from "react";
import {
  StoreType,
  Ingredient,
  addDBDataObject,
  getDBDataObject,
  modifyDBDataObject,
} from "../api/dbconfig";
import { useRouter } from "next/router";
import styles from "./ingredient.module.css";

export default function Detail() {
  const [id, setId] = useState("0");
  const [name, setName] = useState<string>("");
  const [price, setPrice] = useState<number>(0);
  const [weight, setWeight] = useState<number>(0);
  const [showAlert, setShowAlert] = useState<boolean>(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [message, setMessage] = useState("");
  const [originData, setOriginData] = useState<Ingredient>({
    name: "",
    price: 0,
    weight: 0,
  });
  const router = useRouter();

  useEffect(() => {
    if (router.query.id) setId(router.query.id as string);
  }, [router.query.id]);
  useEffect(() => {
    if (originData) {
      initData();
    }
  }, [originData]);
  useEffect(() => {
    if (id !== "0") {
      //기존데이터 수정
      (async () => {
        const data = await getDBDataObject(StoreType.INGREDIENT, Number(id));
        setOriginData(data as Ingredient);
      })();
    }
  }, [id]);
  //등록&수정 이벤트
  const onSubmit = async (e: BaseSyntheticEvent) => {
    e.preventDefault();

    if (confirm("저장하시겠습니까?")) {
      const data = {
        name,
        price,
        weight,
      };
      if (id !== "0") {
        const response = await modifyDBDataObject(
          StoreType.INGREDIENT,
          data,
          Number(router.query.id)
        );
        if (response.success) {
          setOpenSnackbar(true);
          setMessage(response.message);
        } else {
          // 실패 메세징 처리
          setOpenSnackbar(true);
          setMessage(response.message);
        }
      } else {
        const response = await addDBDataObject(StoreType.INGREDIENT, data);
        if (response.success) {
          setOpenSnackbar(true);
          setMessage(response.message);
        } else {
          // 실패 메세징 처리
        }
      }
    }
  };
  const initData = () => {
    setName(originData.name);
    setPrice(originData.price);
    setWeight(originData.weight);
  };
  const handleClose = () => {
    setOpenSnackbar(false);
    setMessage("");
  };

  return (
    <>
      <h1 style={{ marginBottom: 10 }}>재료 {id !== "0" ? "수정" : "등록"}</h1>
      <Snackbar
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        open={openSnackbar}
        autoHideDuration={3000} // 3초 동안 보여줌
        onClose={handleClose}
        message={message}
      />
      <Box
        component="form"
        onSubmit={onSubmit}
        sx={{ display: "flex", flexDirection: "column" }}
      >
        <TextField
          required
          type="text"
          id="name"
          label="재료명"
          value={name}
          onChange={(e: BaseSyntheticEvent) => {
            setName(e.target.value);
          }}
          variant="standard"
        />
        <TextField
          required
          type="number"
          id="price"
          label="가격"
          value={price}
          onChange={(e: BaseSyntheticEvent) => {
            setPrice(e.target.value);
          }}
          variant="standard"
        />
        <TextField
          required
          type="number"
          id="weight"
          label="중량"
          value={weight}
          onChange={(e: BaseSyntheticEvent) => {
            setWeight(e.target.value);
          }}
          variant="standard"
        />
        {showAlert && (
          <Alert
            severity={message !== "" ? "error" : "success"}
            onClose={() => setShowAlert(false)}
          >
            {message}
          </Alert>
        )}
        <div className={styles.buttonDiv}>
          <Button type="submit" variant="contained">
            {id !== "0" ? "수정" : "등록"}
          </Button>
          <Button color="inherit" variant="contained" onClick={initData}>
            초기화
          </Button>
        </div>
      </Box>
    </>
  );
}
