
import React, { createContext, useState, ReactNode } from 'react';

interface BookingContextType {
  numberOfPeople: number;
  setNumberOfPeople: (count: number) => void;
}

export const BookingContext = createContext<BookingContextType | undefined>(undefined);

export const BookingProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [numberOfPeople, setNumberOfPeople] = useState<number>(0);

  return (
    <BookingContext.Provider value={{ numberOfPeople, setNumberOfPeople }}>
      {children}
    </BookingContext.Provider>
  );
};
