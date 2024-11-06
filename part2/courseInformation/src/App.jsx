const App = () => {
  const courses = [
    {
      name: "Half Stack application development",
      id: 1,
      parts: [
        {
          name: "Fundamentals of React",
          exercises: 10,
          id: 1,
        },
        {
          name: "Using props to pass data",
          exercises: 7,
          id: 2,
        },
        {
          name: "State of a component",
          exercises: 14,
          id: 3,
        },
        {
          name: "Redux",
          exercises: 11,
          id: 4,
        },
      ],
    },
    {
      name: "Node.js",
      id: 2,
      parts: [
        {
          name: "Routing",
          exercises: 3,
          id: 1,
        },
        {
          name: "Middlewares",
          exercises: 7,
          id: 2,
        },
      ],
    },
  ]

  return (
    <div>
      <Header text="Web development curriculum" />
      <Course courses={courses} />
    </div>
  )
}
const Header = ({ text }) => {
  return <h1>{text}</h1>
}

const Course = ({ courses }) => {
  return (
    <div>
      {courses.map((course) => {
        return (
          <div key={course.id}>
            <CourseHeader name={course.name} />
            <Content content={course.parts} />
            <Total exercises={course.parts} />
          </div>
        )
      })}
    </div>
  )
}

const CourseHeader = ({ name }) => {
  return <h2>{name}</h2>
}

const Content = ({ content }) => {
  return content.map((part) => (
    <Part key={part.id} name={part.name} exercises={part.exercises} />
  ))
}

const Part = ({ name, exercises }) => {
  return <p>{`${name} ${exercises}`}</p>
}

const Total = ({ exercises }) => {
  const total = exercises.reduce((prev, exercise) => {
    return prev + exercise.exercises
  }, 0)
  return <h4>total of {total} exercises</h4>
}

export default App
