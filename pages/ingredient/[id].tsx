import { Box, Button, TextField } from "@mui/material";
import { BaseSyntheticEvent, ChangeEventHandler, useState } from "react";
import { addIngredient } from "../api/dbconfig";

type TextProps = {
  id: string;
  label: string;
  required?: boolean;
  type?: string;
  value?: string;
  onChange?: ChangeEventHandler;
};

function IngredText({
  id,
  label,
  required = false,
  type = "text",
  value,
  onChange,
}: TextProps) {
  return (
    <TextField
      required={required}
      type={type}
      id={id}
      label={label}
      value={value}
      onChange={onChange}
      variant="standard"
    />
  );
}

export default function Detail() {
  const [name, setName] = useState<string>("");
  const [price, setPrice] = useState<string>("0");
  const [weight, setWeight] = useState<string>("0");

  //등록&수정 이벤트
  const onSubmit = async (e: BaseSyntheticEvent) => {
    e.preventDefault();

    if (confirm("저장하시겠습니까?")) {
      const data = {
        name,
        price,
        weight,
      };
      addIngredient(data);
    }
  };

  return (
    <>
      <h1 style={{ marginBottom: 10 }}>재료 등록</h1>
      <Box
        component="form"
        onSubmit={onSubmit}
        sx={{ display: "flex", flexDirection: "column" }}
      >
        <IngredText
          id="name"
          label="재료명"
          value={name}
          onChange={(e: BaseSyntheticEvent) => {
            setName(e.target.value);
          }}
          required
        />
        <IngredText
          id="price"
          label="가격"
          value={price}
          onChange={(e: BaseSyntheticEvent) => {
            setPrice(e.target.value);
          }}
          type="number"
        />
        <IngredText
          id="weight"
          label="중량"
          value={weight}
          onChange={(e: BaseSyntheticEvent) => {
            setWeight(e.target.value);
          }}
          type="number"
        />

        <Button type="submit" style={{ marginTop: 10 }} variant="contained">
          등록
        </Button>
        <Button>초기화</Button>
      </Box>
    </>
  );
}
