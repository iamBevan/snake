import React, { useState, useEffect, useCallback } from "react";
import styles from "./Grid.module.scss";
import produce from "immer";
import { useInterval, useBoolean } from "react-use";

interface Position {
	x: number;
	y: number;
}

type Direction = "left" | "right" | "up" | "down";
const numRows = 25;
const numCols = 15;

function Grid() {
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const [snakeLength, setSnakeLength] = useState(3);
	const [tail, setTail] = useState<Position[]>([]);
	// const [currentPos, setCurrentPos] = useState<Position>({ x: 7, y: 12 });
	const [yPos, setYPos] = useState(12);
	const [xPos, setXPos] = useState(7);
	const [count, setCount] = useState(0);
	const [delay, setDelay] = useState(500);
	const [isRunning, toggleIsRunning] = useBoolean(true);

	const [direction, setDirection] = useState<Direction>("up");

	const [grid, setGrid] = useState(() => {
		const rows = [];
		for (let i = 0; i < numRows; i++) {
			rows.push(Array.from(Array(numCols), () => 0));
		}

		return rows;
	});

	const gameOver = () => {
		return <h1>Game Over</h1>;
	};

	const runSnake = () => {
		if (yPos > 0 && yPos < numRows - 1 && xPos > 0 && xPos < numCols - 1) {
			switch (direction) {
				case "up":
					const up = produce(grid, (gridCopy) => {
						gridCopy[yPos - 1][xPos] = 1;
						if (tail[0]) {
							gridCopy[tail[0]?.y][tail[0]?.x] = 0;
						}
					});
					setYPos(yPos - 1);
					setGrid(up);
					break;
				case "down":
					setGrid(
						produce(grid, (gridCopy) => {
							gridCopy[yPos + 1][xPos] = 1;
							if (tail[0]) {
								gridCopy[tail[0]?.y][tail[0]?.x] = 0;
							}
						})
					);
					setYPos(yPos + 1);

					break;
				case "left":
					setGrid(
						produce(grid, (gridCopy) => {
							gridCopy[yPos][xPos - 1] = 1;
							if (tail[0]) {
								gridCopy[tail[0]?.y][tail[0]?.x] = 0;
							}
						})
					);
					setXPos(xPos - 1);

					break;
				case "right":
					setGrid(
						produce(grid, (gridCopy) => {
							gridCopy[yPos][xPos + 1] = 1;
							if (tail[0]) {
								gridCopy[tail[0]?.y][tail[0]?.x] = 0;
							}
						})
					);
					setXPos(xPos + 1);

					break;
			}
			if (tail?.length === snakeLength) {
				let position = { x: xPos, y: yPos };
				let newPosition = [...tail, position];
				newPosition.shift();
				setTail(newPosition);
			} else {
				tail.push({ x: xPos, y: yPos });
			}
		} else {
			toggleIsRunning(false);
			console.log("else");
		}
	};

	useInterval(
		() => {
			runSnake();
			setCount(count + 1);
			console.log(tail);
		},
		isRunning ? delay : null
	);

	// console.log(grid);
	console.log("yPos", yPos);
	console.log("xPos", xPos);

	const handleKeyPress = useCallback((e: KeyboardEvent) => {
		e.preventDefault();

		switch (e.keyCode) {
			case 38:
				setDirection("up");
				console.log("Up Arrow");
				break;
			case 40:
				setDirection("down");
				console.log("Down Arrow");
				break;
			case 37:
				setDirection("left");
				console.log("Left Arrow");
				break;
			case 39:
				setDirection("right");
				console.log("Right Arrow");
				break;
			default:
				console.log("Break");
		}
	}, []);

	useEffect(() => {
		document.addEventListener("keydown", handleKeyPress, true);
	}, [handleKeyPress]);

	return (
		<>
			{isRunning ? undefined : gameOver()}
			<div className={styles.container}>
				<div
					className={styles.grid}
					style={{
						gridTemplateColumns: `repeat(${numCols}, 27px)`,
					}}
				>
					{grid.map((rows, i) =>
						rows.map((col, k) => (
							<div
								key={`${i}-${k}`}
								style={{
									width: 25,
									height: 25,
									backgroundColor: grid[i][k] ? "red" : "lightblue",
									border: "1px solid grey",
								}}
							/>
						))
					)}
				</div>
			</div>
			<div>
				delay: <input value={delay} onChange={(event) => setDelay(Number(event.target.value))} />
			</div>
			<h1>count: {count}</h1>
			<div>
				<button onClick={toggleIsRunning}>{isRunning ? "stop" : "start"}</button>
			</div>
		</>
	);
}

export { Grid };
