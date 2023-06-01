"use client";

import React, { useEffect, useState } from "react";
import styles from "./styles.module.css";
import * as sortingAlgorithms from "../sortingAlgorithms";
import * as Tone from "tone";

const SortingVisualizer = () => {
  const [array, setArray] = useState<number[]>([]);
  const [arrayLength, setArrayLength] = useState<number>(40);
  const [pending, setPending] = useState(false);
  const [audioOn, setAudioOn] = useState(true);

  useEffect(() => {
    resetArray();
  }, []);

  useEffect(() => {
    if (array.length > arrayLength) {
      setArray((prevArray) => prevArray.slice(0, arrayLength));
    } else {
      const remainLength = arrayLength - array.length;
      let remainArray: number[] = [];
      for (let i = 0; i < remainLength; i++) {
        remainArray.push(randomIntFromInterval(50, 900));
      }
      setArray((prevArray) => [...prevArray, ...remainArray]);
    }
  }, [arrayLength, array.length]);

  async function resetArray() {
    let array = [];
    for (let i = 0; i < arrayLength; i++) {
      array.push(randomIntFromInterval(50, 900));
    }
    setArray(array);
  }

  const playNote = async (noteNumber: number, swapIndex: number) => {
    if (!audioOn) return;
    function getTonalityFromNumber(number: number) {
      const halfSteps = Math.abs(number + 30);
      const octave = Math.floor(halfSteps / 12);
      const noteIndex = halfSteps % 12;
      const noteNames = [
        "C",
        "C#",
        "D",
        "D#",
        "E",
        "F",
        "F#",
        "G",
        "G#",
        "A",
        "A#",
        "B",
      ];
      const note = noteNames[noteIndex];
      // console.log("note:", note);
      return `${note}${octave}`;
    }

    const tonality = getTonalityFromNumber(noteNumber);
    const duration = swapIndex % 2 === 0 ? "8n" : "16n";
    const synth = new Tone.PolySynth(Tone.Synth).toDestination();
    await Tone.start();
    Tone.loaded().then(() => {
      synth.triggerAttackRelease(tonality, duration);
    });
  };

  function animateArray(iterations: number[][] = [], dots: number[][] = []) {  
    const animateSpeed = 2000 / arrayLength;
    const arrayHtml = document.querySelector("#array");
    setPending(true);
    for (let i = 0; i < iterations.length; i++) {
      if (i < iterations.length) {
        const left = arrayHtml?.children[dots[i][0]].children[0] as HTMLElement;
        const right = arrayHtml?.children[dots[i][1]]
          .children[0] as HTMLElement;
        setTimeout(() => {
          setArray(iterations[i]);
          playNote(dots[i][0], i);
          left.style.backgroundColor = "red";
          right.style.backgroundColor = "green";
        }, i * animateSpeed);

        setTimeout(() => {
          left.style.backgroundColor = "";
          right.style.backgroundColor = "";
          if (i === iterations.length - 1) {
            setPending(false);
          }
        }, (i + 1) * animateSpeed);
      }
    }
  }

  function handleArraySorting(sort: any) {
    if (isArraySorted(array)) {
      let newArray = [];
      for (let i = 0; i < arrayLength; i++) {
        newArray.push(randomIntFromInterval(50, 900));
      }
      setArray(newArray);
      const { iterations, dots } = sort([...newArray]);
      animateArray(iterations, dots);
    } else {
      const { iterations, dots } = sort([...array]);
      animateArray(iterations, dots);
    }
  }

  function mergeSort() {
    handleArraySorting(sortingAlgorithms.mergeSort);
  }

  function heapSort() {
    handleArraySorting(sortingAlgorithms.heapSort);
  }
  
  async function bubbleSort() {
    handleArraySorting(sortingAlgorithms.bubbleSort);
  }
  
  

  function quickSort() {
    handleArraySorting(sortingAlgorithms.quickSort)
  }

  return (
    <>
      <div className={styles.header}>
        <button
          disabled={pending}
          title="Iterative Merge Sort"
          className={styles.button}
          onClick={mergeSort}
        >
          Merge Sort
        </button>
        <button disabled={pending} className={styles.button} onClick={heapSort}>
          Heap Sort
        </button>
        <button
          disabled={pending}
          className={styles.button}
          onClick={bubbleSort}
        >
          Bubble Sort
        </button>
        <button
          disabled={pending}
          className={styles.button}
          onClick={quickSort}
        >
          Quick Sort
        </button>
        <div className={styles.stick}></div>

        <button
          disabled={pending}
          className={styles.button}
          onClick={resetArray}
        >
          Generate New Array
        </button>
        <button
          disabled={pending}
          className={styles.button}
          onClick={() => setAudioOn((state) => !state)}
        >
          Audio {audioOn ? "On" : "Off"}
        </button>
        <div style={{ position: "relative" }}>
          <input
            disabled={pending}
            type="range"
            id="min"
            min={10}
            max={100}
            className={styles.rangeInput}
            value={arrayLength}
            onChange={(event) => setArrayLength(parseInt(event.target.value))}
          />
          <div className={styles.rangeValue}>{arrayLength}</div>
        </div>
      </div>

      <div id="array" className={styles.arrayContainer}>
        {array.map((value, index) => (
          <div key={index}>
            <div
              className={styles.arrayBar}
              style={{
                height: `calc(${value / 11}vh)`,
              }}
            ></div>
            <div className={styles.arrayValue}>{value}</div>
          </div>
        ))}
      </div>
    </>
  );
};

function randomIntFromInterval(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

function isArraySorted(array: number[]) {
  const sortedArray: number[] = [];
  array.forEach((value, index) => (sortedArray[index] = value));
  sortedArray.sort((a, b) => a - b);

  console.log(array, sortedArray);
  for (let i = 0; i < array.length; i++) {
    if (array[i] !== sortedArray[i]) {
      console.log("Массив не отсортирован");
      return false;
    }
  }
  console.log("Массив отсортирован");
  return true;
}

export default SortingVisualizer;
