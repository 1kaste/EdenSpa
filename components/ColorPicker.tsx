
import React from 'react';
import { useAppContext } from '../context/AppContext';

interface ColorPickerProps {
    label: string;
    color: string;
    onChange: (color: string) => void;
}

const ColorPicker: React.FC<ColorPickerProps> = ({ label, color, onChange }) => {
    const { theme } = useAppContext();

    return (
        <div>
            <label className="block text-sm font-medium" style={{ color: theme.textSecondary }}>
                {label}
            </label>
            <div className="mt-1 flex items-center space-x-2">
                <input
                    type="color"
                    value={color}
                    onChange={(e) => onChange(e.target.value)}
                    className="w-8 h-8 p-0 border-none cursor-pointer"
                />
                <span className="text-sm" style={{ color: theme.textPrimary }}>{color.toUpperCase()}</span>
            </div>
        </div>
    );
};

export default ColorPicker;
