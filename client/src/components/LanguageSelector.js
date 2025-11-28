import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import Select from 'react-select';
import './LanguageSelector.css';

function LanguageSelector() {
    const { i18n } = useTranslation();

    /* ------------------------------------------------------------------
       Beim ersten Render:
       - Falls keine Sprache gesetzt ist (selten, aber möglich),
         wird Deutsch als Standard gesetzt.
       - Sicherstellung, dass i18n immer einen gültigen Wert hat.
       ------------------------------------------------------------------ */
    useEffect(() => {
        if (!i18n.language) {
            i18n.changeLanguage('de');
        }
    }, [i18n]);

    /* ------------------------------------------------------------------
       Liste der verfügbaren Sprachen
       - jedes Item enthält:
         value:   Sprachenkürzel für i18n
         label:   Der angezeigte Name
         flag:    Länderflagge (FlagCDN → super leichtgewichtig)
       ------------------------------------------------------------------ */
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

    /* ------------------------------------------------------------------
       Wenn der Benutzer eine Sprache auswählt:
       - Sprache im i18n-Framework ändern
       - React-Select liefert das Objekt der Option
       ------------------------------------------------------------------ */
    const handleChange = (selectedOption) => {
        i18n.changeLanguage(selectedOption.value);
    };

    /* ------------------------------------------------------------------
       Legt fest, wie jede Option im Select-Menü dargestellt wird:
       - Flagge + Sprachname
       - Verhindert uneinheitliches Styling
       ------------------------------------------------------------------ */
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

    /* ------------------------------------------------------------------
       Custom Styles für react-select:
       - sorgt dafür, dass der Selector farblich in dein Design passt
       - entfernt unnötige Umrandungen
       - verbessert Click-Ziele auf mobilen Geräten
       ------------------------------------------------------------------ */
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
        indicatorSeparator: () => ({}) // Separator entfernen
    };

    /* ------------------------------------------------------------------
       Komponenten-Render:
       - React-Select übernimmt Dropdown-Logik
       - value findet aktuelle Sprache im Array
       - Suche deaktiviert, da nur 2 Optionen
       - aria-label für Accessibility
       ------------------------------------------------------------------ */
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
