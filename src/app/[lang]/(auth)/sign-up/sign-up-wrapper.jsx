'use client';
import React, {useState, useEffect} from 'react';
import Link from 'next/link';
import ReCAPTCHA from 'react-google-recaptcha';
import {useSelector, useDispatch} from 'react-redux';
import {clearMessage} from '@/lib/slices/customerAuthSlice';
import {useRouter} from 'next-nprogress-bar';
import {RECAPTCHA_SECRET_KEY, RECAPTCHA_SITE_KEY} from '@/lib/apis/keywords';
// import {parsePhoneNumberFromString} from 'libphonenumber-js';
import * as yup from 'yup';
import {useFormik} from 'formik';
import TextareaAutosize from 'react-textarea-autosize';
import {customerRegister} from '@/lib/slices/customerAuthSlice';
import {CountrySelectField} from '@/components/country-state-city-select-field';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import img from '@/asset/signupbg.png';
import {cn, get} from '@/lib/utils';
import {Spinner} from '@/asset/icons/spinner';
import {Label, Input, Button} from '@/components';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import Image from 'next/image';
import {useToast} from '@/hooks/use-toast';

import {setCountries} from '../../../../lib/slices/currencySlice';
import LangSelector from '@/components/lang-selector';
import {Textarea} from '@/components/ui/textarea';
import {Eye, EyeOff} from '../../../../../public/icons';

