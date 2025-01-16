'use client';

import React, {useState} from 'react';
import * as Yup from 'yup';
import {useFormik} from 'formik';
import {useDispatch, useSelector} from 'react-redux';
import parsePhoneNumberFromString from 'libphonenumber-js';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {Button} from '@/components/ui/button';
import {Input} from '@/components/ui/input';
import {Textarea} from '@/components/ui/textarea';
import {Checkbox} from '@/components/ui/checkbox';
import {Label} from '@/components/ui/label';
import {
  addShippingAddress,
  editShippingAddress,
} from '@/lib/slices/customerAuthSlice';
import {
  CountrySelectField,
  StateSelectField,
  CitySelectField,
} from './country-state-city-select-field/';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';

const ShippingModal = ({
  show,
  setShow,
  editAddressData,
  setEditAddressData,
  editableData,
  lang,
}) => {
  const {customer, addressLoading} = useSelector(state => state.customerData);
  const {countryList} = useSelector(state => state.currencyData);
  const [currentlyOpenSelect, setCurrentlyOpenSelect] = useState(null);

  const dispatch = useDispatch();

  // Validation schema
  const validationSchema = Yup.object({
    firstname: Yup.string().required('First Name is required'),
    lastname: Yup.string().required('Last Name is required'),
    phone: Yup.string().required('Phone Number is required'),
    address: Yup.string().required('Address is required'),
    country: Yup.string().required('Country is required'),
    state: Yup.string().required('State is required'),
    city: Yup.string().required('City is required'),
    postcode: Yup.string()
      .matches(/^[0-9]+$/, 'Invalid zip code format')
      .required('Zip code is required'),
  });

  // Formik setup
  const formik = useFormik({
    initialValues: {
      firstname: editableData ? editAddressData?.firstname : '',
      lastname: editableData ? editAddressData?.lastname : '',
      phone: editableData ? editAddressData?.telephone : '',
      address: editableData ? editAddressData.street[0] : '',
      country: editableData ? editAddressData?.country_id : '',
      state: editableData ? editAddressData?.region : '',
      stateCode: editableData ? editAddressData?.region : '',
      city: editableData ? editAddressData?.city : '',
      postcode: editableData ? editAddressData?.postcode : '',
      is_default_shipping: editAddressData?.is_default_shipping || false,
      is_default_billing: editAddressData?.is_default_billing || false,
    },
    validationSchema,
    enableReinitialize: true,
    onSubmit: async values => {
      const data = {
        address: {
          region: {
            region_code: values.state,
            region: values.state,
            region_id: 0,
          },
          region_id: 0,
          country_id: values.country,
          street: [values.address],
          telephone: values.phone,
          postcode: values.postcode,
          city: values.city,
          firstname: values.firstname,
          lastname: values.lastname,
          customer_id: customer?.customer_id,
          default_shipping: values.is_default_shipping,
          default_billing: values.is_default_billing,
        },
      };

      try {
        if (editableData) {
          await dispatch(
            editShippingAddress({
              addressId: editAddressData.id,
              newAddress: data,
            }),
          ).unwrap();
          setShow(false);
          setEditAddressData('');
        } else {
          await dispatch(addShippingAddress(data)).unwrap();
          setShow(false);
        }
      } catch (error) {
        console.error('Address operation failed:', error);
      }
    },
  });

  const handlePhoneChange = value => {
    formik.setFieldValue('phone', value);
    if (value) {
      const phoneNumber = parsePhoneNumberFromString(value);
      if (phoneNumber && phoneNumber.country) {
        formik.setFieldValue('country', phoneNumber.country);
      }
    }
  };

  return (
    <div className="w-full">
      <Dialog open={show} onOpenChange={setShow}>
        <DialogContent
          aria-describedby={undefined}
          className="sm:max-w-[425px] lg:max-w-[60%]">
          <DialogHeader>
            <DialogTitle>
              {editableData ? 'Edit Address' : 'Add New Address'}
            </DialogTitle>
          </DialogHeader>
          <form
            onSubmit={formik.handleSubmit}
            className="space-y-4 h-[400px] lg:h-auto max-h-[90vh] overflow-y-auto px-2">
            <div className="lg:grid lg:grid-cols-2 gap-4 space-y-4 lg:space-y-0">
              <div className="space-y-2">
                <Label htmlFor="firstname">
                  First Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  name="firstname"
                  className="h-14"
                  placeholder="Enter First name"
                  value={formik.values.firstname}
                  onChange={formik.handleChange}
                />
                {formik.touched.firstname && formik.errors.firstname && (
                  <p className="text-red-500 text-sm">
                    {formik.errors.firstname}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastname">
                  Last Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  className="h-14"
                  name="lastname"
                  placeholder="Enter Last name"
                  value={formik.values.lastname}
                  onChange={formik.handleChange}
                />
                {formik.touched.lastname && formik.errors.lastname && (
                  <p className="text-red-500 text-sm">
                    {formik.errors.lastname}
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">
                Address <span className="text-red-500">*</span>
              </Label>
              <Textarea
                name="address"
                placeholder="Enter Address"
                value={formik.values.address}
                onChange={formik.handleChange}
              />
              {formik.touched.address && formik.errors.address && (
                <p className="text-red-500 text-sm">{formik.errors.address}</p>
              )}
            </div>

            <div className="lg:grid lg:grid-cols-2 gap-4 space-y-4 lg:space-y-0">
              <div className="space-y-2">
                <Label htmlFor="country">
                  Country <span className="text-red-500">*</span>
                </Label>
                {/* <CountrySelectField
                  formik={formik}
                  lang={lang}
                  stateFieldName="state"
                  fieldName="country"
                  labelName="Country"
                  countrycode="country"
                  countryList={countryList}
                  isReadOnly={false}
                /> */}
                <CountrySelectField
                  formik={formik}
                  fieldName="country"
                  stateFieldName="state"
                  cityFieldName="city"
                  labelName="Country"
                  countryList={countryList}
                  isReadOnly={false}
                  lang={lang}
                  currentlyOpenSelect={currentlyOpenSelect}
                  setCurrentlyOpenSelect={setCurrentlyOpenSelect}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">
                  Phone Number <span className="text-red-500">*</span>
                </Label>
                <PhoneInput
                  country="qa"
                  value={formik.values.phone}
                  onChange={handlePhoneChange}
                  inputStyle={{
                    height: '56px',
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
                  <p className="text-red-500 text-sm">{formik.errors.phone}</p>
                )}
              </div>
            </div>

            <div className="lg:grid lg:grid-cols-3 gap-4 space-y-4 lg:space-y-0">
              <div className="space-y-2">
                <Label htmlFor="state">
                  State <span className="text-red-500">*</span>
                </Label>
                {/* <StateSelectField
                  formik={formik}
                  lang={lang}
                  cityFieldName="city"
                  fieldName="state"
                  labelName="State"
                  countrycode="country"
                /> */}
                <StateSelectField
                  formik={formik}
                  fieldName="state"
                  cityFieldName="city"
                  countrycode="country"
                  labelName="State"
                  isReadOnly={false}
                  lang={lang}
                  currentlyOpenSelect={currentlyOpenSelect}
                  setCurrentlyOpenSelect={setCurrentlyOpenSelect}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="city">
                  City <span className="text-red-500">*</span>
                </Label>
                {/* <CitySelectField
                  lang={lang}
                  formik={formik}
                  stateFieldName="state"
                  fieldName="city"
                  labelName="City"
                  countrycode="country"
                /> */}
                <CitySelectField
                  formik={formik}
                  fieldName="city"
                  stateFieldName="state"
                  countrycode="country"
                  labelName="City"
                  isReadOnly={false}
                  lang={lang}
                  currentlyOpenSelect={currentlyOpenSelect}
                  setCurrentlyOpenSelect={setCurrentlyOpenSelect}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="postcode">
                  Zip <span className="text-red-500">*</span>
                </Label>
                <Input
                  name="postcode"
                  className="h-14"
                  placeholder="Zipcode"
                  value={formik.values.postcode}
                  onChange={formik.handleChange}
                />
                {formik.touched.postcode && formik.errors.postcode && (
                  <p className="text-red-500 text-sm">
                    {formik.errors.postcode}
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="is_default_billing"
                  name="is_default_billing"
                  checked={formik.values.is_default_billing}
                  onCheckedChange={checked =>
                    formik.setFieldValue('is_default_billing', checked)
                  }
                />
                <Label htmlFor="is_default_billing">
                  Add as default billing address
                </Label>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="is_default_shipping"
                  name="is_default_shipping"
                  checked={formik.values.is_default_shipping}
                  onCheckedChange={checked =>
                    formik.setFieldValue('is_default_shipping', checked)
                  }
                />
                <Label htmlFor="is_default_shipping">
                  Add as default shipping address
                </Label>
              </div>
            </div>

            <div className="flex justify-end">
              <Button
                className="hover:bg-black"
                type="submit"
                disabled={addressLoading}>
                {addressLoading ? 'Saving...' : 'Ship Here'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ShippingModal;
