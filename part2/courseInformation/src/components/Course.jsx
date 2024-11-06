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

const Header = ({ text }) => {
  return <h1>{text}</h1>
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

export { Course, Header }
