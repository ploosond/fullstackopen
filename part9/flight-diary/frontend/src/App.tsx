import React, { useEffect, useState } from "react";
import { Diary, NewDiary, Visibility, Weather } from "./types";
import { createDiary, getAllDiaries } from "./serviceDiary";
import axios from "axios";

const Notify = ({ message }: { message: string }) => {
  return <p style={{ color: "red" }}>{message}</p>;
};

const App = () => {
  const [diaries, setDiaries] = useState<Diary[]>([]);
  const [newDiary, setNewDiar] = useState<NewDiary>({
    date: "",
    visibility: "" as Visibility,
    weather: "" as Weather,
    comment: "",
  });
  const [errorMessage, setErrorMessage] = useState("");

  const notify = (message: string) => {
    setErrorMessage(message);
  };

  useEffect(() => {
    getAllDiaries().then((data) => {
      setDiaries(data);
    });
  }, []);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewDiar((prev) => ({
      ...prev,
      [event.target.name]: event.target.value,
    }));
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    createDiary(newDiary)
      .then((data) => {
        setDiaries(diaries.concat(data));
      })
      .catch((error) => {
        if (axios.isAxiosError(error)) {
          notify(error.response?.data);
          setTimeout(() => {
            notify("");
          }, 5000);
        }
      });
    setNewDiar({
      date: "",
      visibility: "" as Visibility,
      weather: "" as Weather,
      comment: "",
    });
  };

  return (
    <div>
      <div>
        <h3>Add new entry</h3>
        <Notify message={errorMessage} />
        <form onSubmit={handleSubmit}>
          <div>
            date
            <input
              type="text"
              name="date"
              value={newDiary.date}
              onChange={handleChange}
            />
          </div>
          <div>
            visibility
            <input
              type="text"
              name="visibility"
              value={newDiary.visibility}
              onChange={handleChange}
            />
          </div>
          <div>
            weather
            <input
              type="text"
              name="weather"
              value={newDiary.weather}
              onChange={handleChange}
            />
          </div>
          <div>
            comment
            <input
              type="text"
              name="comment"
              value={newDiary.comment}
              onChange={handleChange}
            />
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
