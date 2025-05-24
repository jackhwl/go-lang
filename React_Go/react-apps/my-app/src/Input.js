import { forwardRef } from 'react';

const Input = forwardRef((props, ref) => {
    return (
        <div className="mb-3">
            <label htmlFor={props.name} className="form-label">{props.title}</label>
            <input type={props.type} 
                className={props.className} 
                name={props.name} 
                ref={ref}
                autoComplete={props.autoComplete}
                id={props.name}
                onChange={props.onChange}
            />
        </div>
    )
})

export default Input;