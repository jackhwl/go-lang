const CheckBox = (props) => {
    return (
        <div className="form-check">
            <input
                type="checkbox"
                className="form-check-input"
                id={props.name}
                name={props.name}
                checked={props.checked}
                onChange={props.onChange}
            />
            <label htmlFor={props.name} className="form-check-label">{props.title}</label>
            <div className={props.errorDiv}>{props.errorMsg}</div>
        </div>
    );
}

export default CheckBox;