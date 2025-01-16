import React, {useState, useEffect} from 'react';
import {State, City} from 'country-state-city';
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';

export const CountrySelectField = ({
  formik,
  stateFieldName,
  cityFieldName,
  fieldName,
  labelName,
  countryList,
  isReadOnly,
  lang,
  currentlyOpenSelect,
  setCurrentlyOpenSelect,
}) => {
  const [isDisabled, setIsDisabled] = useState(isReadOnly);

  useEffect(() => {
    setIsDisabled(isReadOnly);
  }, [isReadOnly]);

  const handleCountryChange = value => {
    formik?.setFieldValue(fieldName, value);
    formik?.setFieldValue(stateFieldName, 'Select');
    formik?.setFieldValue(cityFieldName, 'Select');
    // if (value == 'Select') {
    //   formik?.setFieldTouched(fieldName, true);
    // } else {
    //   formik?.setFieldTouched(fieldName, false);
    // }
  };

  const handleOpenChange = isOpen => {
    setCurrentlyOpenSelect(isOpen ? 'country' : null);
  };

  return (
    <>
      <Select
        onValueChange={handleCountryChange}
        value={formik?.values[fieldName]}
        disabled={isDisabled}
        open={currentlyOpenSelect === 'country'}
        onOpenChange={handleOpenChange}>
        <SelectTrigger className="h-14 border rounded-lg text-neutral-400 pl-4 py-2 flex items-center">
          <div className="text-sm lg:text-base text-black">
            {formik?.values[fieldName] && formik?.values[fieldName] !== 'Select'
              ? countryList.find(item => item.id === formik.values[fieldName])
                  ?.full_name_english
              : lang?.select || 'Select'}
          </div>
        </SelectTrigger>
        <SelectContent className="h-56 overflow-auto">
          <SelectItem value="Select">{lang?.select || 'Select'}</SelectItem>
          {countryList.map(item => (
            <SelectItem key={item.id} value={item.id}>
              {item.full_name_english}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {formik?.touched[fieldName]}
      {formik?.touched[fieldName] && formik.errors[fieldName] && (
        <p className="text-red-500 text-sm mt-1">{formik.errors[fieldName]}</p>
      )}
    </>
  );
};

export const StateSelectField = ({
  formik,
  fieldName,
  cityFieldName,
  countrycode,
  isReadOnly,
  lang,
  currentlyOpenSelect,
  setCurrentlyOpenSelect,
}) => {
  const [states, setStates] = useState([]);
  const [isDisabled, setIsDisabled] = useState(true);

  useEffect(() => {
    const countryValue = formik?.values[countrycode];
    const isCountryEmpty = !countryValue || countryValue === 'Select';
    setIsDisabled(isReadOnly || isCountryEmpty);

    if (!isCountryEmpty) {
      const statesList = State.getStatesOfCountry(countryValue);
      setStates(statesList);

      if (
        statesList.length > 0 &&
        (!formik?.values[fieldName] || formik?.values[fieldName] === 'Select')
      ) {
        // formik?.setFieldValue(fieldName, statesList[0].name);
        formik?.setFieldValue(cityFieldName, 'Select');
      }
    } else {
      setStates([]);
      formik?.setFieldValue(fieldName, 'Select');
      formik?.setFieldValue(cityFieldName, 'Select');
    }
  }, [formik?.values[countrycode], isReadOnly]);

  const handleStateChange = value => {
    formik?.setFieldValue(fieldName, value);
    formik?.setFieldValue(cityFieldName, 'Select');
    // formik?.setFieldTouched(fieldName, false);
    // if (value == 'Select') {
    //   formik?.setFieldTouched(fieldName, true);
    // } else {
    //   formik?.setFieldTouched(fieldName, false);
    //   formik.setFieldError(fieldName, '');
    // }
  };

  const handleOpenChange = isOpen => {
    setCurrentlyOpenSelect(isOpen ? 'state' : null);
  };

  return (
    <>
      <Select
        onValueChange={handleStateChange}
        value={formik?.values[fieldName]}
        disabled={isDisabled}
        open={currentlyOpenSelect === 'state'}
        onOpenChange={handleOpenChange}>
        <SelectTrigger className="h-14 border rounded-lg text-neutral-400 pl-4 py-2 flex items-center">
          <div className="text-sm lg:text-base text-black">
            {formik?.values[fieldName] || lang?.select || 'Select'}
          </div>
        </SelectTrigger>
        <SelectContent className="h-56 overflow-auto">
          {/* <SelectItem value="Select">{lang?.select || 'Select'}</SelectItem> */}
          {states.map(item => (
            <SelectItem key={item.isoCode} value={item.name}>
              {item.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {!isDisabled &&
        formik?.touched[fieldName] &&
        formik?.errors[fieldName] && (
          <p className="error text-start text-danger mt-1">
            {formik.errors[fieldName]}
          </p>
        )}
    </>
  );
};

export const CitySelectField = ({
  formik,
  fieldName,
  stateFieldName,
  countrycode,
  isReadOnly,
  lang,
  currentlyOpenSelect,
  setCurrentlyOpenSelect,
}) => {
  const [cities, setCities] = useState([]);
  const [isDisabled, setIsDisabled] = useState(true);

  const getStateCodeByName = () => {
    const states = State.getStatesOfCountry(formik?.values[countrycode] || '');
    const state = states.find(
      s =>
        s.name.toLowerCase() === formik?.values[stateFieldName]?.toLowerCase(),
    );
    return state ? state.isoCode : null;
  };

  useEffect(() => {
    const stateValue = formik?.values[stateFieldName];
    const isStateEmpty = !stateValue || stateValue === 'Select';
    setIsDisabled(isReadOnly || isStateEmpty);

    if (!isStateEmpty) {
      const citiesList = City.getCitiesOfState(
        formik?.values[countrycode] || '',
        getStateCodeByName() || '',
      );
      setCities(citiesList);

      if (
        citiesList.length > 0 &&
        (!formik?.values[fieldName] || formik?.values[fieldName] === 'Select')
      ) {
        formik?.setFieldValue(fieldName, citiesList[0].name);
      }
    } else {
      setCities([]);
      formik?.setFieldValue(fieldName, 'Select');
    }
  }, [formik?.values[stateFieldName], formik?.values[countrycode], isReadOnly]);

  const handleCityChange = value => {
    formik?.setFieldValue(fieldName, value);
  };

  const handleOpenChange = isOpen => {
    setCurrentlyOpenSelect(isOpen ? 'city' : null);
  };

  return (
    <>
      <Select
        onValueChange={handleCityChange}
        value={formik?.values[fieldName]}
        disabled={isDisabled}
        open={currentlyOpenSelect === 'city'}
        onOpenChange={handleOpenChange}>
        <SelectTrigger className="h-14 border rounded-lg text-neutral-400 pl-4 py-2 flex items-center">
          <div className="text-sm lg:text-base text-black">
            {formik?.values[fieldName] || lang?.select || 'Select'}
          </div>
        </SelectTrigger>
        <SelectContent className="h-56 overflow-auto">
          {/* <SelectItem value="Select">{lang?.select || 'Select'}</SelectItem> */}
          {cities.map(item => (
            <SelectItem key={item.name} value={item.name}>
              {item.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {!isDisabled &&
        formik?.touched[fieldName] &&
        formik?.errors[fieldName] && (
          <p className="error text-start text-danger mt-1">
            {formik.errors[fieldName]}
          </p>
        )}
    </>
  );
};
