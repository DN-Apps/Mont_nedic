import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import Select from 'react-select';
import './LanguageSelector.css';

function LanguageSelector() {
    const { i18n } = useTranslation();

    // Setze Deutsch als Standard beim ersten Render
    useEffect(() => {
        if (!i18n.language) {
            i18n.changeLanguage('de');
        }
    }, [i18n]);

    const languages = [
        {
            value: 'de',
            label: 'Deutsch',
            flag: `https://flagcdn.com/16x12/de.png`
        },
        {
            value: 'en',
            label: 'English',
            flag: `https://flagcdn.com/16x12/gb.png`
        }
    ];

    const handleChange = (selectedOption) => {
        i18n.changeLanguage(selectedOption.value);
    };

    const formatOptionLabel = ({ label, flag }) => (
        <div style={{ display: 'flex', alignItems: 'center' }}>
            <img
                src={flag}
                alt=""
                style={{
                    width: '20px',
                    marginRight: '10px',
                    borderRadius: '2px'
                }}
            />
            <span style={{ color: 'black' }}>{label}</span>
        </div>
    );

    // Custom Styles für react-select
    const customStyles = {
        option: (provided, state) => ({
            ...provided,
            color: 'black',
            backgroundColor: state.isSelected ? '#f0f0f0' : 'white',
            ':hover': {
                backgroundColor: '#f5f5f5'
            }
        }),
        singleValue: (provided) => ({
            ...provided,
            color: 'black'
        }),
        menu: (provided) => ({
            ...provided,
            color: 'black'
        }),
        control: (provided) => ({
            ...provided,
            color: 'black',
            border: 'none',
            boxShadow: 'none',
            minHeight: '30px'
        }),
        dropdownIndicator: (provided) => ({
            ...provided,
            padding: '4px'
        }),
        indicatorSeparator: () => ({})
    };

    return (
        <div className="lang-sel-container">
            <Select
                options={languages}
                value={languages.find(opt => opt.value === i18n.language)}
                onChange={handleChange}
                formatOptionLabel={formatOptionLabel}
                isSearchable={false}
                classNamePrefix="select"
                styles={customStyles}
                aria-label="select-lang"
                placeholder="Select language"
            />
        </div>
    );
}

export default LanguageSelector;