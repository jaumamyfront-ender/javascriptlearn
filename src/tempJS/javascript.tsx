import React, { useEffect } from "react";
import { Person } from "./data";

// Описание типа пропсов для компонента
interface Props {
  data: Person[];
}

export default function Javascript({ data }: Props) {
  const originalData = data;
  //copy and return all
  const all = data.map((i) => i);

  //copy and return some
  const some = data.map((i) => i.name);

  //copy and return some and return changed
  const someAndChanged = data.map((i) => ({
    born: i.born,
    allDate: i.born + " " + i.died,
    sex: i.sex + " " + " trans",
  }));

  //change actual array
  if (data) {
    data.map((item) => {
      item.father += "imfather";
      item.name += "bobik";
    });
  }

  console.log("originalData", originalData);
  console.log("changed data", data);
  console.log("map all?", all);
  console.log("map some?", some);
  console.log(" map someAndChanged", someAndChanged);

  // const fltr = data.filter({died}=>died)

  // console.log(mppp);
  return (
    <div>
      {data.map((person, index) => (
        <div key={index}>
          <h3>{person.name}</h3>
          <p>
            Born: {person.born}, Died: {person.died}
          </p>
          <p>
            Father: {person.father}, Mother: {person.mother}
          </p>
        </div>
      ))}
    </div>
  );
}
