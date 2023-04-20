import { useRouter } from "next/router";
import { BaseSyntheticEvent, useEffect, useState } from "react";
import {
  StoreType,
  Ingredient,
  Recipe,
  Step,
  getDBDataList,
} from "../api/dbconfig";
import {
  Box,
  Button,
  Grid,
  MenuItem,
  Select,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import styles from "./recipe.module.css";
import { Add } from "@mui/icons-material";

export default function Detail() {
  const [id, setId] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [cnt, setCnt] = useState<number>(0);
  const [description, setDescription] = useState<string>();
  const [step, setStep] = useState<Step[]>([]);
  const [originData, setOriginData] = useState<Recipe>({
    name: "",
    description: "",
    cnt: 0,
    step: [],
  });
  const [ingredient, setIngredient] = useState<Ingredient[]>([]);
  const router = useRouter();
  useEffect(() => {
    if (router.query.id) setId(router.query.id as string);
  }, [router.query.id]);
  useEffect(() => {
    // if (id !== "0") {
    //   //기존데이터 수정
    //   (async () => {
    //     const data = await getRecipe(Number(id));
    //     setOriginData(data);
    //   })();
    // }
  }, [id]);
  useEffect(() => {
    (async () => {
      const data = await getDBDataList(StoreType.INGREDIENT);
      setIngredient(data as Ingredient[]);
    })();
  }, []);
  const onSubmit = (e: BaseSyntheticEvent) => {
    e.preventDefault();

    if (confirm("저장하시겠습니까?")) {
      const data = {
        name,
        description,
        step,
      };
      console.log("data", data);
    }
  };

  const initData = () => {
    setName(originData.name);
    setDescription(originData.description);
    setStep(originData.step);
  };

  const handleChange = (
    index: number,
    field: string,
    value: string | number
  ) => {
    console.log(value);
    console.log(typeof value);
    const newStep = [...step];
    newStep[index][field] = value;
    setStep(newStep);
  };
  const handleDelete = (index: number) => {
    const newStep = [...step];
    newStep.splice(index, 1);
    setStep(newStep);
  };
  const handleAddRow = () => {
    setStep([...step, { id: 0, weight: 0, description: "" }]);
  };

  return (
    <>
      <h1 style={{ marginBottom: 10 }}>
        레시피 {id !== "0" ? "수정" : "등록"}
      </h1>
      <Box
        component="form"
        onSubmit={onSubmit}
        sx={{ display: "flex", flexDirection: "column" }}
      >
        <TextField
          required
          type="text"
          id="name"
          label="이름"
          value={name}
          onChange={(e: BaseSyntheticEvent) => setName(e.target.value)}
          variant="standard"
        />
        <TextField
          required
          type="number"
          id="cnt"
          label="수량"
          value={cnt}
          onChange={(e: BaseSyntheticEvent) => setCnt(e.target.value)}
          variant="standard"
        />
        <TextField
          type="text"
          id="description"
          label="설명"
          value={description}
          onChange={(e: BaseSyntheticEvent) => setDescription(e.target.value)}
          variant="standard"
          multiline
          rows={2}
        />
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell align="center">순서</TableCell>
                  <TableCell align="center">재료</TableCell>
                  <TableCell align="center">용량</TableCell>
                  <TableCell align="left">상세</TableCell>
                  <TableCell align="center">
                    <Button
                      variant="text"
                      onClick={handleAddRow}
                      style={{ marginTop: 5 }}
                    >
                      <Add />
                    </Button>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {step.map((row, index) => (
                  <TableRow key={index}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell align="center">
                      <Select
                        value={row.id}
                        onChange={(e) => {
                          handleChange(index, "id", e.target.value);
                        }}
                        size="small"
                      >
                        <MenuItem key={0} value={0}>
                          미선택
                        </MenuItem>
                        {ingredient.map((record) => (
                          <MenuItem key={record.id} value={record.id}>
                            {record.name}
                          </MenuItem>
                        ))}
                      </Select>
                    </TableCell>
                    <TableCell align="center">
                      <TextField
                        type="number"
                        value={row.weight}
                        onChange={(e) =>
                          handleChange(
                            index,
                            "weight",
                            parseFloat(e.target.value)
                          )
                        }
                        size="small"
                      />
                    </TableCell>
                    <TableCell align="left">
                      <TextField
                        value={row.description}
                        onChange={(e) =>
                          handleChange(index, "description", e.target.value)
                        }
                        size="small"
                      />
                    </TableCell>
                    <TableCell align="center">
                      <Button
                        variant="outlined"
                        onClick={() => handleDelete(index)}
                      >
                        삭제
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <Typography component="span" mt={2}>
              {step.length > 0 ? (
                <>
                  [{name}] {cnt}개 만큼 만드는 데에 총
                  <br />
                  {step
                    .reduce((acc: { id: number; weight: number }[], cur) => {
                      if (cur.id === 0) return acc;
                      const existingData:
                        | { id: number; weight: number }
                        | undefined = acc.find((d) => d.id === cur.id);

                      if (existingData) {
                        existingData.weight += cur.weight;
                      } else {
                        acc.push({ id: cur.id, weight: cur.weight });
                      }
                      return acc;
                    }, [])
                    .map((r, i) => {
                      const item: Ingredient = ingredient.find(
                        (item) => item.id === r.id
                      ) as Ingredient;
                      const price = (
                        (item.price / item.weight) *
                        r.weight
                      ).toFixed(2);
                      return (
                        <>
                          {i + 1}.{item.name} : {r.weight}(g/ml/개) 가격 :{" "}
                          {price} <br />
                        </>
                      );
                    })}
                  의 재료가 필요합니다.
                </>
              ) : (
                ""
              )}
            </Typography>
          </Grid>
        </Grid>
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
