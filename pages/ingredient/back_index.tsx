import {
  Box,
  TextField,
  Button,
  Select,
  MenuItem,
  InputLabel,
  SelectChangeEvent,
  FormControl,
} from "@mui/material";
import {
  useState,
  useEffect,
  BaseSyntheticEvent,
  ChangeEventHandler,
} from "react";
import {
  getIngredientList,
  addIngredient,
  getIngredient,
} from "../api/dbconfig";

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
export default function Ingredient() {
  const [itemList, setItemList] = useState<string[]>([]);
  const [item, setItem] = useState<string>("0");
  const [name, setName] = useState<string>("");
  const [price, setPrice] = useState<string>("0");
  const [weight, setWeight] = useState<string>("0");

  useEffect(() => {
    (async () => {
      const list: string[] = await getIngredientList();
      setItemList(list);
    })();
  }, []);

  useEffect(() => {
    if (itemList.length !== 0) {
      console.log("itemList", itemList);
    }
  }, [itemList]);

  useEffect(() => {
    if (item === "0") {
      setName("");
      setPrice("0");
      setWeight("0");
    } else {
      const itemName: string = itemList[parseInt(item) - 1];

      if (itemName !== undefined) {
        (async () => {
          const sItemInfo: { name: string; price: string; weight: string } =
            await getIngredient(itemName);
          if (sItemInfo !== null) {
            setName(sItemInfo.name);
            setPrice(sItemInfo.price);
            setWeight(sItemInfo.weight);
          }
        })();
      }
    }
  }, [item]);
  //기존 등록 재료 선택 이벤트
  const onChange = (e: SelectChangeEvent) => {
    console.log("e.target.value", e.target.value);
    setItem(e.target.value);
  };

  //등록&수정 이벤트
  const onSubmit = async (e: BaseSyntheticEvent) => {
    e.preventDefault();

    const itemName = e.target.name.value;

    const next = await (() => {
      return new Promise((resolve) => {
        if (itemList.indexOf(itemName) > -1) {
          if (
            confirm(
              "동일한 재료가 이미 등록되어 있습니다. 해당 재료의 정보를 수정하시겠습니까?"
            )
          ) {
            resolve(true);
          } else {
            resolve(false);
          }
        } else {
          resolve(true);
        }
      });
    })();
    if (next) {
      const data = {
        name,
        price,
        weight,
      };
      // setItemList((curr) => new Set([...curr, name]));
      // window.localStorage.setItem(
      //   STORAGE_ITEMINFO + name,
      //   JSON.stringify(data)
      // );
      addIngredient(data);
    }
  };

  return (
    <>
      <h1 style={{ marginBottom: 10 }}>재료 등록</h1>
      <FormControl>
        <InputLabel id="ingredSelectLabel">선택</InputLabel>
        <Select
          labelId="ingredSelectLabel"
          id="ingredSelect"
          value={item}
          label="선택"
          onChange={onChange}
        >
          <MenuItem value="0">신규등록</MenuItem>
          {itemList.map((item, index) => (
            <MenuItem key={index + 1} value={(index + 1).toString()}>
              {item}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
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