const SignupWrapper = ({lang}) => {
  const router = useRouter();
  const BASE_URL = process.env.PAPERCUT_API_BASE_URL;

  const dispatch = useDispatch();
  const {isLoading, message, isError} = useSelector(
    state => state.customerData,
  );
  const {currentData, setCurrentData} = useState();
  const {countryList} = useSelector(state => state.currencyData);
  const [currentlyOpenSelect, setCurrentlyOpenSelect] = useState(null);

  const {toast} = useToast();

  useEffect(() => {
    dispatch(clearMessage());
  }, [dispatch]);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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
      firstname: '',
      lastname: '',
      email: '',
      password: '',
      confirmPassword: '',
      captcha: '',
      dob: {
        year: '',
        month: '',
        day: '',
      },
      address: '',
      country: 'QA',
      phone: '',
      state: '',
      stateCode: '',
      city: '',
      postcode: '',
    },

    validationSchema: yup.object({
      firstname: yup.string().required(lang.first_name_is_required),
      lastname: yup.string().required(lang.last_name_is_required),
      phone: yup.number().required(lang.phone_number_is_required),
      address: yup.string().required(lang.address_is_required),
      country: yup.string().required(lang.country_is_required),
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
        .email(lang.email_is_invalid)
        .required(lang.email_is_required),

      password: yup
        .string()
        .min(8, 'Password must be at least 8 characters')
        .matches(/[a-z]/, 'Password must contain at least one lowercase letter')
        .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
        .matches(/[0-9]/, 'Password must contain at least one digit')
        .matches(
          /[!@#$%^&*(),.?":{}|<>]/,
          'Password must contain at least one special character',
        )
        .required(lang.password_is_required),
      confirmPassword: yup
        .string()
        .oneOf([yup.ref('password'), null], 'Passwords do not match')
        .required(lang.confirm_password_is_required),
      captcha: yup.string().required(lang.captcha_is_invalid),
    }),
    onSubmit: async values => {
      const data = {
        customer: {
          email: values.email,
          firstname: values.firstname,
          lastname: values.lastname,
          dob: `${values.dob.year}-${values.dob.month}-${values.dob.day}`,
          addresses: [
            {
              defaultShipping: true,
              defaultBilling: true,
              firstname: values.firstname,
              lastname: values.lastname,
              postcode: values.postcode,
              street: [values.address == '' ? 'null' : values.address],
              city: values.city == '' ? 'null' : values.city,
              telephone: values.phone,
              countryId: values.country,
              postcode: values.postcode,
              // region: {
              //   region: values.state == '' ? 'null' : values.state,
              //   regionCode: values.state == '' ? 'null' : values.state,
              //   regionId: 0,
              // },
            },
          ],
        },
        password: values.password,
      };

      try {
        const response = await dispatch(customerRegister(data)).unwrap();

        if (response) {
          formik.resetForm();
          toast({
            variant: 'success',
            title: lang.registration_successful,
          });

          router.push(`/${lang.lang}/sign-in`);
        }
      } catch (error) {
        toast({
          variant: 'destructive',
          title: error || lang.something_went_wrong,
        });
      }
    },
  });

  const generateOptions = (start, end) => {
    const options = [];
    for (let i = start; i <= end; i++) {
      options.push(i);
    }
    return options;
  };

  const handlePhoneChange = value => {
    formik.setFieldValue('phone', value);

    if (value && value.length > 3) {
      const phoneNumber = parsePhoneNumberFromString(value);
      if (phoneNumber && phoneNumber.isValid())
        formik.setFieldValue('country', phoneNumber.country);
    } else {
      formik.setFieldValue('phone', '');
    }
  };

  const getCountries = async () => {
    try {
      const response = await get(`${BASE_URL}directory/countries`);
      if (response) {
        dispatch(setCountries(response));
      }
      return response;
    } catch (error) {
      console.error('Error fetching countries:', error);
    }
  };

  useEffect(() => {
    getCountries();
  }, []);

  return (
    <div className="flex md:flex-row flex-col justify-center gap-7 md:gap-0 items-center h-dvh w-full overflow-hidden">
      <div className="hidden md:block relative w-2/5 h-full">
        <Image
          src={img}
          alt="logo"
          fill
          className="absolute inset-0 w-full h-full object-cover"
        />
      </div>

      <div className="h-fit max-h-full overflow-y-auto md:w-3/5 px-7 md:px-5 lg:px-10 w-full pt-24 pb-10">
        <div
          className={cn(
            'absolute top-5 p-2 rounded-md bg-secondary z-50',
            lang.lang === 'ar' ? 'left-5' : 'right-5',
          )}>
          <LangSelector lang={lang} />
        </div>
        <form onSubmit={formik.handleSubmit} className="relative">
          <h2 className="md:text-4xl text-3xl font-semibold mb-8">
            {lang.create_new_customer_account}
          </h2>
          <div className="flex xl:flex-row flex-col gap-14 lg:gap-5 xl:gap-8 2xl:gap-10 justify-between max-w-6xl">
            <div className="xl:w-1/2 w-full xl:max-w-[490px]">
              <h6 className="mb-8 text-xl">{lang.personal_information}</h6>

              <div className="flex gap-5 w-full">
                <div className="mb-6 text-sm md:text-base w-full space-y-2">
                  <Label className="mb-2">
                    {lang.first_name} <sup className="text-red-500">*</sup>
                  </Label>
                  <Input
                    type="text"
                    name="firstname"
                    placeholder="First Name"
                    value={formik.values.firstname}
                    onChange={formik.handleChange}
                  />
                  {formik.touched.firstname && formik.errors.firstname ? (
                    <p className="text-red-500 text-sm mt-1">
                      {formik.errors.firstname}
                    </p>
                  ) : null}
                </div>
                <div className="mb-6 text-sm md:text-base w-full space-y-2">
                  <Label className="mb-2">
                    {lang.last_name} <sup className="text-red-500">*</sup>
                  </Label>
                  <Input
                    type="text"
                    name="lastname"
                    placeholder="Last Name"
                    value={formik.values.lastname}
                    onChange={formik.handleChange}
                  />
                  {formik.touched.lastname && formik.errors.lastname ? (
                    <p className="text-red-500 text-sm mt-1">
                      {formik.errors.lastname}
                    </p>
                  ) : null}
                </div>
              </div>

              <div className="mb-6 space-y-2">
                <Label className="mb-2">
                  {lang.date_of_birth} <sup className="text-red-500">*</sup>
                </Label>

                <div className="flex gap-3">
                  {/* Day Selector */}
                  <Select
                    onValueChange={value =>
                      formik.setFieldValue('dob.day', value)
                    }
                    value={formik.values.dob.day || ''}>
                    <SelectTrigger className="border w-full rounded-lg pl-4 py-2 items-center flex gap-2">
                      <div
                        className={`text-sm lg:text-base text-left grow ${
                          formik.values.dob.day
                            ? 'text-black'
                            : 'text-neutral-400'
                        }`}>
                        {formik.values.dob.day || 'DD'}
                      </div>
                    </SelectTrigger>
                    <SelectContent className="h-56 overflow-auto">
                      {generateOptions(1, 31).map(item => (
                        <SelectItem key={item} value={String(item)}>
                          {item}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  {/* Month Selector */}
                  <Select
                    onValueChange={value =>
                      formik.setFieldValue('dob.month', value)
                    }
                    value={formik.values.dob.month || ''}>
                    <SelectTrigger className="border rounded-lg w-full pl-4 py-2 items-center flex gap-2">
                      <div
                        className={`text-sm lg:text-base text-left grow ${
                          formik.values.dob.month
                            ? 'text-black'
                            : 'text-neutral-400'
                        }`}>
                        {formik.values.dob.month || 'MM'}
                      </div>
                    </SelectTrigger>
                    <SelectContent className="h-56 overflow-auto">
                      {generateOptions(1, 12).map(item => (
                        <SelectItem key={item} value={String(item)}>
                          {item}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  {/* Year Selector */}
                  <Select
                    onValueChange={value =>
                      formik.setFieldValue('dob.year', value)
                    }
                    value={formik.values.dob.year || ''}>
                    <SelectTrigger className="border rounded-lg w-full pl-4 py-2 items-center flex gap-2">
                      <div
                        className={`text-sm lg:text-base text-left grow ${
                          formik.values.dob.year
                            ? 'text-black'
                            : 'text-neutral-400'
                        }`}>
                        {formik.values.dob.year || 'YYYY'}
                      </div>
                    </SelectTrigger>
                    <SelectContent className="h-56 overflow-auto">
                      {generateOptions(1970, new Date().getFullYear()).map(
                        item => (
                          <SelectItem key={item} value={String(item)}>
                            {item}
                          </SelectItem>
                        ),
                      )}
                    </SelectContent>
                  </Select>
                </div>

                {formik.touched.dob && formik.errors.dob ? (
                  <p className="text-red-500 text-sm mt-1">
                    {lang.date_is_required}
                  </p>
                ) : null}
              </div>

              <div className="mb-6 space-y-2">
                <Label>
                  {lang.phone_number} <sup className="text-red-500">*</sup>
                </Label>

                <PhoneInput
                  country="qa"
                  value={formik.values.phone}
                  onChange={handlePhoneChange}
                  inputStyle={{
                    height: '40px',
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

                {formik.touched.phone && formik.errors.phone ? (
                  <p className="text-red-500 text-sm mt-1">
                    {formik.errors.phone}
                  </p>
                ) : null}
              </div>

              <div className="mb-6 space-y-2">
                <Label>
                  {lang.address} <sup className="text-red-500">*</sup>
                </Label>
                <Textarea
                  type="address"
                  name="address"
                  // placeholder="Select Address"
                  className=" border rounded-lg w-full px-3 py-2"
                  value={formik.values.address}
                  onChange={formik.handleChange}
                />
                {formik.touched.address && formik.errors.address ? (
                  <p className="text-red-500 text-sm mt-1">
                    {formik.errors.address}
                  </p>
                ) : null}
              </div>

              <div className="mb-6 space-y-2">
                <Label>
                  {lang.country}
                  <sup className="text-red-500">*</sup>
                </Label>
                <CountrySelectField
                  lang={lang}
                  formik={formik}
                  stateFieldName={'state'}
                  fieldName={'country'}
                  currentlyOpenSelect={currentlyOpenSelect}
                  setCurrentlyOpenSelect={setCurrentlyOpenSelect}
                  LabelName={lang.country}
                  countrycode={'country'}
                  countryList={countryList}
                  isReadOnly={false}
                />
              </div>
              <div className="space-y-2">
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
                      !['Backspace', 'ArrowLeft', 'ArrowRight', 'Tab'].includes(
                        e.key,
                      )
                    ) {
                      e.preventDefault();
                    }
                  }}
                  className={`h-14`}
                />
                {formik.touched.postcode && formik.errors.postcode && (
                  <p className="text-red-500 text-sm mt-1">
                    {formik.errors.postcode}
                  </p>
                )}
              </div>
            </div>

            <div className="xl:w-1/2 w-full xl:max-w-[490px]">
              <h6 className="mb-8 text-xl">{lang.sign_in_information}</h6>

              <div className="mb-6 text-sm md:text-base space-y-2">
                <Label>
                  {lang.email} <sup className="text-red-500">*</sup>
                </Label>
                <Input
                  type="email"
                  name="email"
                  placeholder="Email"
                  onChange={formik.handleChange}
                  value={formik.values.email}
                />
                {formik.touched.email && formik.errors.email ? (
                  <p className="text-red-500 text-sm mt-1">
                    {formik.errors.email}
                  </p>
                ) : null}
              </div>

              <div className="mb-6 text-sm md:text-base space-y-2">
                <Label>
                  {lang.password} <sup className="text-red-500">*</sup>
                </Label>
                <div className="relative">
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="********"
                    name="password"
                    onChange={formik.handleChange}
                    value={formik.values.password}
                    className="pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 flex items-center pr-3">
                    {showPassword ? (
                      <EyeOff
                        className={`${
                          formik.values.password ? 'visible' : 'invisible'
                        }`}
                      />
                    ) : (
                      <Eye
                        className={`${
                          formik.values.password ? 'visible' : 'invisible'
                        }`}
                      />
                    )}
                  </button>
                </div>
                {formik.touched.password && formik.errors.password && (
                  <p className="text-red-500 text-sm mt-1">
                    {formik.errors.password}
                  </p>
                )}
              </div>

              {/* Confirm Password Field */}
              <div className="mb-6 text-sm md:text-base space-y-2">
                <Label>
                  {lang.confirm_password}
                  <sup className="text-red-500">*</sup>
                </Label>
                <div className="relative">
                  <Input
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="********"
                    name="confirmPassword"
                    onChange={formik.handleChange}
                    value={formik.values.confirmPassword}
                    className="pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 flex items-center pr-3">
                    {showConfirmPassword ? (
                      <EyeOff
                        className={`${
                          formik.values.confirmPassword
                            ? 'visible'
                            : 'invisible'
                        }`}
                      />
                    ) : (
                      <Eye
                        className={`${
                          formik.values.confirmPassword
                            ? 'visible'
                            : 'invisible'
                        }`}
                      />
                    )}
                  </button>
                </div>
                {formik.touched.confirmPassword &&
                  formik.errors.confirmPassword && (
                    <p className="text-red-500 text-sm mt-1">
                      {formik.errors.confirmPassword}
                    </p>
                  )}
              </div>

              <div className="recaptcha-container mb-8">
                <ReCAPTCHA
                  name={'captcha'}
                  id={'captcha'}
                  sitekey={RECAPTCHA_SITE_KEY}
                  onChange={val => {
                    formik.setFieldValue('captcha', val);
                  }}
                />
                {formik.touched.captcha && formik.errors.captcha ? (
                  <p className="text-red-500 text-sm mt-1">
                    {formik.errors.captcha}
                  </p>
                ) : null}
              </div>

              <Button
                type="submit"
                className="mb-3 w-full bg-black py-5 hover:bg-primary"
                disabled={isLoading}>
                <span className="font-semibold text-lg">
                  {isLoading ? <Spinner /> : lang.create_an_account}
                </span>
              </Button>

              <p className="text-center font-medium text-sm md:text-base">
                {lang.already_have_an_account}{' '}
                <Link href={`/${lang.lang}/sign-in`}>
                  <span className="font-bold">{lang.sign_in}</span>
                </Link>
              </p>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignupWrapper;
