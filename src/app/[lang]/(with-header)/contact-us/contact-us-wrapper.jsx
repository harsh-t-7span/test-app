'use client';
import React, {useEffect, useState} from 'react';
import ReCAPTCHA from 'react-google-recaptcha';
import {useDispatch, useSelector} from 'react-redux';
import {RECAPTCHA_SITE_KEY} from '@/lib/apis/keywords';
import * as yup from 'yup';
import {useFormik} from 'formik';
import {clearMessage, sendContact} from '@/lib/slices/cmsSlice';
import Image from 'next/image';
import {Button, Input, Label} from '@/components';
import {Textarea} from '@/components/ui/textarea';
import {Spinner} from '@/asset/icons/spinner';
import contactBnrImg from '/public/images/contactbnr.jpg';
import {Alert, AlertDescription} from '@/components/ui/alert';
import {X} from 'lucide-react';
import ModernityBend from '@/components/ModernityBend/ModernityBend';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';

const ContactUsWrapper = ({lang}) => {
  const dispatch = useDispatch();
  const {isLoading, message, isError} = useSelector(state => state.cmsData);
  const [isVisible, setIsVisible] = useState(true);

  const handleClose = () => {
    setIsVisible(false);
    dispatch(clearMessage());
  };

  const formik = useFormik({
    initialValues: {
      firstname: '',
      lastname: '',
      email: '',
      phone: '',
      message: '',
      captcha: '',
    },
    enableReinitialize: true,
    validationSchema: yup.object({
      firstname: yup.string().required(lang.first_name_is_required),
      lastname: yup.string().required(lang.last_name_is_required),
      email: yup
        .string()
        .email(lang.invalid_email_address)
        .required(lang.email_is_required),
      phone: yup.string().required(lang.phone_number_is_required),
      message: yup.string().required(lang.message_is_required),
      captcha: yup.string().required(lang.please_check_it),
    }),
    onSubmit: async values => {
      const data = {
        name: `${values.firstname} ${values.lastname}`,
        email: values.email,
        phone: values.phone,
        message: values.message,
      };
      dispatch(sendContact(data))
        .unwrap()
        .then(data => {
          if (data?.status) {
            formik.resetForm();
          }
        })
        .catch(error => {
          console.error('contact send failed:', error);
        });
    },
  });

  useEffect(() => {
    dispatch(clearMessage());
  }, [dispatch]);

  return (
    <>
      <section className="mainBnr">
        <div className="bnrTxt pt-5 lg:pt-20">
          <div className="container">
            <h2 className="text-xl lg:text-3xl font-extrabold mb-2">
              {lang.the_new_way_to || 'The New Way to'}
              <br /> {lang.progress || 'Progress'}.
            </h2>
            <Button variant="secondary">
              {lang.learn_more || 'Learn More'}
            </Button>
          </div>
        </div>
        <Image
          src={contactBnrImg}
          height={1920}
          width={530}
          alt="bnr"
          className="h-64 md:h-80 lg:h-[400px] 2xl:h-[600px] object-cover"
        />
      </section>

      <div className="bg-primary-gradient">
        <div className="container">
          <div className="py-12 max-w-3xl mx-auto">
            <h4 className="text-2xl text-center font-bold mb-2">
              {lang.lets_talk || 'Let&apos;s Talk'}
            </h4>
            <p className="text-center text-gray-500 mb-4">
              {lang.write_us_a_note_and_well_get_back_to_you_as_quickly_as_possible ||
                'Write us a note and we&apos;ll get back to you as quickly as possible.,'}
            </p>

            {message && isError && (
              <Alert
                className="mb-3"
                variant="destructive"
                onClose={() => dispatch(clearMessage())}>
                <button
                  className="absolute top-3.5 right-3 text-gray-400 hover:text-gray-500"
                  onClick={handleClose}>
                  <X />
                </button>
                <AlertDescription>{message}</AlertDescription>
              </Alert>
            )}
            {message && !isError && (
              <Alert className="mb-3" onClose={() => dispatch(clearMessage())}>
                <button
                  className="absolute top-3.5 right-3 text-gray-400 hover:text-gray-500"
                  onClick={handleClose}>
                  <X />
                </button>
                <AlertDescription>{message}</AlertDescription>
              </Alert>
            )}
            <form onSubmit={formik.handleSubmit}>
              <div className="md:grid md:grid-cols-2 gap-4 space-y-4 md:space-y-0">
                <div>
                  <Label>
                    {lang.first_name || 'First Name'}{' '}
                    <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    type="text"
                    placeholder={lang.first_name || 'First Name'}
                    name="firstname"
                    value={formik.values.firstname}
                    onChange={formik.handleChange}
                  />
                  {formik.touched.firstname && formik.errors.firstname && (
                    <p className="text-red-500 text-sm mt-1">
                      {formik.errors.firstname}
                    </p>
                  )}
                </div>
                <div>
                  <Label>{lang.last_name || 'Last Name'} </Label>
                  <Input
                    type="text"
                    placeholder={lang.last_name || 'Last Name'}
                    name="lastname"
                    value={formik.values.lastname}
                    onChange={formik.handleChange}
                  />
                  {formik.touched.lastname && formik.errors.lastname && (
                    <p className="text-red-500 text-sm mt-1">
                      {formik.errors.lastname}
                    </p>
                  )}
                </div>

                <div>
                  <Label>
                    {lang.email || 'Email'}{' '}
                    <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    type="text"
                    placeholder={lang.email || 'Email'}
                    name="email"
                    value={formik.values.email}
                    onChange={formik.handleChange}
                  />
                  {formik.touched.email && formik.errors.email && (
                    <p className="text-red-500 text-sm mt-1">
                      {formik.errors.email}
                    </p>
                  )}
                </div>
                <div>
                  <Label>{lang.phone_number || 'Phone Number'} </Label>
                  {/* <PhoneInput
                    name="phone"
                    international
                    defaultCountry="QA"
                    value={formik.values.phone}
                    onChange={val => formik.setFieldValue('phone', val)}
                    className="border border-input rounded-lg w-full h-10 pl-4 py-2 items-center flex gap-2 overflow-hidden"
                  /> */}

                  <PhoneInput
                    country="qa"
                    value={formik.values.phone}
                    onChange={val => formik.setFieldValue('phone', val)}
                    inputStyle={{
                      height: '40px',
                      width: '100%',
                      borderRadius: '8px',
                      border: '1px solid #d1d5db',
                    }}
                    containerStyle={{
                      width: '100%',
                    }}
                    dropdownStyle={{
                      maxHeight: '200px',
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
                <div
                  className="col-span-2"
                  controlId="exampleForm.ControlTextarea1">
                  <Label>
                    {lang.whats_on_your_mind}{' '}
                    <span className="text-red-500">*</span>
                  </Label>
                  <Textarea
                    name="message"
                    value={formik.values.message}
                    onChange={formik.handleChange}
                  />

                  {formik.touched.message && formik.errors.message && (
                    <p className="text-red-500 text-sm mt-1">
                      {formik.errors.message}
                    </p>
                  )}
                </div>
              </div>
              <div className="captchaBg">
                <div>
                  <ReCAPTCHA
                    name={'captcha'}
                    id={'captcha'}
                    sitekey={RECAPTCHA_SITE_KEY}
                    onChange={val => formik.setFieldValue('captcha', val)}
                    className="mt-4"
                  />
                </div>

                {formik.touched.captcha && formik.errors.captcha ? (
                  <p className="text-red-500 text-sm mt-1">
                    {formik.errors.captcha}
                  </p>
                ) : null}
              </div>

              <div className="text-center mb-3 mt-3 ">
                <Button
                  type="submit"
                  variant="secondary"
                  className={`w-full max-w-lg  hover:bg-primary ${
                    isLoading && 'cursor-not-allowed'
                  }`}
                  disabled={isLoading}>
                  {isLoading ? (
                    <Spinner animation="border" size="sm" />
                  ) : (
                    lang.submit
                  )}
                </Button>
              </div>
            </form>
            <div className="text-center">
              <Button
                className="bg-green-500 hover:bg-green-600 max-w-lg w-full"
                onClick={() => {
                  // whatsAppFunc('+97474749722');
                  window.open('https://wa.me/+97474749722', '_blank');
                }}>
                <i className="fa-brands fa-whatsapp" />
                {lang.connect_on_whats_app || 'Connect On WhatsApp'}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <ModernityBend lang={lang} />
    </>
  );
};

export default ContactUsWrapper;
