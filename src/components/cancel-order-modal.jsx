'use client';

import React from 'react';
import {useFormik} from 'formik';
import * as yup from 'yup';
import {useSelector, useDispatch} from 'react-redux';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {Button} from '@/components/ui/button';
import {Textarea} from '@/components/ui/textarea';
import {Spinner} from '../asset/icons/spinner';
import {addReviewProduct} from '@/lib/slices/productSlice';

const CancelOrderModal = ({
  showModal,
  setShowModal,
  isOpen,
  onClose,
  productData,
}) => {
  const dispatch = useDispatch();
  const {isCancelProduct} = useSelector(state => state.orderData);

  const formik = useFormik({
    initialValues: {
      reason: '',
    },
    validationSchema: yup.object({
      reason: yup.string().required('This field is required'),
    }),
    onSubmit: async values => {
      const data = {
        reason: values.reason,
      };

      dispatch(addReviewProduct(data))
        .unwrap()
        .then(data => {
          if (data) {
            setShowModal(false);
          }
        })
        .catch(error => {
          console.error('Review Product failed:', error);
        });
    },
  });

  return (
    <Dialog open={showModal} onOpenChange={setShowModal}>
      <DialogContent aria-describedby={undefined} className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Cancel Order</DialogTitle>
        </DialogHeader>
        <form onSubmit={formik.handleSubmit}>
          <Textarea
            placeholder="Enter your reason here"
            {...formik.getFieldProps('reason')}
            className="h-[100px] resize-none"
          />
          {formik.touched.reason && formik.errors.reason && (
            <p className="mt-1 text-sm text-red-600">{formik.errors.reason}</p>
          )}
          <DialogFooter className="mt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button
              type="submit"
              className="hover:bg-black"
              disabled={formik.isSubmitting || !formik.values.reason.trim()}>
              {formik.isSubmitting ? (
                <>
                  {/* <Loader2 className="mr-2 h-4 w-4 animate-spin" /> */}
                  <Spinner />
                  Submitting
                </>
              ) : (
                'Submit'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CancelOrderModal;
