'use client';
import {Spinner} from '@/asset/icons/spinner';
import img from '@/asset/loginImg1.png';
import LangSelector from '@/components/lang-selector';
import {Button} from '@/components/ui/button';
import {Input} from '@/components/ui/input';
import {Label} from '@/components/ui/label';
import {useToast} from '@/hooks/use-toast';
import {
  PROFILE,
  RECAPTCHA_SECRET_KEY,
  RECAPTCHA_SITE_KEY,
  TOKEN,
} from '@/lib/apis/keywords';
import {customerLogin} from '@/lib/slices/customerAuthSlice';
import {useFormik} from 'formik';
import Cookies from 'js-cookie';
import {useRouter} from 'next-nprogress-bar';
import Image from 'next/image';
import Link from 'next/link';
import {useEffect, useState} from 'react';
import ReCAPTCHA from 'react-google-recaptcha';
import {useDispatch} from 'react-redux';
import * as yup from 'yup';
import {cn} from '@/lib/utils';
import {Eye, EyeOff} from '../../../../../public/icons';

const SignIn = ({lang}) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const {toast} = useToast();

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const token = Cookies.get(TOKEN);
    if (token) {
      router.push('/');
    }
  }, []);

  const [showPassword, setShowPassword] = useState(false);

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
      captcha: '',
    },
    validationSchema: yup.object({
      email: yup
        .string()
        .email(lang.email_is_invalid)
        .required(lang.email_is_required),
      password: yup.string().required(lang.password_is_required),
      captcha: yup.string().required(lang.please_verify),
    }),
    onSubmit: async values => {
      setIsLoading(true);
      const data = {
        username: values.email,
        password: values.password,
        recaptcha: values.captcha,
      };

      try {
        const response = await dispatch(customerLogin(data)).unwrap();

        if (response.success) {
          toast({
            variant: 'success',
            title: lang.login_successfully,
          });

          Cookies.set(PROFILE, JSON.stringify(response.customer), {expires: 7});
          Cookies.set(TOKEN, response.token, {expires: 7});

          router.push(`/${lang.lang}/`);
        } else {
          toast({
            variant: 'destructive',
            title: lang.login_failed,
          });
        }
      } catch (error) {
        toast({
          variant: 'destructive',
          title: lang.login_failed,
        });
      } finally {
        setIsLoading(false);
      }
    },
  });

  return (
    <div className="flex md:flex-row flex-col gap-7 md:gap-0 items-center h-dvh w-full relative">
      {/* Image Section */}
      <div className="hidden md:block relative w-2/5 h-full">
        <Image
          src={img.src}
          alt="logo"
          width={500}
          height={500}
          className="absolute inset-0 w-full h-full object-cover"
        />
      </div>

      {/* Form Section */}
      <div className="w-full h-fit max-h-full overflow-y-auto p-5 md:w-3/5 pt-20 pb-10">
        <div
          className={cn(
            'absolute top-5 p-2 rounded-md bg-secondary z-50',
            lang.lang === 'ar' ? 'left-5' : 'right-5',
          )}>
          <LangSelector lang={lang} />
        </div>
        <div className="w-full max-w-md mx-auto my-auto">
          <form onSubmit={formik.handleSubmit}>
            <h2 className="md:text-5xl text-3xl font-semibold text-center mb-6">
              {lang.customer_login}
            </h2>
            <p className="text-sm md:text-base text-gray-600 font-normal text-center mb-6 md:mb-14">
              {lang.if_you_have_an_account_sign_in_with_your_email_address}
            </p>
            <div className="mb-4 md:mb-6 space-y-2">
              <Label>
                {lang.email}
                <sup className="error">*</sup>
              </Label>
              <Input
                type="email"
                name="email"
                placeholder="Email"
                onChange={formik.handleChange}
                value={formik.values.email}
              />
              {formik.touched.email && formik.errors.email && (
                <p className="error">{formik.errors.email}</p>
              )}
            </div>

            <div className="mb-4 space-y-2">
              <Label>
                {lang.password}
                <sup className="text-red-500">*</sup>
              </Label>
              <div className="relative">
                <Input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  placeholder="Password"
                  onChange={formik.handleChange}
                  value={formik.values.password}
                  className="pr-10"
                  // autoComplete="new-password"
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

            <div className="text-right mb-4 text-sm md:text-base text-gray-700">
              <Link href="/forgot-password">{lang.forgot_your_password}</Link>
            </div>

            <ReCAPTCHA
              name="captcha"
              id="captcha"
              sitekey={RECAPTCHA_SITE_KEY}
              className="w-full"
              onChange={val => formik.setFieldValue('captcha', val)}
            />
            {formik.touched.captcha && formik.errors.captcha && (
              <p className="text-red-500 text-sm mt-1">
                {lang.captcha_is_invalid}
              </p>
            )}

            <Button
              type="submit"
              variant="secondary"
              disabled={isLoading}
              className={cn(
                'w-full text-sm lg:text-base mt-8',
                isLoading ? 'bg-primary' : '',
              )}>
              {isLoading ? <Spinner /> : lang.sign_in}
            </Button>

            <p className="text-sm text-center mt-3">
              {lang.dont_have_an_account}{' '}
              <Link
                href={`/${lang.lang}/sign-up`}
                className="font-bold hover:underline">
                {lang.register}
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
