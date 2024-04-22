"use client";
import React from "react";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import { Startup } from "../models/Scenario";

export default function Sidebar({
  currentQuestion,
  questions,
  isAIAnswering,
  startup,
}: {
  currentQuestion: number;
  questions: any[];
  isAIAnswering: boolean;
  startup: Startup;
}) {
  return (
    <aside className="p-6 w-64">
      <p className="mb-2">
        Question {currentQuestion + 1} of {questions.length}
      </p>
      <CircularProgressbar
        value={currentQuestion + 1}
        maxValue={questions.length}
        styles={buildStyles({
          textSize: "16px",
          pathColor: "#4CAF50",
          textColor: "#4CAF50",
          trailColor: "#d6d6d6",
        })}
        text={
          Math.floor(
            (Math.max(0, currentQuestion + 1) / questions.length) * 100
          ) + "%"
        }
      />
      <p className="mt-2">{isAIAnswering ? "AI is thinking..." : ""}</p>
      {/* display startup info */}
      {currentQuestion > 0 ? (
        <>
          <h2 className="text-lg font-semibold mt-4">
            Name of the company: {startup.startupName}
          </h2>
          <p>{startup.startupSummary}</p>
        </>
      ) : null}
    </aside>
  );
}
