import React, { useId } from 'react';

const FormInput = ({
                       label,
                       type = 'text',
                       name,
                       value,
                       onChange,
                       error,
                       placeholder,
                       required = false,
                       options,
                       id,
                       ...props
                   }) => {
    const generatedId = useId();
    const inputId = id ?? generatedId;
    const errorId = error ? `${inputId}-error` : undefined;
    const labelId = `${inputId}-label`;
    const accessibility = { id: inputId, 'aria-invalid': !!error, 'aria-describedby': errorId };

    const renderInput = () => {
        if (type === 'select') {
            return (
                <select
                    {...props}
                    {...accessibility}
                    name={name}
                    value={value}
                    onChange={onChange}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent ${
                        error ? 'border-red-500' : 'border-gray-300'
                    }`}
                    required={required}
                >
                    <option value="">Select {label}</option>
                    {options?.map((option) => (
                        <option key={option.value} value={option.value} disabled={option.disabled} hidden={option.hidden}>
                            {option.label}
                        </option>
                    ))}
                </select>
            );
        }

        if (type === 'textarea') {
            return (
                <textarea
                    {...accessibility}
                    name={name}
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    rows={4}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent ${
                        error ? 'border-red-500' : 'border-gray-300'
                    }`}
                    required={required}
                    {...props}
                />
            );
        }

        if (type === 'radio-group') {
            return (
                <div className="flex space-x-4" role="radiogroup" aria-invalid={!!error} aria-labelledby={labelId} aria-describedby={errorId}>
                    {options?.map((option) => (
                        <label key={option.value} className="flex items-center space-x-2">
                            <input
                                type="radio"
                                name={name}
                                value={option.value}
                                checked={value === option.value}
                                onChange={onChange}
                                className="text-red-600 focus:ring-red-500"
                                required={required}
                                aria-describedby={errorId}
                            />
                            <span>{option.label}</span>
                        </label>
                    ))}
                </div>
            );
        }

        return (
            <input
                {...accessibility}
                type={type}
                name={name}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent ${
                    error ? 'border-red-500' : 'border-gray-300'
                }`}
                required={required}
                {...props}
            />
        );
    };

    const Label = type === 'radio-group' ? 'span' : 'label';

    return (
        <div className="mb-4">
            <Label id={labelId} htmlFor={type === 'radio-group' ? undefined : inputId} className="block text-sm font-medium text-gray-700 mb-2">
                {label} {required && <span className="text-red-500">*</span>}
            </Label>
            {renderInput()}
            {error && <p id={errorId} role="alert" className="mt-1 text-sm text-red-600">{error}</p>}
        </div>
    );
};

export default FormInput;