import React, { useState } from 'react';

interface InputCardProps {
    idFunction: number;
    useFunction: string;
    onSave: (id: number, newValue: string) => void; // Callback to update the function in the parent
    onDelete: (id: number) => void; // Callback to delete the function from the parent
}



function InputCard({ idFunction, useFunction, onSave, onDelete }: InputCardProps) {
    const [inputValue, setInputValue] = useState<string>(useFunction);

    // This works as a way to update the local state of the input card whenever the parent state changes, for example when we add a new function or when we update a function from another input card.
    // useEffect(() => {
    //     setInputValue(useFunction);
    // }, [useFunction]);

    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            console.log('Saving function for id', idFunction, 'with value', useFunction);
            onSave(idFunction, inputValue);
            event.currentTarget.blur(); // Remove focus after saving
        }
    };

    /*
    We have two events, first we are typing, we activate the useEffect to our local variable
    through the setInputValue, then we press enter and we call the onSave function to update the parent state with the new value.
    This way we can have multiple input cards and each one will have its own state, but when we press enter we update the parent state with the new value.
    The parent state is a record of functions, where the key is the id of the function and the value is the function itself.
    This way we can have multiple functions and each one will have its own input card.
    We can also add a button to delete a function, but for now we will just focus on adding and updating functions.
     */
    console.log('rendering input card', idFunction, useFunction);
    return (
        <div className="input-card">
            <input type="text" 
            placeholder="e.g. a * Math.sin(x)" 
            value={inputValue} 
            onChange={(e) => setInputValue(e.target.value)} 
            onKeyDown={handleKeyDown} />
            <button onClick={() => onDelete(idFunction)}>Delete</button>
        </div>
    );
};

export default InputCard;
