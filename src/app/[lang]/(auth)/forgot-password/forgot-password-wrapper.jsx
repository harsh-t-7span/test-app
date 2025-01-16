'use client';
import {Spinner} from '@/asset/icons/spinner';
import img from '@/asset/loginImg1.png';
import LangSelector from '@/components/lang-selector';
import {Button} from '@/components/ui/button';
import {Input} from '@/components/ui/input';
import {useToast} from '@/hooks/use-toast';
import {RECAPTCHA_SITE_KEY} from '@/lib/apis/keywords';
import {
  clearMessage,
  customerForgotPassword,
} from '@/lib/slices/customerAuthSlice';
import {cn} from '@/lib/utils';
import {useFormik} from 'formik';
import {useRouter} from 'next-nprogress-bar';
import Image from 'next/image';
import Link from 'next/link';
import {useEffect} from 'react';
import ReCAPTCHA from 'react-google-recaptcha';
import {useDispatch, useSelector} from 'react-redux';
import * as yup from 'yup';

const ForgotPasswordWrapper = ({lang}) => {
  const {toast} = useToast();
  const router = useRouter();

  const {message, isError, isLoading} = useSelector(
    state => state.customerData,
  );
  const dispatch = useDispatch();

  const formik = useFormik({
    initialValues: {
      email: '',
      captcha: '',
    },
    validationSchema: yup.object({
      email: yup
        .string()
        .email(lang.email_is_invalid)
        .required(lang.email_is_required),
      captcha: yup.string().required(lang.please_verify),
    }),
    onSubmit: async values => {
      const data = {
        email: values.email,
      };

      try {
        const response = await dispatch(customerForgotPassword(data)).unwrap();

        if (response && response.status === true) {
          formik.resetForm();
          toast({
            variant: 'success',
            title: lang.mail_sent || 'Mail Sent',
          });
          router.push('/sign-in');
        } else {
          toast({
            variant: 'destructive',
            title: response.msg || 'Something went wrong. Please try again.',
          });
        }
      } catch (error) {
        toast({
          variant: 'destructive',
          title: response.msg,
        });
        console.error('Forgot password failed:', error);
      }
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
            <h2 className="md:text-5xl text-3xl font-semibold text-center mb-6">
              {lang.forgot_password}
            </h2>
            <h6 className="text-center mb-5">
              {lang.please_enter_your_email_address}
            </h6>
            <div className="mb-6">
              <label>
                {lang.email} <sup className="error">*</sup>
              </label>
              <Input
                type="email"
                name="email"
                placeholder="email"
                onChange={formik.handleChange}
                value={formik.values.email}
              />
              {formik.touched.email && formik.errors.email ? (
                <p className="error">{formik.errors.email}</p>
              ) : null}
            </div>

            <div>
              <ReCAPTCHA
                name={'captcha'}
                id={'captcha'}
                sitekey={RECAPTCHA_SITE_KEY}
                onChange={val => formik.setFieldValue('captcha', val)}
              />
              {formik.touched.captcha && formik.errors.captcha ? (
                <p className="error">{formik.errors.captcha}</p>
              ) : null}
            </div>

            <Button
              variant="secondary"
              type="submit"
              className="my-6 w-full"
              disabled={isLoading}>
              {isLoading ? (
                <Spinner animation="border" size="sm" />
              ) : (
                lang.forgot_password
              )}
            </Button>
            <p className="text-center">
              {lang.already_have_an_account}{' '}
              <Link href={'/sign-in'} className="font-semibold">
                {lang.sign_in}
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordWrapper;
