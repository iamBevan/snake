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
	const [snakeLength, setSnakeLength] = useState(5);
	const [tail, setTail] = useState<Position[]>([]);
	// const [currentPos, setCurrentPos] = useState<Position>({ x: 7, y: 12 });
	const [yPos, setYPos] = useState(12);
	const [xPos, setXPos] = useState(7);
	const [count, setCount] = useState(0);
	const [delay, setDelay] = useState(2000);
	const [isRunning, toggleIsRunning] = useBoolean(true);
	const [foodCoords, setFoodCoords] = useState<Position>({
		x: Math.floor(Math.random() * 14) + 1,
		y: Math.floor(Math.random() * 24) + 1,
	});
	const [hasFood, setHasFood] = useState(false);

	const [direction, setDirection] = useState<Direction>("up");

	const [grid, setGrid] = useState(() => {
		const rows = [];
		for (let i = 0; i < numRows; i++) {
			rows.push(Array.from(Array(numCols), () => 0));
		}

		return rows;
	});

	// useEffect(() => {
	// 	setGrid(
	// 		produce(grid, (gridCopy) => {
	// 			gridCopy[xPos][yPos] = 1;
	// 		})
	// 	);;
	// }, [xPos]);

	const gameOver = () => {
		return <h1>Game Over</h1>;
	};

	const food = () => {
		setFoodCoords({
			x: Math.floor(Math.random() * 14) + 1,
			y: Math.floor(Math.random() * 24) + 1,
		});
		// setHasFood(true);
		console.log("food");
	};

	const handleColor = (squareVal: number) => {
		if (squareVal === 0) {
			return "black";
		}
		if (squareVal === 1) {
			return "white";
		}
		if (squareVal === 2) {
			return "red";
		}
	};

	const runSnake = () => {
		const isThereFood = () => {
			if (hasFood === false) {
				setGrid(
					produce(grid, (gridCopy) => {
						gridCopy[foodCoords.y][foodCoords.x] = 2;
						// gridCopy[yPos - 1][xPos] = 1;
					})
				);
				setHasFood(true);
			}
		};
		if (
			(yPos === 0 && direction === "up") ||
			(xPos === 0 && direction === "left") ||
			(yPos === numRows - 1 && direction === "down") ||
			(xPos === numCols - 1 && direction === "right")
		) {
			toggleIsRunning(false);
		} else {
			switch (direction) {
				case "up":
					setGrid(
						produce(grid, (gridCopy) => {
							gridCopy[yPos - 1][xPos] = 1;
							if (tail[0]) {
								gridCopy[tail[0]?.y][tail[0]?.x] = 0;
							}
						})
					);
					isThereFood();
					setYPos(yPos - 1);
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
					isThereFood();
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
					isThereFood();
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
					isThereFood();
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
		}
		console.log(grid);
	};

	useInterval(
		() => {
			runSnake();
			setCount(count + 1);
			if (xPos === foodCoords.x && yPos === foodCoords.y) {
				// setSnakeLength((prev) => prev + 1);
				setHasFood(false);
				console.log("DING DING");
				food();
			}

			// console.log("interval log", "x: ", xPos, "y: ", yPos);
			// console.log("food log", "x: ", foodCoords?.x, "y: ", foodCoords?.y);

			// console.log("hasfood", hasFood);
		},
		isRunning ? delay : null
	);

	// console.log("yPos", yPos);
	// console.log("xPos", xPos);

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
			{isRunning ? <h1>Snake</h1> : gameOver()}
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
									backgroundColor: handleColor(grid[i][k]),
									border: "1px solid #f1faee",
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
