import React from 'react'

export const handleColor = (squareVal: number) => {
    if (squareVal === 0) {
        return "black"
    }
    if (squareVal === 1) {
        return "white"
    }
    if (squareVal === 2) {
        return "red"
    }
}