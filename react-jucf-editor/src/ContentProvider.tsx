import React from "react";
import { useState, createContext } from "react";

export const CountContext = createContext<any>(undefined);

export const CountProvider = ({ children }: any) => {
	const [count, setCount] = useState(0);
	return (
		<CountContext.Provider
			value={{
				count,
				setCount,
			}}
		>
			{children}
		</CountContext.Provider>
	);
};
