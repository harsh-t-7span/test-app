'use client';

import {Spinner} from '@/asset/icons/spinner';
import img from '@/asset/loginImg1.png';
import {Button, Input} from '@/components';
import LangSelector from '@/components/lang-selector';
import {cn} from '@/lib/utils';
import {useFormik} from 'formik';
import {useDispatch, useSelector} from 'react-redux';
import * as yup from 'yup';
import Image from 'next/image';
import {useRouter} from 'next-nprogress-bar';

const ResetPasswordWrapper = ({lang}) => {
  const {isLoggedIn} = useSelector(state => state.customerData);
  const router = useRouter();

  const dispatch = useDispatch();
  const {message, isError, isLoading, customer} = useSelector(
    state => state.customerData,
  );

  const validationSchema = yup.object().shape({
    password: yup
      .string()
      .min(8, lang.password_must_be_at_least_8_characters)
      .matches(/[a-z]/, lang.password_must_contain_lowercase_letter)
      .matches(/[A-Z]/, lang.password_must_contain_uppercase_letter)
      .matches(/[0-9]/, lang.password_must_contain_digit)
      .matches(
        /[!@#$%^&*(),.?":{}|<>]/,
        lang.password_must_contain_special_character,
      )
      .required(lang.new_password_is_required),
    confirmPassword: yup
      .string()
      .oneOf([yup.ref('password'), null], lang.passwords_must_match)
      .required(lang.confirm_password_is_required),
  });

  const formik = useFormik({
    initialValues: {
      password: '',
      confirmPassword: '',
    },
    validationSchema,
    onSubmit: async values => {
      // Replace with your dispatch logic
      dispatch(
        resetForgotPassword(
          token,
          values.password,
          values.confirmPassword,
          // setShowSuccessModal,
        ),
      );
    },
  });

  return (
    <div className="flex md:flex-row flex-col gap-7 md:gap-0 items-center h-dvh w-full">
      <div className="hidden sm:block relative w-2/5 h-full">
        <Image
          src={img.src}
          alt="logo"
          width={500}
          height={500}
          className="absolute inset-0 w-full h-full object-cover"
        />
      </div>
      <div className="flex h-full justify-center items-center p-5 sm:w-3/5 w-full">
        <div
          className={cn(
            'absolute top-5 p-2 rounded-md bg-secondary z-50',
            lang.lang === 'ar' ? 'left-5' : 'right-5',
          )}>
          <LangSelector lang={lang} />
        </div>
        <div className="w-full max-w-md">
          <form onSubmit={formik.handleSubmit}>
            <h2 className="md:text-5xl text-3xl font-semibold text-center mb-6">
              {lang.reset_password}
            </h2>
            <h6 className="text-center mb-6 text-gray-500">
              {lang.if_you_have_an_account_sign_in_with_your_email_address}
            </h6>

            <div className="mb-4 md:mb-6 space-y-2">
              <label>
                {lang.password} <sup className="error">*</sup>
              </label>
              <Input
                type="password"
                className="form-control"
                name="password"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.password}
              />
              {formik.touched.password && formik.errors.password ? (
                <p className="error">{formik.errors.password}</p>
              ) : null}
            </div>

            <div className="mb-4 md:mb-6 space-y-2">
              <label>
                {lang.confirm_password} <sup className="error">*</sup>
              </label>
              <Input
                type="password"
                className="form-control"
                name="confirmPassword"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.confirmPassword}
              />
              {formik.touched.confirmPassword &&
              formik.errors.confirmPassword ? (
                <p className="error">{formik.errors.confirmPassword}</p>
              ) : null}
            </div>

            <div className="flex flex-col mt-8">
              <Button
                variant="secondary"
                type="submit"
                className="commonButton fwidth mb-3"
                disabled={isLoading}>
                {isLoading ? (
                  <Spinner animation="border" size="sm" />
                ) : (
                  lang.reset_password
                )}
              </Button>
              <Button
                variant="outline"
                type="button"
                className="mb-3"
                onClick={() => {
                  router.push(`/${lang.lang}/`);
                }}>
                {lang.back_to_home}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordWrapper;
