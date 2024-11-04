import { useState } from "react"

const App = () => {
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)
  const [allTotal, setAll] = useState(0)

  const handleGood = () => {
    const updatedValue = good + 1
    setGood(updatedValue)
    setAll(updatedValue + neutral + bad)
  }
  const handleNeutral = () => {
    const updatedValue = neutral + 1
    setNeutral(updatedValue)
    setAll(good + updatedValue + bad)
  }
  const handleBad = () => {
    const updatedValue = bad + 1
    setBad(updatedValue)
    setAll(good + neutral + updatedValue)
  }

  return (
    <div>
      <h1>give feedback</h1>
      <button onClick={handleGood}>good</button>
      <button onClick={handleNeutral}>neutral</button>
      <button onClick={handleBad}>bad</button>
      <h2>statistics</h2>
      <p>good {good}</p>
      <p>neutal {neutral}</p>
      <p>bad {bad}</p>
      <p>all {allTotal}</p>
      <p>average {(good - bad) / allTotal}</p>
      <p>positive {(good / allTotal) * 100} %</p>
    </div>
  )
}

export default App
