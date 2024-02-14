# The Odin Project: Tic Tac Toe

This is my solution to the Odin Project's Tic Tac Toe project, the specifications of which can be found [here](https://www.theodinproject.com/lessons/node-path-javascript-tic-tac-toe).

This project focuses on using **factories** (factory functions) and **IIFE** (Immediately Invoked Function Expression) to limit global code. It also uses the concept of **closures** in JavaScript, which is a technique for organizing code providing a way to create private functions and variables that are not accessible from the global scope. This can help to manage the global namespace and prevent naming conflicts.

Conditions for winning or ending the game:

1. To win all markers in a row should be = (e.g. indices for nested array: `[0][0] == [0][1] == [0][2]`).
2. To win all markers in a column should be = (e.g. indices for nested array: `[0][0] == [1][0] == [2][0]`).
3. To win diagonal markers shoud be = (e.g. indices for nested array: `[0][0] == [1][1] == [2][2] || [0][2] == [1][1] == [2][0]`).
4. If none of the above conditions are met and the entire board is filled, then there is no winner. The game is a tie.

## Additional info

**Closures** can also be used to create modules, which can encapsulate related functionality and make it available through a public interface. This can make the code more modular, reusable, and easier to understand. Additionally, closures provide a way to create functions that maintain access to their original context even after the outer function has returned, which can be useful for creating functions that need to access and manipulate data from their enclosing scope.
