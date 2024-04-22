"use client";
import { use, useState } from "react";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import Sidebar from "./components/Sidebar";
import { Scenario, Scores, Startup } from "./models/Scenario";
import { defaultScenario } from "./constants/defaultScene";

export enum Category {
  communication = "communication",
  hiring = "hiring",
  leadership = "leadership",
  motivation = "motivation",
  organizationalCulture = "organizationalCulture",
}

export const calculatePercentage = (
  score: Scores,
  category: Category,
  questions: Scenario[]
) => {
  // basically this calculated how many questions we got right in the category
  const catQuestions = questions.filter((q) => q.category === category);
  if (catQuestions.length === 0) {
    return 0;
  }

  return ((score[category] / catQuestions.length) * 100).toFixed(2);
};

const calculateTotalScore = (scores: Scores) => {
  let sum = 0;
  for (const key in scores) {
    sum += scores[key as Category];
    console.log("updated sum", sum);
  }
  return sum;
};

export default function Home() {
  const [currentQuestion, setCurrentQuestion] = useState(-1);
  const [answers, setAnswers] = useState(Array(10).fill(null));
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isGameOver, setIsGameOver] = useState(false);
  const [isAIAnswering, setIsAIAnswering] = useState(false);
  const [questions, setQuestions] = useState<Scenario[]>(
    defaultScenario as Scenario[]
  );
  const [startup, setStartup] = useState<Startup>({
    startupName: "",
    startupSummary: "",
  });
  const [scores, setScores] = useState<Scores>({
    hiring: 0,
    leadership: 0,
    motivation: 0,
    organizationalCulture: 0,
    communication: 0,
  });
  let useRandom = false;

  const handleAnswer = (answer: number) => {
    if (currentQuestion === questions.length - 1) {
      setIsGameOver(true);
    }
    // answer--;
    console.log({ answer });
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = answer;
    const category: Category = questions[currentQuestion].category;
    if (answer === questions[currentQuestion].correctAnswer) {
      console.log("correct answer...");
      console.log(questions[currentQuestion]);
      const newScores = scores;
      newScores[category] = newScores[category] + 1;
      // console.log("updated category score", newScores);
      setScores(newScores);
      console.log(scores.communication);
    }
    setAnswers(newAnswers);
    //setCurrentQuestion(Math.min(currentQuestion + 1, questions.length - 1));
  };

  const handleStartSimulation = async () => {
    if (useRandom) {
      setIsAIAnswering(true);
      // fetch response from /api/genScenario
      const res = await fetch("/api/genScenario", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          question: "",
        }),
      });
      console.log("fecthed data");

      const data = await res.json();
      //parse based on APIResp type and update states
      console.log(data);
      if (res.status === 200) {
        setStartup({
          startupName: data["startupName"],
          startupSummary: data["startupSummary"],
        });
        setQuestions(data["scenarios"]);
        // console.log({ questions });
        console.log(questions[0].choices)
        setIsAIAnswering(false);
      } else {
        console.log("Error fetching data");
      }
    }

    setCurrentQuestion(0);
    console.log({ currentQuestion });
  };

  const handleSubmit = () => {
    console.log("answers submitted...");
    console.log({ answers });
  };

  return (
    <div className="flex ">
      <main className="p-6 flex flex-grow flex-col items-center justify-center h-screen max-w-5xl mx-auto">
        {/* Start Simulation button */}
        {currentQuestion === -1 && (
          <div>
            <button
              onClick={handleStartSimulation}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              {isAIAnswering
                ? "Generating Screnario for you"
                : "Start Simulation"}
            </button>
            {/* add a swicth here that toggles is Random boolean */}
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                className="form-checkbox h-5 w-5 text-blue-500"
                onChange={() => {
                  useRandom = !useRandom;
                }}
              />
              <span>Use Random Scenario</span>
            </label>
          </div>
        )}
        {/* Questions and choices */}
        {currentQuestion >= 0 && !isGameOver && (
          <>
            <h1 className="text-2xl font-bold mb-4 text-center">
              {questions[currentQuestion].question}
            </h1>
            <div className="space-y-4 flex flex-col items-center">
              {questions[currentQuestion].choices.map((option, index) => (
                <label
                  key={index}
                  className="inline-flex items-center cursor-pointer hover:bg-gray-100 rounded-lg p-4"
                >
                  <input
                    type="radio"
                    key={index + currentQuestion}
                    name={`question-${currentQuestion}`}
                    className="form-radio h-5 w-5 text-blue-500"
                    onChange={() => {
                      handleAnswer(index + 1);
                      setSelectedAnswer(index);
                    }}
                  />
                  <span className="ml-3 text-lg">{option}</span>
                </label>
              ))}
            </div>
            {selectedAnswer !== null && (
              <div
                className={`p-4 rounded mt-4 ${
                  selectedAnswer + 1 ===
                  questions[currentQuestion].correctAnswer
                    ? "bg-green-200"
                    : "bg-red-200"
                }`}
              >
                <p>{questions[currentQuestion].reason}</p>
                <p>
                  Correct option :{" "}
                  {
                    questions[currentQuestion].choices[
                      questions[currentQuestion].correctAnswer - 1
                    ]
                  }
                </p>
                <button
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4"
                  onClick={() => {
                    // Reset selected answer and go to next question
                    setSelectedAnswer(null);
                    setCurrentQuestion(currentQuestion + 1);
                  }}
                >
                  Next
                </button>
              </div>
            )}
            {currentQuestion === questions.length - 1 && (
              <button
                className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mt-4"
                onClick={() => {
                  handleSubmit();
                }}
              >
                Submit
              </button>
            )}
            <div></div>
          </>
        )}
        {isGameOver === true && (
          <div className="flex flex-row space-x-4">
            <h2 className="text-2xl">
              Your total score : {calculateTotalScore(scores)}
            </h2>
            {Object.keys(Category).map((key, index) => (
              <div key={index} className="flex flex-col items-center">
                <CircularProgressbar
                  value={Number(
                    calculatePercentage(
                      scores,
                      Category[key as keyof typeof Category],
                      questions
                    )
                  )}
                  text={`${calculatePercentage(
                    scores,
                    Category[key as keyof typeof Category],
                    questions
                  )}%`}
                  styles={buildStyles({
                    textSize: "16px",
                    pathColor: "#4CAF50",
                    textColor: "#4CAF50",
                    trailColor: "#d6d6d6",
                  })}
                />
                <h2 className="text-center">
                  {Category[key as keyof typeof Category]}
                </h2>
              </div>
            ))}
          </div>
        )}
      </main>
      <Sidebar
        questions={questions}
        currentQuestion={currentQuestion}
        isAIAnswering={isAIAnswering}
        startup={startup}
      />
    </div>
  );
}
