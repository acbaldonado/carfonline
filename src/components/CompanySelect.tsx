import React from 'react';
import Select from 'react-select';

interface CustomerOption {
  custno: string;
  custname: string;
}

interface CompanySelectProps {
  value: string;
  onChange: (value: string) => void;
  options: CustomerOption[];
  isInvalid?: boolean;
}

const CompanySelect: React.FC<CompanySelectProps> = ({ value, onChange, options, isInvalid }) => {
  const selectOptions = options.map(opt => ({
    value: opt.custname,
    label: `${opt.custname} (${opt.custno})`,
  }));

  alert("23");
  const selectedOption = selectOptions.find(opt => opt.value === value) || null;

  return (
    <Select
      value={selectedOption}
      onChange={(option) => onChange(option?.value || '')}
      options={selectOptions}
      placeholder="Search and select company..."
      isClearable
      isSearchable
      className={isInvalid ? 'error-border' : ''}
      styles={{
        control: (base, state) => ({
          ...base,
          borderColor: isInvalid ? '#ef4444' : state.isFocused ? '#3b82f6' : '#d1d5db',
          boxShadow: state.isFocused ? '0 0 0 2px rgba(59, 130, 246, 0.3)' : 'none',
          '&:hover': {
            borderColor: state.isFocused ? '#3b82f6' : '#d1d5db',
          },
        }),
        menu: (base) => ({
          ...base,
          zIndex: 9999,
        }),
      }}
      filterOption={(option, searchText) => {
        const label = option.label.toLowerCase();
        const search = searchText.toLowerCase();
        return label.includes(search);
      }}
    />
  );
};

export default CompanySelect;