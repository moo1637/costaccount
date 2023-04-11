import * as React from "react";
import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import { useState, useEffect } from "react";

export default function BasicSelect() {
  let testDb: IDBDatabase;

  useEffect(() => {
    const dbReq = indexedDB.open("test", 1);
    console.log("dbReq", dbReq);
    dbReq.onsuccess = (Event) => {
      console.log("onsuccess");
      if (Event.target !== null) {
        if (Event.target instanceof IDBOpenDBRequest) {
          testDb = Event.target.result;
          console.log("db", testDb);
        }
      }
    };

    dbReq.onupgradeneeded = (Event) => {
      console.log("onupgradeneeded", Event);
      if (Event.target !== null) {
        if (Event.target instanceof IDBOpenDBRequest) {
          testDb = Event.target.result;
          testDb.createObjectStore("objStore", {
            keyPath: "id",
            autoIncrement: true,
          });
          console.log("db", testDb);
        }
      }
    };
  }, []);

  const fnAdd = () => {
    const name = document.getElementById("name").value;
    const phoneNumber = document.getElementById("phone").value;
    let store = testDb
      .transaction("objStore", "readwrite")
      .objectStore("objStore");
    let addReq = store.add({ name, phoneNumber });
    addReq.onsuccess = (Event) => {
      console.log("Event", Event);
    };
  };
  return (
    <div>
      <input id="name" placeholder="이름" />
      <input id="phone" placeholder="전화번호" />
      <button onClick={fnAdd}>add</button>
    </div>
  );
}
