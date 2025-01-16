'use client';

import {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';

import {useRouter} from 'next-nprogress-bar';

import img from '@/asset/loginImg1.png';
import LangSelector from '@/components/lang-selector';
import {Button} from '@/components/ui/button';
import {Input} from '@/components/ui/input';
import {useToast} from '@/hooks/use-toast';
import {
  clearMessage,
  customerChangePassword,
} from '@/lib/slices/customerAuthSlice';
import {cn} from '@/lib/utils';
import {useFormik} from 'formik';
import Image from 'next/image';
import * as yup from 'yup';
import {Spinner} from '../../../../asset/icons/spinner';
import {Eye, EyeOff} from '../../../../../public/icons';

const ChangePasswordWrapper = ({lang}) => {
  const {toast} = useToast();

  const router = useRouter();
  const {message, isError, isLoading, customer, isLoggedIn} = useSelector(
    state => state.customerData,
  );

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    if (!isLoggedIn) {
      router.push(`/${lang.lang}/`);
    }
  }, [isLoggedIn]);

  const dispatch = useDispatch();
  const formik = useFormik({
    initialValues: {
      currentPassword: '',
      password: '',
      confirmPassword: '',
    },

    validationSchema: yup.object({
      currentPassword: yup
        .string()
        .min(8, 'Password must be at least 8 characters')
        .required(lang.current_password_is_required),
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
        .required(lang.new_password_is_required),
      confirmPassword: yup
        .string()
        .oneOf([yup.ref('password'), null], 'Passwords do not match')
        .required(lang.new_confirm_password_is_required),
    }),
    onSubmit: async values => {
      const data = {
        customerId: customer?.customer_id,
        newPassword: values.confirmPassword,
        currentPassword: values.currentPassword,
      };
      dispatch(customerChangePassword(data))
        .unwrap()
        .then(data => {
          if (data.success) {
            formik.resetForm();
            toast({
              variant: 'success',
              title: data.message || lang.password_changed_successfully,
            });
            router.push('/');
          } else {
            toast({
              variant: 'destructive',
              title: data.message || lang.password_change_failed,
            });
          }
        })
        .catch(error => {
          console.error('change password failed:', error);
        });
    },
  });

  useEffect(() => {
    dispatch(clearMessage());
  }, [dispatch]);

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
            <h2 className="md:text-5xl text-3xl font-semibold text-center mb-8">
              {lang.change_password}
            </h2>

            {/* Current Password */}
            <div className="mb-4 md:mb-6 space-y-2">
              <label>
                {lang.current_password} <sup className="error">*</sup>
              </label>
              <div className="relative">
                <Input
                  type={showCurrentPassword ? 'text' : 'password'}
                  className="form-control"
                  name="currentPassword"
                  onChange={formik.handleChange}
                  value={formik.values.currentPassword}
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPassword(prev => !prev)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3">
                  {showCurrentPassword ? (
                    <EyeOff
                      className={`${
                        formik.values.currentPassword ? 'visible' : 'invisible'
                      }`}
                    />
                  ) : (
                    <Eye
                      className={`${
                        formik.values.currentPassword ? 'visible' : 'invisible'
                      }`}
                    />
                  )}
                </button>
              </div>
              {formik.touched.currentPassword &&
                formik.errors.currentPassword && (
                  <p className="error">{formik.errors.currentPassword}</p>
                )}
            </div>

            {/* New Password */}
            <div className="mb-4 md:mb-6 space-y-2">
              <label>
                {lang.new_password} <sup className="error">*</sup>
              </label>
              <div className="relative">
                <Input
                  type={showNewPassword ? 'text' : 'password'}
                  className="form-control"
                  name="password"
                  onChange={formik.handleChange}
                  value={formik.values.password}
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(prev => !prev)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3">
                  {showNewPassword ? (
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
                <p className="error">{formik.errors.password}</p>
              )}
            </div>

            {/* Confirm New Password */}
            <div className="mb-4 md:mb-6 space-y-2">
              <label>
                {lang.new_confirm_password} <sup className="error">*</sup>
              </label>
              <div className="relative">
                <Input
                  type={showConfirmPassword ? 'text' : 'password'}
                  className="form-control"
                  name="confirmPassword"
                  onChange={formik.handleChange}
                  value={formik.values.confirmPassword}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(prev => !prev)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3">
                  {showConfirmPassword ? (
                    <EyeOff
                      className={`${
                        formik.values.confirmPassword ? 'visible' : 'invisible'
                      }`}
                    />
                  ) : (
                    <Eye
                      className={`${
                        formik.values.confirmPassword ? 'visible' : 'invisible'
                      }`}
                    />
                  )}
                </button>
              </div>
              {formik.touched.confirmPassword &&
                formik.errors.confirmPassword && (
                  <p className="error">{formik.errors.confirmPassword}</p>
                )}
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
                  lang.change_password
                )}
              </Button>
              <Button
                type="button"
                variant="outline"
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

export default ChangePasswordWrapper;
