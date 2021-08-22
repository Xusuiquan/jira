import React from "react";
import { SearchPanel } from "./search-panel";
import { useState, useEffect } from "react";
import { List } from "./list";
import { cleanObject } from "utils";
import qs from "qs";

const apiUrl = "http://localhost:3001";

export const ProjectListScreen = () => {
  const [param, setParam] = useState({
    name: "",
    personId: "",
  });

  const [list, setList] = useState([]);
  const [users, setUsers] = useState([]);

  // 自定义 hooks
  const useDebounce = (value: any, delay: number) => {
    const [debounceValue, setDebounceValue] = useState(value);

    useEffect(() => {
      // 每次在value变化以后，设置一个定时器
      const timeout = setTimeout(() => setDebounceValue(value), delay);
      // 每次在上一个useEffect处理完后再运行
      return () => clearTimeout(timeout);
    }, [value, delay]);

    return debounceValue;
  };

  const debounceParam = useDebounce(param, 200);

  useEffect(() => {
    fetch(
      `${apiUrl}/projects?${qs.stringify(cleanObject(debounceParam))}`
    ).then(async (response) => {
      if (response.ok) {
        setList(await response.json());
      }
    });
  }, [debounceParam]);

  useEffect(() => {
    fetch(`${apiUrl}/users`).then(async (response) => {
      if (response.ok) {
        setUsers(await response.json());
      }
    });
  }, []);

  return (
    <div>
      <SearchPanel users={users} param={param} setParam={setParam} />
      <List users={users} list={list} />
    </div>
  );
};
