import React, { useEffect, useState } from "react";
import { Diary } from "./types";
import { getAllDiaries } from "./serviceDiary";

const App = () => {
  const [diaries, setDiaries] = useState<Diary[]>([]);
  const [newDiary, setNewDiar] = useState({
    date: "",
    visibility: "",
    weather: "",
    comment: "",
  });

  useEffect(() => {
    getAllDiaries().then((data) => {
      setDiaries(data);
    });
  }, []);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewDiar({ ...newDiary, [event.target.name]: event.target.value });
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log(newDiary);
  };

  return (
    <div>
      <div>
        <h3>Add new entry</h3>
        <form onSubmit={handleSubmit}>
          <div>
            date
            <input type="date" name="date" onChange={handleChange} />
          </div>
          <div>
            visibility
            <input type="text" name="visibility" onChange={handleChange} />
          </div>
          <div>
            weather
            <input type="text" name="weather" onChange={handleChange} />
          </div>
          <div>
            comment
            <input type="text" name="comment" onChange={handleChange} />
          </div>
          <button type="submit">add</button>
        </form>
      </div>
      <div>
        <h3>Diary entries</h3>
        {diaries.map((diary) => {
          return (
            <div key={diary.id}>
              <h4>{diary.date}</h4>
              <p>{diary.visibility}</p>
              <p>{diary.weather}</p>
              <em>{diary.comment}</em>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default App;
