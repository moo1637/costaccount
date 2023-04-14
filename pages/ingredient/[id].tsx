import { Alert, Box, Button, TextField } from "@mui/material";
import React, {
  BaseSyntheticEvent,
  ChangeEventHandler,
  useEffect,
  useState,
} from "react";
import { Ingredient, addIngredient, getIngredient } from "../api/dbconfig";
import { useRouter } from "next/router";
import styles from "./ingredient.module.css";

export default function Detail() {
  const router = useRouter();
  const isEditMode = router.query.new === "false"; // 재료 수정인지 여부
  const [name, setName] = useState<string>("");
  const [price, setPrice] = useState<number>(0);
  const [weight, setWeight] = useState<number>(0);
  const [showAlert, setShowAlert] = useState<boolean>(false);
  const [message, setMessage] = useState<string>();
  const [originData, setOriginData] = useState<Ingredient>({
    name: "",
    price: 0,
    weight: 0,
  });
  //등록&수정 이벤트
  const onSubmit = async (e: BaseSyntheticEvent) => {
    e.preventDefault();

    if (confirm("저장하시겠습니까?")) {
      const data = {
        name,
        price,
        weight,
      };
      if (isEditMode) {
      } else {
        addIngredient(data, (success, message) => {
          if (success) {
            setMessage("");
            setShowAlert(true);
            initData();
          } else {
            console.log(message);
            setMessage(message);
            setShowAlert(true);
          }
        });
      }
    }
  };
  useEffect(() => {
    if (isEditMode) {
      //기존데이터 수정
      (async () => {
        const data = await getIngredient(Number(router.query.id));
        setOriginData(data);
      })();
    }
  }, []);
  useEffect(() => {
    initData();
  }, [originData]);

  const initData = () => {
    setName(originData.name);
    setPrice(originData.price);
    setWeight(originData.weight);
  };
  return (
    <>
      <h1 style={{ marginBottom: 10 }}>재료 {isEditMode ? "수정" : "등록"}</h1>
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
            {isEditMode ? "수정" : "등록"}
          </Button>
          <Button color="inherit" variant="contained" onClick={initData}>
            초기화
          </Button>
        </div>
      </Box>
    </>
  );
}
