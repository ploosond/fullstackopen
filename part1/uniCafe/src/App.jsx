import { useState } from "react"

const Button = ({ handleChange, text }) => (
  <button onClick={handleChange}>{text}</button>
)

const StatisticLine = ({ text, value }) => (
  <tr>
    <td>{text}</td>
    <td>{value}</td>
  </tr>
)

const Statistics = ({ good, neutral, bad }) => {
  const allTotal = good + neutral + bad
  const average = (good - bad) / (good + neutral + bad)
  const positivePercentage = (good / (good + neutral + bad)) * 100 + " %"

  if (allTotal === 0) {
    return <p>No feedback given</p>
  }
  return (
    <table>
      <tbody>
        <StatisticLine text="good" value={good} />
        <StatisticLine text="neutral" value={neutral} />
        <StatisticLine text="bad" value={bad} />
        <StatisticLine text="all" value={allTotal} />
        <StatisticLine text="average" value={average} />
        <StatisticLine text="positive" value={positivePercentage} />
      </tbody>
    </table>
  )
}

const App = () => {
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  const handleGood = () => {
    setGood(good + 1)
  }
  const handleNeutral = () => {
    setNeutral(neutral + 1)
  }
  const handleBad = () => {
    setBad(bad + 1)
  }

  return (
    <div>
      <h1>give feedback</h1>
      <Button handleChange={handleGood} text="good" />
      <Button handleChange={handleNeutral} text="neutral" />
      <Button handleChange={handleBad} text="bad" />
      <h2>statistics</h2>
      <Statistics good={good} neutral={neutral} bad={bad} />
    </div>
  )
}

export default App
