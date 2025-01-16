'use client';
import React, {useEffect, useState} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import * as yup from 'yup';
import Image from 'next/image';
import {useFormik} from 'formik';

import {
  CitySelectField,
  CountrySelectField,
  StateSelectField,
} from '@/components/country-state-city-select-field/index';
import PreFooter from '@/components/PreFooter/preFooter';
import TextareaAutosize from 'react-textarea-autosize';

import {
  clearMessage,
  customerProfilePhotoUpdate,
  customerProfileUpdate,
} from '@/lib/slices/customerAuthSlice';
import {PROFILE} from '@/lib/apis/keywords';
import {useRouter} from 'next-nprogress-bar';
import noUserImg from './../../../../../public/images/no-user.jpg';

import {
  Label,
  Button,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from '@/components';
import {Spinner} from '../../../../asset/icons/spinner';
import Cookies from 'js-cookie';
import {useToast} from '@/hooks/use-toast';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import {Textarea} from '@/components/ui/textarea';

const ProfileWrapper = ({lang}) => {
  const {customer, isLoading, message, isError, isLoggedIn} = useSelector(
    state => state.customerData,
  );

  const {countryList} = useSelector(state => state.currencyData);
  const dispatch = useDispatch();
  const router = useRouter();
  const [profileImage, setProfileImage] = useState(null);
  const [isMounted, setIsMounted] = useState(false);
  const [isReadOnly, setIsReadOnly] = useState(true);
  const [currentlyOpenSelect, setCurrentlyOpenSelect] = useState(null);

  const {toast} = useToast();

  useEffect(() => {
    if (!isLoggedIn) {
      router.push(`/${lang.lang}/`);
    }
  }, [isLoggedIn]);

  const returnFunc = num => {
    if (num?.split('')[0] == 0) {
      return num.split('')[1];
    } else {
      return num;
    }
  };

  const onSelectImg = event => {
    const file = event.target.files[0];

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result);

        dispatch(
          customerProfilePhotoUpdate({
            customer_id: customer?.customer_id,
            photo_data: reader.result,
          }),
        );
      };
      reader.readAsDataURL(file);
    }
  };

  const isValidDate = (day, month, year) => {
    const today = new Date();
    const date = new Date(year, month - 1, day);
    const isValid =
      date.getFullYear() === year &&
      date.getMonth() === month - 1 &&
      date.getDate() === day;
    const isNotFuture = date <= today;
    return isValid && isNotFuture;
  };

  const formik = useFormik({
    initialValues: {
      firstname: customer?.firstname || '',
      lastname: customer?.lastname || '',
      email: customer?.email || '',
      dob: {
        year: customer?.dob?.substring(0, 4) || '',
        month: returnFunc(customer?.dob?.split('-')[1]) || '',
        day: returnFunc(customer?.dob?.split('-')[2]) || '',
      },
      phone: customer?.addresses?.default_billing?.telephone || '',
      address: customer?.addresses?.default_billing?.street[0] || '',
      country: customer?.addresses?.default_billing?.country_id || '',
      state: customer?.addresses?.default_billing?.region?.region || '',
      stateCode: customer?.addresses?.default_billing?.region?.region || '',
      city: customer?.addresses?.default_billing?.city || '',
      postcode: customer?.addresses?.default_billing?.postcode || '',
      addressID: customer?.addresses?.default_billing?.id || null,
      is_default_shipping:
        !!customer?.addresses?.default_billing?.defaultBilling,
      is_default_billing:
        !!customer?.addresses?.default_billing?.defaultShipping,
    },
    enableReinitialize: true,
    validationSchema: yup.object({
      firstname: yup.string().required(lang.first_name_is_required),
      lastname: yup.string().required(lang.last_name_is_required),
      phone: yup.number().required(lang.phone_number_is_required),
      address: yup.string().required(lang.address_is_required),
      // country: yup.string().required(lang.country_is_required),
      country: yup
        .string()
        .notOneOf(['Select'], lang.country_is_required)
        .required(lang.country_is_required),
      state: yup
        .string()
        .notOneOf(['Select'], lang.state_is_required)
        .required(lang.state_is_required),
      city: yup
        .string()
        .notOneOf(['Select'], lang.city_is_required)
        .required(lang.city_is_required),
      postcode: yup.string().required(lang.zip_code_is_required),
      dob: yup
        .object({
          day: yup.number().required('Day is required'),
          month: yup.number().required('Month is required'),
          year: yup.number().required('Year is required'),
        })
        .test('is-valid-date', 'Invalid date of birth', function (value) {
          const {day, month, year} = value;
          if (!day || !month || !year) return false;
          return isValidDate(day, month, year);
        }),
      email: yup
        .string()
        .email(lang.invalid_email_address)
        .required(lang.email_is_required),
    }),
    onSubmit: async values => {
      const updatedCustomerData = {
        customer: {
          id: customer?.customer_id,
          email: customer?.email,
          firstname: values.firstname,
          lastname: values.lastname,
          dob: `${values.dob.year}-${values.dob.month}-${values.dob.day}`,
          website_id: 1,
          addresses: [
            {
              id: customer?.addresses?.default_billing?.id,
              region: {
                region_code: values.state,
                region: values.state,
                region_id: 0,
              },
              country_id: values.country,
              street: [values.address],
              firstname: values.firstname,
              lastname: values.lastname,
              default_shipping: values.is_default_shipping,
              default_billing: true,
              telephone: values.phone,
              postcode: values.postcode,
              city: values.city,
              customer_id: customer?.customer_id,
            },
          ],
        },
      };

      try {
        const response = await dispatch(
          customerProfileUpdate(updatedCustomerData),
        ).unwrap();
        if (response.success) {
          // localStorage.setItem(PROFILE, JSON.stringify(response.customer));
          Cookies.set(PROFILE, JSON.stringify(response.customer));
          setIsReadOnly(true);
          toast({
            variant: 'success',
            title: lang.profile_update_successfully,
          });
        } else {
          if (response.status) {
            toast({
              variant: 'success',
              title: response.msg,
            });
          } else {
            toast({
              variant: 'destructive',
              title: response.msg,
            });
          }
          setIsReadOnly(false);
        }
      } catch (error) {
        console.error('Profile update failed:', error);
      }
    },
  });

  const handlePhoneChange = value => {
    formik.setFieldValue('phone', value);

    // if (value && value.length > 3) {
    //
    //   const phoneNumber = value;
    //   if (phoneNumber)
    //     // Set the country in Formik state
    //     formik.setFieldValue('country', phoneNumber.country);
    // } else {
    //   // Clear phone fields if input is too short
    //   formik.setFieldValue('phone', '');
    // }
  };

  const generateOptions = (start, end, prefix = '') => {
    const options = [];
    for (let i = start; i <= end; i++) {
      options.push(i);
    }
    return options;
  };

  useEffect(() => {
    dispatch(clearMessage());
    setIsMounted(true);
  }, [dispatch]);

  if (!isMounted) return null;

  return (
    <>
      <section className="bg-primary-gradient">
        <div className="container customContainer">
          <div className="profileInn contactForm py-10">
            <div className="pb-5">
              <h2 className="text-center pb-2 text-4xl font-semibold">
                {lang.profile_management}
              </h2>
              <h5 className="text-center text-xl font-normal">
                {lang.details_as_registered}
              </h5>
            </div>

            <form onSubmit={formik.handleSubmit}>
              <div className="flex flex-col space-y-6">
                <div className="flex flex-col items-start mb-3">
                  <Label
                    htmlFor="uploadprofile"
                    className={`profileimagewrap ${
                      !isReadOnly && 'cursor-pointer'
                    } flex flex-col items-center`}>
                    <div className="w-32 h-32 p-3 border-black rounded-lg border-2 ">
                      <Image
                        src={
                          profileImage || customer?.profile_photo || noUserImg
                        }
                        width={500}
                        height={500}
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    {!isReadOnly && (
                      <div className="mt-2 bg-black hover:bg-primary transition-all duration-100 text-white w-full text-center rounded-sm py-2">
                        {lang.upload_image}
                      </div>
                    )}
                  </Label>
                  <Input
                    id="uploadprofile"
                    type="file"
                    name="profileimage"
                    onChange={onSelectImg}
                    disabled={isReadOnly}
                    className="hidden"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstname" className="block mb-1">
                      {lang.first_name} <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      type="text"
                      name="firstname"
                      placeholder="First Name"
                      value={formik.values.firstname}
                      onChange={formik.handleChange}
                      disabled={isReadOnly}
                      className={`${isReadOnly && 'cursor-not-allowed'} h-14`}
                    />
                    {formik.touched.firstname && formik.errors.firstname && (
                      <p className="text-red-500 text-sm mt-1">
                        {formik.errors.firstname}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="lastname" className="block mb-1">
                      {lang.last_name} <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      type="text"
                      name="lastname"
                      placeholder="Last Name"
                      value={formik.values.lastname}
                      onChange={formik.handleChange}
                      disabled={isReadOnly}
                      className={`Input ${
                        isReadOnly && 'cursor-not-allowed'
                      } h-14`}
                    />
                    {formik.touched.lastname && formik.errors.lastname && (
                      <p className="text-red-500 text-sm mt-1">
                        {formik.errors.lastname}
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="email" className="block mb-1">
                      {lang.email} <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      type="text"
                      name="email"
                      placeholder="Email"
                      value={formik.values.email}
                      readOnly
                      disabled
                      className="cursor-not-allowed h-14"
                    />
                    {formik.touched.email && formik.errors.email && (
                      <p className="text-red-500 text-sm mt-1">
                        {formik.errors.email}
                      </p>
                    )}
                  </div>
                  <div className=" mb-6 flex flex-col items-start phone-input-style">
                    <Label className="block mb-1">
                      {lang.phone_number}
                      <sup className="text-red-500">*</sup>
                    </Label>

                    {/* <PhoneInput
                      name="phone"
                      international
                      defaultCountry="QA"
                      value={formik.values.phone}
                      onChange={formik.handleChange}
                      disabled={isReadOnly}
                      className={`${
                        isReadOnly && 'cursor-not-allowed opacity-50'
                      } disabled:input-disabled border h-14 rounded-lg w-full bg-white pl-4  py-2 items-center flex gap-2`}
                    /> */}

                    <PhoneInput
                      country={formik.values.country || 'qa'}
                      disabled={isReadOnly}
                      value={formik.values.phone}
                      onChange={handlePhoneChange}
                      className={`${
                        isReadOnly && 'cursor-not-allowed opacity-50'
                      } `}
                      inputStyle={{
                        height: '56px',
                        width: '100%',
                        borderRadius: '8px',
                        border: '1px solid #d1d5db',
                        paddingLeft: '48px',
                      }}
                      containerStyle={{
                        width: '100%',
                      }}
                      dropdownStyle={{
                        maxHeight: '250px',
                        overflowY: 'auto',
                      }}
                      searchPlaceholder="Search countries"
                      enableSearch
                    />

                    {formik.touched.phone && formik.errors.phone && (
                      <p className="text-red-500 text-sm mt-1">
                        {formik.errors.phone}
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                  {/* Day Select */}
                  <div>
                    <Label htmlFor="dobDay" className="block mb-1">
                      {lang.date_of_birth}
                    </Label>
                    <Select
                      id="dobDay"
                      onValueChange={value =>
                        formik.setFieldValue('dob.day', value)
                      }
                      value={formik.values.dob.day || ''}>
                      <SelectTrigger
                        disabled={isReadOnly}
                        className="h-14 border w-full rounded-lg  pl-4 py-2 items-center flex gap-2"
                        aria-label="Select Day">
                        <div className="text-sm lg:text-base text-left grow">
                          {formik.values.dob.day || 'DD'}
                        </div>
                      </SelectTrigger>
                      <SelectContent className="h-56 overflow-auto">
                        {generateOptions(1, 31, 'day').map(item => (
                          <SelectItem key={item} value={String(item)}>
                            {item}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Month Select */}
                  <div>
                    <Select
                      id="dobMonth"
                      onValueChange={value =>
                        formik.setFieldValue('dob.month', value)
                      }
                      value={formik.values.dob.month || ''}>
                      <SelectTrigger
                        disabled={isReadOnly}
                        className="h-14 border rounded-lg  w-full pl-4 py-2 items-center flex gap-2"
                        aria-label="Select Month">
                        <div className="text-sm lg:text-base text-left grow">
                          {formik.values.dob.month || 'MM'}
                        </div>
                      </SelectTrigger>
                      <SelectContent className="h-56 overflow-auto">
                        {generateOptions(1, 12, 'month').map(item => (
                          <SelectItem key={item} value={String(item)}>
                            {item}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Year Select */}
                  <div>
                    <Select
                      disabled={isReadOnly}
                      id="dobYear"
                      onValueChange={value =>
                        formik.setFieldValue('dob.year', value)
                      }
                      value={formik.values.dob.year || ''}>
                      <SelectTrigger
                        className="h-14 border rounded-lg w-full  pl-4 py-2 items-center flex gap-2"
                        aria-label="Select Year">
                        <div className="text-sm lg:text-base text-left grow">
                          {formik.values.dob.year || 'YYYY'}
                        </div>
                      </SelectTrigger>
                      <SelectContent className="h-56 overflow-auto">
                        {generateOptions(
                          1900,
                          new Date().getFullYear(),
                          'year',
                        ).map(item => (
                          <SelectItem key={item} value={String(item)}>
                            {item}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="address" className="block mb-1">
                    {lang.address} <span className="text-red-500">*</span>
                  </Label>
                  <Textarea
                    name="address"
                    value={formik.values.address}
                    onChange={formik.handleChange}
                    disabled={isReadOnly}
                    className={` ${
                      isReadOnly && 'cursor-not-allowed opacity-50'
                    } rounded-lg pl-4 py-2 bg-white w-full border`}
                  />
                  {formik.touched.address && formik.errors.address && (
                    <p className="text-red-500 text-sm mt-1">
                      {formik.errors.address}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="mb-1">
                      {lang.country}
                      <sup className="text-red-500">*</sup>
                    </Label>
                    <CountrySelectField
                      formik={formik}
                      stateFieldName="state"
                      fieldName="country"
                      LabelName={lang.country}
                      countryList={countryList}
                      isReadOnly={isReadOnly}
                      currentlyOpenSelect={currentlyOpenSelect}
                      setCurrentlyOpenSelect={setCurrentlyOpenSelect}
                    />
                  </div>
                  <div>
                    <Label className="mb-1">
                      {lang.state}
                      <sup className="text-red-500">*</sup>
                    </Label>
                    <StateSelectField
                      formik={formik}
                      cityFieldName={'city'}
                      fieldName={'state'}
                      countrycode={'country'}
                      LabelName={lang.state}
                      lang={lang}
                      isReadOnly={isReadOnly}
                      currentlyOpenSelect={currentlyOpenSelect}
                      setCurrentlyOpenSelect={setCurrentlyOpenSelect}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="mb-1">
                      {lang.city}
                      <sup className="text-red-500">*</sup>
                    </Label>
                    <CitySelectField
                      formik={formik}
                      stateFieldName={'state'}
                      fieldName={'city'}
                      countrycode={'country'}
                      stateCode={'stateCode'}
                      LabelName={lang.city}
                      isReadOnly={isReadOnly}
                      lang={lang}
                      currentlyOpenSelect={currentlyOpenSelect}
                      setCurrentlyOpenSelect={setCurrentlyOpenSelect}
                    />
                  </div>
                  <div>
                    <Label htmlFor="postcode" className="block">
                      {lang.zip} <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      type="text"
                      name="postcode"
                      placeholder="Zip"
                      value={formik.values.postcode}
                      onChange={formik.handleChange}
                      onKeyDown={e => {
                        if (
                          !/[0-9]/.test(e.key) &&
                          ![
                            'Backspace',
                            'ArrowLeft',
                            'ArrowRight',
                            'Tab',
                          ].includes(e.key)
                        ) {
                          e.preventDefault();
                        }
                      }}
                      disabled={isReadOnly}
                      className={` ${isReadOnly && 'cursor-not-allowed'} h-14`}
                    />
                    {formik.touched.postcode && formik.errors.postcode && (
                      <p className="text-red-500 text-sm mt-1">
                        {formik.errors.postcode}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex w-full space-x-2 justify-end">
                  <input
                    type="checkbox"
                    name="is_default_shipping"
                    checked={formik.values.is_default_shipping}
                    onChange={formik.handleChange}
                    disabled={isReadOnly}
                    className="form-check-Input"
                  />
                  <Label htmlFor="is_default_shipping">
                    {lang.add_as_default_shipping_address}
                  </Label>
                </div>

                <div className="flex gap-4 justify-center">
                  <Button
                    type="submit"
                    disabled={isReadOnly}
                    className={`commonButton hover:bg-secondary ${
                      isLoading && 'cursor-not-allowed'
                    }`}>
                    {isLoading ? (
                      <Spinner animation="border" size="sm" />
                    ) : (
                      lang.save
                    )}
                  </Button>
                  <Button
                    variant="outline"
                    type="button"
                    className="bg-transparent"
                    disabled={!isReadOnly}
                    onClick={() => setIsReadOnly(false)}>
                    {lang.edit_update}
                  </Button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </section>
      <PreFooter lang={lang} />
    </>
  );
};

export default ProfileWrapper;
